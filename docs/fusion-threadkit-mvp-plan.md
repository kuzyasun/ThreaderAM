# План розробки MVP для Fusion-плагіна створення різьб для FDM-друку

Так, для MVP це має сенс. Я б заклав фундамент уже зараз так, ніби це майбутній multi-CAD продукт, але **перший host робив би тільки для Fusion**, причому **host-шар на Python**, а **всю бізнес-логіку, математику, пресети, preview-обчислення і UI — на TypeScript**. Для UI беремо **Angular + Angular Material + Tailwind**. Причина проста: у Fusion офіційний шлях для add-in — **Python або C++**, зате custom palette офіційно рендериться через HTML і може вантажити локальний файл, web URL або навіть HTML-рядок. Це добре підходить для швидкого прототипування UI.

Ключове архітектурне рішення для MVP таке: **не намагатися запускати core-engine всередині Python**. Натомість зробити **тонкий Python adapter**, який лише реєструє команди Fusion, читає вибір користувача, створює/оновлює palette, приймає JSON-повідомлення і будує/оновлює геометрію у Fusion. Усе “розумне” — обчислення профілю різьби, толеранси під FDM, оцінка друкованості, шаровий preview, генерація geometry recipe — має жити в TypeScript. Palette у Fusion має двосторонній міст між Fusion і JavaScript, тому це природний шлях для швидкого MVP.

Я б одразу будував це як **ports-and-adapters**. Тобто core-engine взагалі не знає, що таке Fusion face, BRepEdge чи CommandInput. Він працює тільки з власними DTO: `ThreadSpec`, `ProfileSpec`, `PrintProfile`, `PreviewRequest`, `BuildPlan`, `ValidationIssue`, `RecommendationSet`. Це дозволить потім замінити TS core на Rust без ламання UI та без повного переписування назв методів і контрактів.

---

## 1. Зафіксувати ціль MVP і жорстко обрізати scope

Для першої версії не треба одразу робити “усе для всіх різьб”. Інакше потонете в UI та edge-cases. Я б зафіксував MVP так:

- тільки **Fusion**
- тільки **циліндрична різьба**
- тільки **external + internal**
- тільки **один старт**
- базові профілі: **triangular**, **trapezoidal**, **square-like / flat crest-root**
- базові FDM-параметри: nozzle width, layer height, material class, clearance preset
- preview не як “повний slicer”, а як **аналітичний layer preview**: сходинки по фланках, мінімальна товщина гребеня/западини, орієнтовна друкованість

Це дасть справжній testbed для математики і UX, але не роздує MVP.

## 2. Закласти структуру монорепо так, ніби інші CAD уже будуть

Я б робив так:

```text
threadkit/
  apps/
    fusion-host/
      addin/
        ThreadKit.manifest
        ThreadKit.py
        commands/
        fusion_bridge/
        fusion_preview/
        fusion_build/
        resources/
        web-dist/        # production build palette
  packages/
    domain/
    core-engine/
    ui-web/
    test-cases/
    dev-tools/
  docs/
    architecture/
    mvp-scope/
    contracts/
```

Суть така:

- `apps/fusion-host` — усе, що залежить від Fusion API
- `packages/domain` — типи, schema, enums, contracts
- `packages/core-engine` — чиста математика і логіка
- `packages/ui-web` — Angular UI для palette
- `packages/test-cases` — golden test fixtures для різьб і друк-профілів

Ця структура вже готова до майбутніх `solidworks-host`, `sketchup-host`, `onshape-app`.

## 3. Спочатку спроєктувати контракти, а не код

Це найважливіший крок, якщо ти хочеш потім безболісно перевести core на Rust.

Спочатку описати JSON/TS contracts, наприклад:

- `ThreadStandardMode`
- `ThreadOperationMode` (`external`, `internal`)
- `ThreadProfileShape`
- `ThreadSpec`
- `ThreadGeometryResult`
- `LayerPreviewRequest`
- `LayerPreviewResult`
- `PrintSettings`
- `PrintRecommendation`
- `BuildThreadPlan`
- `ValidationIssue`
- `HostSelectionContext`

Тоді Python host працює лише з цими контрактами. Ніяких Fusion-типів поза `fusion-host`.

Добре правило: **все, що перетинає межу між host і core, має бути серіалізованим JSON**.

## 4. Вибрати технології MVP

Я б вибрав саме такий стек:

- **Fusion host:** Python
- **UI:** Angular + Angular Material + Tailwind + TypeScript
- **Core-engine:** TypeScript, pure functions
- **Схеми:** Zod або аналогічний runtime validator
- **Візуалізації:** SVG/Canvas у palette
- **Dev orchestration:** pnpm workspace

Чому так: Fusion add-ins офіційно створюються як Python або C++, а palette офіційно вантажить HTML. Для девелопменту palette може відкривати навіть **web URL**, отже ти можеш ганяти UI через локальний dev server; для production — вантажити локальний `web-dist/index.html`.

## 5. Зробити Fusion host максимально “тонким”

У Python host мають бути лише ці ролі:

- register/unregister commands
- selection handling
- читання активного документа/компонента
- відкриття palette
- bridge Fusion ⇄ palette
- запуск preview redraw
- фінальне створення геометрії в моделі
- cleanup UI в `stop`

Fusion commands і UI-елементи мають жити в add-in lifecycle, а при unload треба чистити створені command definitions і controls, інакше залишаться “мертві” елементи UI.

## 6. Зробити UX гібридним: native command + rich palette

Найкращий UX для такого плагіна в Fusion, на мій погляд, не “тільки dialog” і не “тільки palette”, а комбінація:

- **native CommandInputs** для того, що природно робити в canvas:
  - вибір циліндричної грані / осі
  - external/internal
  - handedness
  - довжина
  - start offset / end offset
- **palette** для того, що краще робити в багатшому UI:
  - вибір профілю
  - розширені параметри профілю
  - presets
  - FDM recommendations
  - layer preview
  - warnings / quality score
  - compare variants

Palette у Fusion не прив’язана до lifetime однієї команди і може лишатись відкритою, поки користувач працює в workspace. Це саме те, що потрібно для “допоміжного UI”.

## 7. З першого дня робити palette як основний dev-майданчик

Я б зробив два режими palette:

- **dev mode:** palette вантажить `http://localhost:4200`
- **prod mode:** palette вантажить локальний `web-dist/index.html`

Практично це означає:

- не робити “function returns value immediately”
- робити `requestId`, `action`, `payload`
- отримувати `response` окремою подією

Тобто bridge відразу має бути асинхронним message bus.

## 8. Core-engine розбити на 5 підмодулів

Усередині `packages/core-engine` я б зробив так:

- `spec/` — нормалізація вводу
- `geometry/` — профіль, гелікс, sampling, перетини
- `printability/` — евристики під FDM
- `preview/` — DTO для preview та layer overlay
- `presets/` — матеріали, nozzle/layer presets, clearance presets

Методи називати вже “по-портованому”, наприклад:

- `normalizeThreadSpec`
- `buildThreadProfile`
- `sampleHelixPath`
- `buildThreadSurfaceSections`
- `estimateFdmClearance`
- `analyzeFlankPrintability`
- `buildLayerPreview`
- `buildFusionRecipe`
- `validateThreadSpec`

Тобто без слів `Fusion`, `Sketch`, `BRep`, `Face` у core.

## 9. Не робити одразу “справжній slicer preview”

Це пастка. Для MVP layer preview повинен бути **аналітичним**, не повним slicer-двигуном.

Я б робив 3 типи preview:

1. **Profile preview**  
   2D-переріз профілю з розмірами, crest/root widths, flank angles.

2. **Helix preview**  
   Спрощене 3D-представлення шляху й профілю.

3. **Layer preview**  
   Аналітичні зрізи по шарах:
   - де будуть сходинки
   - яка мінімальна товщина гребеня
   - де ризик “слизаного” профілю
   - де clearance занадто малий для nozzle/layer

Цього достатньо, щоб дати цінність користувачу без реалізації slicer-а.

## 10. Для Fusion preview використовувати temporary geometry + custom graphics

Офіційний стек для preview в Fusion тут дуже зручний:

- `Command.executePreview` — коли команда вже має достатньо даних для preview
- `TemporaryBRepManager` — для створення і маніпуляції тимчасовим B-Rep поза timeline/document overhead
- `Custom Graphics` — для live overlay у canvas

Я б так і розділив:

- швидкий live overlay — custom graphics
- складніша пробна геометрія — temporary BRep
- запис у модель — тільки на `Execute/OK`

## 11. Для MVP не покладатися на вбудований helix sketch tool — генерувати свій шлях

У Fusion немає автоматичного sketch tool для створення 3D helix/spiral у тому вигляді, який зручний для такого плагіна. Краще, щоб **core-engine сам генерував helix path**, а host створював його як spline/NURBS-based path.

Це дуже важливе рішення: якщо ти одразу зробиш власний генератор шляху, ти не прив’яжеш математику різьби до специфіки одного CAD.

## 12. Геометрію MVP будувати не через “магію”, а через явний recipe

Core-engine не повинен казати “створи мені різьбу у Fusion”. Він має повертати щось на кшталт:

- normalized dimensions
- sampled helix path
- profile points in local frame
- recommended alignment/orientation
- boolean intent (`join` / `cut`)
- preview sections
- warnings

Потім `fusion-build` вирішує, як саме це перетворити у Fusion feature.

## 13. Реалізацію фінальної геометрії робити у 2 етапи

Не намагайся одразу зробити “ідеальну параметричну feature-систему”. Я б ішов так:

### Етап A — швидкий working build
Створюєш path і sweep для профілю там, де це проходить без надлишкової складності.

### Етап B — production-grade build
Потім уже додаєш:
- акуратний старт/lead-in
- root relief
- clean boolean behavior
- history-friendly naming
- regeneration stability

MVP не має бути ідеальним по timeline elegance; він має дати змогу перевірити математику, UX і FDM heuristics.

## 14. FDM-рекомендації робити rule-based, а не “AI-style”

На першому етапі рекомендації мають бути прозорими:

- мінімальний clearance залежно від nozzle / layer / material class
- warning, якщо crest width менший за певну кількість extrusion widths
- warning, якщо flank step artifact занадто великий
- suggestion: друкувати external/internal з певною орієнтацією
- suggestion: trapezoid профіль для грубого силового з’єднання
- suggestion: flatter crest/root для кращої друкованості

Тобто користувач має бачити **чому** система радить саме це.

## 15. Дані для друку закласти як окрему підсистему preset-ів

Окремо зроби:

- material families: PLA / PETG / ABS-ASA / PA-CF / TPU
- machine classes: hobby FDM / enclosed / high-flow
- nozzle presets: 0.25 / 0.4 / 0.6 / 0.8
- quality presets: fine / balanced / strong

Потім `printability/` оперує не “голими числами”, а цими preset objects. Це пізніше сильно спростить порт на інші CAD і навіть окремий web configurator.

## 16. З першого дня покрити core-engine тестами

Я б обов’язково зробив:

- golden tests для відомих spec-ів
- property-based тести на валідність геометрії
- snapshot тести для preview DTO
- edge-case тести:
  - дуже дрібний pitch
  - дуже велика layer height
  - internal thread з малим clearance
  - flat/square-like профілі
  - extreme flank angles

Це і буде страховка, коли ти переноситимеш TS core на Rust.

## 17. План по спринтах

Я б розбив розробку так.

### Спринт 1 — skeleton
- монорепо
- `fusion-host` стартує
- команда з’являється в UI
- palette відкривається
- є JSON bridge
- dev/prod loading для palette

### Спринт 2 — contracts + basic core
- `domain` package
- `normalizeThreadSpec`
- базові Angular models/forms для UI
- `buildThreadProfile`
- базові presets
- basic validation

### Спринт 3 — UI v1
- Angular shell
- Angular Material layout
- Tailwind utility styling
- profile editor
- basic thread params
- print settings
- warning panel
- 2D profile preview

### Спринт 4 — geometry preview
- `sampleHelixPath`
- layer preview
- Fusion custom graphics overlay
- live redraw on parameter change

### Спринт 5 — commit geometry
- first working build path into model
- external thread
- internal thread
- undo/redo sanity
- naming / cleanup

### Спринт 6 — polish
- presets
- recommendations
- better error states
- save/load recent configs
- regression tests

## 18. Що не робити зараз

Ось що я б свідомо відклав:

- multi-start threads
- tapered / pipe threads
- full slicer simulation
- native protection / obfuscation
- cloud licensing
- SOLIDWORKS / SketchUp / Onshape hosts
- production-grade installer/updater
- full standards database

Інакше MVP перестане бути MVP.

## 19. Головний architectural rule

Найважливіше правило всього проєкту:

**Fusion host не обчислює різьбу. Він лише збирає context, показує UI, малює preview і комітить geometry recipe.**

Якщо ти це витримаєш, то:
- TS core потім відносно легко переїде в Rust
- Angular UI майже не постраждає
- інші CAD host-и будуть просто новими adapter-ами

## 20. Що я вважаю оптимальним стартом

Мій рекомендований стартовий стек для MVP такий:

- **Fusion host:** Python add-in
- **Palette UI:** Angular + Angular Material + Tailwind + TypeScript
- **Core:** pure TypeScript package
- **Bridge:** async JSON messages
- **Preview:** custom graphics + temporary geometry
- **Commit:** Fusion feature build from recipe
- **Architecture:** ports/adapters + DTO boundary

Це найшвидший шлях до живого прототипу, який не доведеться викидати після перевірки ідеї.
