# Конкретна структура папок і файлів для MVP ThreadKit

Так. Нижче даю **конкретну стартову структуру монорепо для MVP**, вже під:

- **Fusion host:** Python
- **UI:** Angular + Angular Material + Tailwind + TypeScript
- **Core:** TypeScript
- **Архітектура:** ports/adapters + DTO/contracts + async JSON bridge

---

## 1. Ціль структури

Ця структура має дати тобі одразу 4 речі:

1. **швидкий старт для Fusion MVP**
2. **мінімум дублювання між UI / core / host**
3. **простий майбутній перенос core на Rust**
4. **готову основу для `solidworks-host`, `sketchup-host`, `onshape-app`**

---

## 2. Рекомендована структура репозиторію

```text
threadkit/
  README.md
  pnpm-workspace.yaml
  package.json
  tsconfig.base.json
  .editorconfig
  .gitignore

  apps/
    fusion-host/
      README.md
      addin/
        ThreadKit.manifest
        ThreadKit.py

        bootstrap/
          startup.py
          shutdown.py

        commands/
          __init__.py
          register_commands.py
          thread_command.py
          thread_command_handlers.py

        palette/
          palette_manager.py
          palette_bridge.py
          palette_events.py

        fusion_selection/
          selection_reader.py
          selection_types.py
          cylinder_detector.py
          axis_resolver.py

        fusion_preview/
          preview_controller.py
          custom_graphics_preview.py
          temp_brep_preview.py

        fusion_build/
          build_controller.py
          build_external_thread.py
          build_internal_thread.py
          build_sweep_path.py
          build_profile_sketch.py
          build_boolean_ops.py

        fusion_mapping/
          map_selection_context.py
          map_build_plan_to_fusion.py
          map_preview_to_fusion.py

        fusion_state/
          session_state.py
          recent_configs.py

        messaging/
          message_dispatcher.py
          request_handlers.py
          response_builders.py

        config/
          env.py
          feature_flags.py
          palette_url.py

        utils/
          json_io.py
          logging_utils.py
          fusion_ui_utils.py
          error_utils.py

        resources/
          icons/
          localization/
          web-dist/   # Angular build output
          samples/

    # майбутнє:
    # solidworks-host/
    # sketchup-host/
    # onshape-app/

  packages/
    domain/
      package.json
      tsconfig.json
      src/
        index.ts

        contracts/
          thread-spec.ts
          profile-spec.ts
          print-settings.ts
          host-selection-context.ts
          build-plan.ts
          preview-request.ts
          preview-result.ts
          validation-issue.ts
          recommendation.ts
          message-envelope.ts

        enums/
          thread-operation-mode.ts
          thread-profile-shape.ts
          handedness.ts
          material-family.ts
          nozzle-size.ts
          quality-preset.ts
          preview-mode.ts

        types/
          geometry.ts
          points.ts
          units.ts
          ids.ts
          ranges.ts

        schemas/
          thread-spec.schema.ts
          print-settings.schema.ts
          build-plan.schema.ts
          message-envelope.schema.ts

    core-engine/
      package.json
      tsconfig.json
      vitest.config.ts
      src/
        index.ts

        spec/
          normalize-thread-spec.ts
          defaults.ts
          derived-values.ts

        geometry/
          build-thread-profile.ts
          helix-path.ts
          profile-sampling.ts
          swept-sections.ts
          thread-dimensions.ts
          thread-start-end.ts

        printability/
          estimate-clearance.ts
          analyze-flank-printability.ts
          analyze-crest-root-width.ts
          recommend-orientation.ts
          quality-score.ts

        preview/
          build-profile-preview.ts
          build-helix-preview.ts
          build-layer-preview.ts
          preview-annotations.ts

        presets/
          material-presets.ts
          nozzle-presets.ts
          layer-presets.ts
          quality-presets.ts
          thread-presets.ts

        validation/
          validate-thread-spec.ts
          validate-print-settings.ts
          validate-selection-context.ts

        planning/
          build-fusion-recipe.ts
          build-build-plan.ts
          build-warning-set.ts

        utils/
          math.ts
          angles.ts
          units.ts
          clamp.ts
          epsilon.ts

    ui-web/
      package.json
      angular.json
      tailwind.config.js
      postcss.config.js
      tsconfig.json
      src/
        index.html
        main.ts
        styles.css

        app/
          app.component.ts
          app.config.ts
          app.routes.ts

          core/
            services/
              bridge.service.ts
              state.service.ts
              settings.service.ts
              presets.service.ts
              selection-context.service.ts

            models/
              ui-thread-form.model.ts
              ui-warning.model.ts
              ui-preview.model.ts

            store/
              ui-state.ts
              ui-actions.ts
              ui-selectors.ts

          features/
            shell/
              shell.component.ts

            thread-editor/
              thread-editor.component.ts
              sections/
                base-params-card.component.ts
                profile-card.component.ts
                print-settings-card.component.ts
                recommendations-card.component.ts
                warnings-card.component.ts

            preview-panel/
              preview-panel.component.ts
              tabs/
                profile-preview-tab.component.ts
                helix-preview-tab.component.ts
                layer-preview-tab.component.ts

            selection-panel/
              selection-panel.component.ts

            presets-panel/
              presets-panel.component.ts

          shared/
            components/
              numeric-input/
              unit-input/
              segmented-toggle/
              warning-list/
              score-badge/
              svg-profile-viewer/
              canvas-layer-viewer/

            material/
              material.module.ts

            utils/
              form-mappers.ts
              display-formatters.ts

        assets/
          icons/
          mock-data/

    test-cases/
      package.json
      src/
        fixtures/
          thread-specs/
            external-m40-balanced.json
            internal-m40-balanced.json
            trapezoid-coarse-pla.json
            fine-thread-petg.json

          print-settings/
            nozzle-04-layer-02-pla.json
            nozzle-06-layer-03-petg.json

          selection-context/
            simple-cylinder-face.json

        golden/
          preview-results/
          build-plans/
          recommendations/

    dev-tools/
      package.json
      scripts/
        copy-ui-build-to-fusion.mjs
        watch-ui-to-fusion.mjs
        validate-fixtures.mjs
        generate-icons.mjs

  docs/
    architecture/
      01-overview.md
      02-boundaries.md
      03-message-bridge.md
      04-fusion-host-notes.md
      05-rust-migration-plan.md

    contracts/
      message-envelope.md
      thread-spec.md
      build-plan.md
      preview-result.md

    backlog/
      mvp-epics.md
      sprint-1.md
      sprint-2.md
```

---

## 3. Що має бути в кожному верхньому модулі

### `apps/fusion-host`
Усе, що знає про Fusion API.

Тут не повинно бути:
- математики профілю
- FDM-евристик
- складної логіки рекомендацій
- “розумних” обчислень

Тут повинно бути:
- реєстрація команд
- відкриття palette
- читання selection
- виклик core через JSON contracts
- preview у Fusion
- commit геометрії в модель

### `packages/domain`
Це **єдине джерело правди** для контрактів між host, UI та core.

Тут лежать:
- DTO
- enums
- базові type aliases
- zod schemas
- message contracts

Цей пакет має бути максимально “тупим”, без важкої логіки.

### `packages/core-engine`
Це серце продукту.

Тут живе:
- математика різьби
- нормалізація spec
- генерація profile
- helix/path sampling
- preview DTO
- FDM-рекомендації
- build-plan / fusion-recipe

Цей пакет **не знає**, що таке Fusion.

### `packages/ui-web`
Angular palette UI.

Тут живе:
- форми
- Angular Material layout
- Tailwind styling
- preview panels
- warnings/recommendations
- bridge service до Fusion host

UI має працювати так, ніби він спілкується з будь-яким CAD host через generic message API.

### `packages/test-cases`
Фікстури та golden outputs.

Це дуже важливо для майбутнього переносу з TS на Rust:
- той самий input
- той самий expected output
- порівняння результатів між реалізаціями

### `packages/dev-tools`
Допоміжні скрипти, які не треба змішувати з core або UI.

---

## 4. Конкретні contracts, які треба створити першими

Я б починав саме з цих файлів у `packages/domain/src/contracts/`.

### `thread-spec.ts`

```ts
export interface ThreadSpec {
  operationMode: 'external' | 'internal';
  profileShape: 'triangular' | 'trapezoidal' | 'squareLike';
  majorDiameterMm: number;
  pitchMm: number;
  lengthMm: number;
  handedness: 'right' | 'left';
  starts: number;
  crestFlatPercent?: number;
  rootFlatPercent?: number;
  flankAngleDeg?: number;
  clearanceMode: 'manual' | 'preset';
  manualClearanceMm?: number;
}
```

### `print-settings.ts`

```ts
export interface PrintSettings {
  materialFamily: 'PLA' | 'PETG' | 'ABS_ASA' | 'PA_CF' | 'TPU';
  nozzleDiameterMm: number;
  layerHeightMm: number;
  lineWidthMm?: number;
  qualityPreset?: 'fine' | 'balanced' | 'strong';
}
```

### `host-selection-context.ts`

```ts
export interface HostSelectionContext {
  selectionType: 'cylindricalFace' | 'axis' | 'body';
  cylinderDiameterMm?: number;
  axisDirection?: { x: number; y: number; z: number };
  axisOrigin?: { x: number; y: number; z: number };
  availableLengthMm?: number;
  isInternalCandidate?: boolean;
  isExternalCandidate?: boolean;
}
```

### `validation-issue.ts`

```ts
export interface ValidationIssue {
  code: string;
  severity: 'info' | 'warning' | 'error';
  field?: string;
  message: string;
}
```

### `recommendation.ts`

```ts
export interface Recommendation {
  code: string;
  title: string;
  details: string;
  priority: 'low' | 'medium' | 'high';
}
```

### `preview-request.ts`

```ts
export interface PreviewRequest {
  threadSpec: ThreadSpec;
  printSettings: PrintSettings;
  selectionContext?: HostSelectionContext;
  previewMode: 'profile' | 'helix' | 'layer';
}
```

### `preview-result.ts`

```ts
export interface PreviewResult {
  profile2d?: unknown;
  helix3d?: unknown;
  layerSlices?: unknown;
  issues: ValidationIssue[];
  recommendations: Recommendation[];
  score?: number;
}
```

### `build-plan.ts`

```ts
export interface BuildPlan {
  normalizedSpec: ThreadSpec;
  booleanIntent: 'join' | 'cut';
  pathPoints: Array<{ x: number; y: number; z: number }>;
  profilePoints: Array<{ x: number; y: number }>;
  issues: ValidationIssue[];
  recommendations: Recommendation[];
}
```

---

## 5. Message bridge: як називати повідомлення

Оскільки palette і Python host спілкуються асинхронно, з першого дня зроби єдиний envelope.

### `message-envelope.ts`

```ts
export interface MessageEnvelope<TPayload = unknown> {
  requestId: string;
  action: string;
  source: 'ui' | 'fusion-host';
  payload: TPayload;
}
```

---

## 6. Рекомендований список `action` для bridge

### UI → Fusion host

- `host.getSelectionContext`
- `host.previewThread`
- `host.commitThread`
- `host.loadRecentConfig`
- `host.saveRecentConfig`
- `host.ping`

### Fusion host → UI

- `ui.selectionContextChanged`
- `ui.previewResult`
- `ui.commitResult`
- `ui.hostError`
- `ui.hostReady`

---

## 7. Головні модулі core-engine

Ось які методи я б заклав одразу.

### `spec/normalize-thread-spec.ts`

```ts
export function normalizeThreadSpec(input: ThreadSpec): ThreadSpec
```

Робить:
- підставлення default values
- перевірку діапазонів
- нормалізацію optional fields

### `geometry/build-thread-profile.ts`

```ts
export function buildThreadProfile(spec: ThreadSpec): {
  profilePoints: Array<{ x: number; y: number }>;
  metrics: {
    threadDepthMm: number;
    crestWidthMm: number;
    rootWidthMm: number;
  };
}
```

### `geometry/helix-path.ts`

```ts
export function sampleHelixPath(params: {
  radiusMm: number;
  pitchMm: number;
  lengthMm: number;
  handedness: 'right' | 'left';
  pointsPerTurn?: number;
}): Array<{ x: number; y: number; z: number }>
```

### `printability/estimate-clearance.ts`

```ts
export function estimateFdmClearance(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): {
  recommendedClearanceMm: number;
  rationale: string[];
}
```

### `printability/analyze-flank-printability.ts`

```ts
export function analyzeFlankPrintability(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): ValidationIssue[]
```

### `preview/build-layer-preview.ts`

```ts
export function buildLayerPreview(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): PreviewResult
```

### `planning/build-build-plan.ts`

```ts
export function buildBuildPlan(args: {
  threadSpec: ThreadSpec;
  printSettings: PrintSettings;
  selectionContext?: HostSelectionContext;
}): BuildPlan
```

### `planning/build-fusion-recipe.ts`

```ts
export function buildFusionRecipe(plan: BuildPlan): {
  pathPoints: Array<{ x: number; y: number; z: number }>;
  profilePoints: Array<{ x: number; y: number }>;
  booleanIntent: 'join' | 'cut';
}
```

Назва `buildFusionRecipe` допустима, бо це ще не Fusion API, а лише recipe для Fusion host.

---

## 8. Angular UI: як я б структурував екран

Я б зробив UI palette з 4 основних блоків.

### 1. `selection-panel`
Показує:
- що зараз вибрано у Fusion
- діаметр циліндра
- доступну довжину
- чи схоже це на external/internal candidate

### 2. `thread-editor`
Містить:
- operation mode
- profile shape
- pitch
- length
- handedness
- profile advanced settings

### 3. `print-settings-card`
Містить:
- material family
- nozzle
- layer height
- quality preset

### 4. `preview-panel`
Tabs:
- Profile
- Helix
- Layer

Плюс:
- warnings
- recommendations
- quality score
- кнопки `Preview` і `Create`

---

## 9. Angular компоненти, які реально варто створити

```text
shared/components/
  numeric-input/
  unit-input/
  segmented-toggle/
  warning-list/
  recommendation-list/
  score-badge/
  svg-profile-viewer/
  canvas-helix-viewer/
  canvas-layer-viewer/
```

Це допоможе не перетворити `thread-editor.component.ts` на моноліт.

---

## 10. Що має робити Python host по кроках

### При старті add-in
- зареєструвати command definition
- додати кнопку в UI
- підготувати palette manager

### При запуску команди
- відкрити palette
- надіслати `ui.hostReady`
- зчитати поточний selection context
- надіслати `ui.selectionContextChanged`

### При `host.previewThread`
- прийняти payload
- перетворити його у `BuildPlan`
- згенерувати Fusion preview
- повернути `ui.previewResult`

### При `host.commitThread`
- побудувати реальну геометрію в моделі
- повернути `ui.commitResult`

---

## 11. Які Python-файли будуть найкритичніші

### `palette_bridge.py`
Центральна точка обміну повідомленнями.

### `message_dispatcher.py`
Маршрутизація `action` → handler.

### `selection_reader.py`
Витягує з Fusion мінімально потрібний selection context.

### `preview_controller.py`
Створює і чистить preview geometry.

### `build_controller.py`
Комітить фінальну geometry recipe у timeline.

---

## 12. Які модулі не треба змішувати між собою

Ось це важливо:

- `fusion_selection/*` не має напряму будувати геометрію
- `fusion_build/*` не має знати про Angular UI
- `ui-web/*` не має знати про Fusion API типи
- `core-engine/*` не має імпортувати нічого з `apps/fusion-host`

---

## 13. Naming rules, щоб потім легко переписати на Rust

Назви методів краще одразу робити нейтральними:

Добре:
- `normalizeThreadSpec`
- `buildThreadProfile`
- `sampleHelixPath`
- `buildLayerPreview`
- `estimateFdmClearance`
- `buildBuildPlan`

Погано:
- `makeFusionThread`
- `drawBrepHelix`
- `getSketchFaceThread`
- `fusionPreviewThing`

Тобто domain-first naming, не CAD-first naming.

---

## 14. Перший мінімальний backlog по задачах

### Етап 1 — skeleton
- створити монорепо
- підняти `packages/domain`
- підняти `packages/core-engine`
- підняти `packages/ui-web`
- зробити `apps/fusion-host/addin/ThreadKit.py`
- відкрити порожню palette

### Етап 2 — contracts
- описати `ThreadSpec`
- описати `PrintSettings`
- описати `HostSelectionContext`
- описати `BuildPlan`
- описати `MessageEnvelope`

### Етап 3 — UI shell
- Angular shell
- Material cards/tabs/forms
- Tailwind utilities
- mock state
- mock preview

### Етап 4 — bridge
- Python ⇄ palette
- `host.ping`
- `host.getSelectionContext`
- `host.previewThread`

### Етап 5 — core math
- `normalizeThreadSpec`
- `buildThreadProfile`
- `sampleHelixPath`
- `estimateFdmClearance`

### Етап 6 — preview
- profile preview
- helix preview
- layer preview
- Fusion custom graphics

### Етап 7 — commit
- sweep path
- profile sketch
- boolean op
- cleanup / undo sanity

---

## 15. Найкраща стартова стратегія реалізації

Я б почав не з реальної геометрії, а так:

### Фаза A
UI + contracts + mock preview

### Фаза B
Core math + real preview DTO

### Фаза C
Fusion preview overlay

### Фаза D
Commit into model

Це дає найшвидший feedback loop.

---

## 16. Що я б радив зробити вже зараз першими файлами

Ось прям перший набір файлів, який варто створити:

```text
apps/fusion-host/addin/ThreadKit.py
apps/fusion-host/addin/commands/thread_command.py
apps/fusion-host/addin/palette/palette_manager.py
apps/fusion-host/addin/palette/palette_bridge.py

packages/domain/src/contracts/thread-spec.ts
packages/domain/src/contracts/print-settings.ts
packages/domain/src/contracts/message-envelope.ts

packages/core-engine/src/spec/normalize-thread-spec.ts
packages/core-engine/src/geometry/build-thread-profile.ts
packages/core-engine/src/geometry/helix-path.ts

packages/ui-web/src/app/features/shell/shell.component.ts
packages/ui-web/src/app/features/thread-editor/thread-editor.component.ts
packages/ui-web/src/app/core/services/bridge.service.ts
```

---

## 17. Що я вважаю найбільш правильним компромісом для MVP

Не намагайся зараз зробити ідеальну Fusion feature-history архітектуру.  
Для MVP достатньо, щоб:

- UI був зручний
- контракти були стабільні
- core math була чиста
- preview був корисний
- фінальний commit працював

Саме це потім переживе міграцію на Rust/native.

---

## 18. Ризики, які краще прибрати одразу

### Ризик 1 — UI почне знати про Fusion
Рішення: тільки `HostSelectionContext`.

### Ризик 2 — Python почне містити бізнес-логіку
Рішення: усе рішення через DTO і `core-engine`.

### Ризик 3 — preview format стане host-specific
Рішення: preview DTO окремо від Fusion rendering.

### Ризик 4 — перенесення на Rust зламає все
Рішення: з першого дня стабільні contracts + fixtures.

---

## 19. Мінімальний dev workflow

```text
pnpm install
pnpm --filter @threadkit/ui-web start
pnpm --filter @threadkit/core-engine test
pnpm --filter @threadkit/dev-tools watch-ui-to-fusion
```

А у Fusion:
- запускаєш add-in
- відкриваєш кнопку ThreadKit
- palette вантажить Angular dev server

---

## 20. Що я пропоную як наступний крок

Найлогічніше зараз — одразу зафіксувати **scaffold v1**:

1. `pnpm-workspace.yaml`
2. `packages/domain`
3. `packages/core-engine`
4. `packages/ui-web`
5. `apps/fusion-host/addin`
6. мінімальні contracts
7. bridge actions
8. skeleton Angular palette
9. skeleton Fusion command

Наступним повідомленням я можу вже дати тобі **готовий scaffold списком файлів з вмістом-заглушками** для старту репозиторію.
