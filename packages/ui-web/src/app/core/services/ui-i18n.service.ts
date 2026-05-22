import { Injectable, signal } from "@angular/core";
import type {
  IssueSeverity,
  Recommendation,
  RecommendationPriority,
  SelectionType,
  ValidationIssue
} from "@threadkit/domain";

export type UiLocale = "en" | "uk";

interface TranslationDictionary {
  [key: string]: string;
}

const LOCALE_STORAGE_KEY = "threadkit.ui.locale";

const TRANSLATIONS: Record<UiLocale, TranslationDictionary> = {
  en: {
    "locale.en": "English",
    "locale.uk": "Ukrainian",
    "shell.eyebrow": "ThreadKit MVP - Mock",
    "shell.title": "Thread design preview shell",
    "shell.lede":
      "This MVP runs locally with shared contracts and preview math, so we can refine the design flow before full Fusion integration.",
    "shell.saveCurrent": "Save current",
    "shell.loadRecent": "Load recent",
    "shell.language": "Language",
    "shell.host": "Host",
    "shell.status": "Status",
    "shell.recentConfig": "Recent config",
    "shell.hostDisconnected": "disconnected",
    "shell.hostPending": "pending",
    "shell.recentConfigNone": "none",
    "shell.recentConfigSaved": "saved {value}",
    "shell.justNow": "just now",
    "shell.recently": "recently",
    "shell.qualityScore": "Quality score",
    "shell.warnings": "Warnings",
    "shell.recommendations": "Recommendations",
    "selection.eyebrow": "Fusion selection",
    "selection.title": "Target context",
    "selection.diameter": "Diameter",
    "selection.length": "Length",
    "selection.axis": "Axis",
    "selection.na": "n/a",
    "selection.externalCandidate": "External candidate",
    "selection.internalCandidate": "Internal candidate",
    "selection.type.cylindricalFace": "cylindrical face",
    "selection.type.planarFace": "planar face",
    "selection.type.circularEdge": "circular edge",
    "selection.type.body": "body",
    "selection.type.none": "no selection",
    "editor.eyebrow": "Mock editor",
    "editor.title": "Thread setup",
    "editor.status": "Domain-driven mock state",
    "editor.baseParameters": "Base parameters",
    "editor.profileTuning": "Profile tuning",
    "editor.printSettings": "Print settings",
    "editor.threadStandard": "Thread standard",
    "editor.threadStandard.custom": "Custom",
    "editor.threadStandard.isoMetric": "ISO metric",
    "editor.threadStandard.trapezoidalMetric": "Metric trapezoidal",
    "editor.threadStandard.acmeImperial": "ACME / imperial",
    "editor.standardPlaceholder":
      "Standards are UI placeholders for now. Calculations still follow the current custom geometry model.",
    "editor.operation": "Operation",
    "editor.operation.external": "External",
    "editor.operation.internal": "Internal",
    "editor.profile": "Profile",
    "editor.profile.triangular": "Triangular",
    "editor.profile.trapezoidal": "Trapezoidal",
    "editor.profile.squareLike": "Square-like",
    "editor.majorDiameter": "Major diameter, mm",
    "editor.pitch": "Pitch, mm",
    "editor.length": "Length, mm",
    "editor.handedness": "Handedness",
    "editor.handedness.right": "Right",
    "editor.handedness.left": "Left",
    "editor.crestFlat": "Crest flat, %",
    "editor.rootFlat": "Root flat, %",
    "editor.flankAngle": "Flank angle, deg",
    "editor.depthMode": "Depth mode",
    "editor.depthMode.auto": "Auto",
    "editor.depthMode.manual": "Manual",
    "editor.depthAutoHint": "Depth is currently derived automatically from pitch and profile geometry.",
    "editor.manualDepth": "Manual depth, mm",
    "editor.clearanceMode": "Clearance mode",
    "editor.clearanceMode.preset": "Preset",
    "editor.clearanceMode.manual": "Manual",
    "editor.manualClearance": "Manual clearance, mm",
    "editor.material": "Material",
    "editor.nozzle": "Nozzle, mm",
    "editor.layerHeight": "Layer height, mm",
    "editor.lineWidth": "Line width, mm",
    "editor.qualityPreset": "Quality preset",
    "editor.qualityPreset.fine": "Fine",
    "editor.qualityPreset.balanced": "Balanced",
    "editor.qualityPreset.strong": "Strong",
    "preview.eyebrow": "Mock preview",
    "preview.title": "Preview and guidance",
    "preview.mode.profile": "Profile",
    "preview.mode.helix": "Helix",
    "preview.mode.layer": "Layer",
    "preview.metrics.depth": "Depth",
    "preview.metrics.crest": "Crest",
    "preview.metrics.root": "Root",
    "preview.helix.turns": "Turns",
    "preview.helix.samples": "Samples",
    "preview.helix.endZ": "End z",
    "warnings.title": "Warnings",
    "warnings.empty": "No active issues in this mock scenario.",
    "recommendations.title": "Recommendations",
    "recommendations.empty": "No recommendations yet.",
    "score.label": "Mock quality",
    "severity.warning": "warning",
    "severity.error": "error",
    "priority.low": "low",
    "priority.medium": "medium",
    "priority.high": "high",
    "field.pitchMm": "Pitch",
    "field.lengthMm": "Length",
    "field.crestFlatPercent": "Crest flat",
    "field.layerHeightMm": "Layer height",
    "field.manualDepthMm": "Manual depth",
    "field.manualClearanceMm": "Manual clearance",
    "field.starts": "Starts",
    "field.operationMode": "Operation",
    "issue.selection.length.exceeded":
      "Requested thread length exceeds the available host selection length.",
    "issue.print.pitch.tight":
      "Pitch is tight relative to the active nozzle and may soften flank detail.",
    "issue.print.layer.coarse":
      "Layer height is coarse for this pitch and will accent stair-stepping across the flanks.",
    "issue.print.crest.thin":
      "Crest width is narrow for a stable bead and may print with rounded tops.",
    "issue.print.depth.shallow":
      "Thread depth is shallow relative to layer height and the profile may wash out.",
    "issue.thread.pitch.too-large":
      "Pitch must stay below the major diameter for a valid cylindrical thread.",
    "issue.thread.length.short":
      "Thread length is short relative to pitch and may only form a partial turn.",
    "issue.thread.profile.over-flat":
      "Crest and root flats consume most of the pitch and may collapse flank definition.",
    "issue.thread.depth.invalid": "Manual thread depth must be greater than zero.",
    "issue.thread.clearance.invalid": "Manual clearance must be greater than zero.",
    "issue.thread.starts.unsupported":
      "Multi-start threads are not supported in the current MVP core flow.",
    "recommendation.profile.swap.trapezoid.title": "Consider trapezoidal flanks",
    "recommendation.profile.swap.trapezoid.details":
      "A trapezoidal profile typically preserves crest support better on utility FDM threads.",
    "recommendation.material.petg.clearance.title": "Bias clearance upward for PETG",
    "recommendation.material.petg.clearance.details":
      "PETG often runs tackier on mating surfaces, so it benefits from slightly looser fits.",
    "recommendation.preview.large-diameter.title": "Check the first turn before commit",
    "recommendation.preview.large-diameter.details":
      "Large diameters magnify profile proportion errors, so previewing the first turn is worth it.",
    "recommendation.build.lead-in.title": "Plan a lead-in for the final build",
    "recommendation.build.lead-in.details":
      "Longer threads usually feel better in use if the build stage includes a gentle entry chamfer.",
    "viewer.profile.aria": "Thread profile preview",
    "viewer.profile.empty": "Profile preview will appear here.",
    "viewer.layer.aria": "Layer slice preview",
    "viewer.layer.empty": "Layer preview will appear here.",
    "viewer.layer.label": "Layer {index} · z {z} mm"
  },
  uk: {
    "locale.en": "Англійська",
    "locale.uk": "Українська",
    "shell.eyebrow": "ThreadKit MVP - Mock",
    "shell.title": "Локальна оболонка проєктування різьби",
    "shell.lede":
      "Цей MVP працює локально на спільних контрактах і preview-математиці, щоб ми могли відточити сценарій проєктування до повної інтеграції з Fusion.",
    "shell.saveCurrent": "Зберегти поточне",
    "shell.loadRecent": "Завантажити останнє",
    "shell.language": "Мова",
    "shell.host": "Хост",
    "shell.status": "Статус",
    "shell.recentConfig": "Остання конфігурація",
    "shell.hostDisconnected": "не підключено",
    "shell.hostPending": "очікується",
    "shell.recentConfigNone": "немає",
    "shell.recentConfigSaved": "збережено {value}",
    "shell.justNow": "щойно",
    "shell.recently": "нещодавно",
    "shell.qualityScore": "Оцінка якості",
    "shell.warnings": "Попередження",
    "shell.recommendations": "Рекомендації",
    "selection.eyebrow": "Виділення Fusion",
    "selection.title": "Контекст цілі",
    "selection.diameter": "Діаметр",
    "selection.length": "Довжина",
    "selection.axis": "Вісь",
    "selection.na": "н/д",
    "selection.externalCandidate": "Кандидат для зовнішньої різьби",
    "selection.internalCandidate": "Кандидат для внутрішньої різьби",
    "selection.type.cylindricalFace": "циліндрична грань",
    "selection.type.planarFace": "плоска грань",
    "selection.type.circularEdge": "кругла кромка",
    "selection.type.body": "тіло",
    "selection.type.none": "нічого не вибрано",
    "editor.eyebrow": "Mock-редактор",
    "editor.title": "Налаштування різьби",
    "editor.status": "Mock-стан на доменних контрактах",
    "editor.baseParameters": "Базові параметри",
    "editor.profileTuning": "Тюнінг профілю",
    "editor.printSettings": "Налаштування друку",
    "editor.threadStandard": "Стандарт різьби",
    "editor.threadStandard.custom": "Custom",
    "editor.threadStandard.isoMetric": "ISO метрична",
    "editor.threadStandard.trapezoidalMetric": "Метрична трапецієподібна",
    "editor.threadStandard.acmeImperial": "ACME / дюймова",
    "editor.standardPlaceholder":
      "Вибір стандартів поки є лише UI-заглушкою. Розрахунок ще йде за поточною custom-моделлю геометрії.",
    "editor.operation": "Операція",
    "editor.operation.external": "Зовнішня",
    "editor.operation.internal": "Внутрішня",
    "editor.profile": "Профіль",
    "editor.profile.triangular": "Трикутний",
    "editor.profile.trapezoidal": "Трапецієподібний",
    "editor.profile.squareLike": "Умовно квадратний",
    "editor.majorDiameter": "Зовнішній діаметр, мм",
    "editor.pitch": "Крок, мм",
    "editor.length": "Довжина, мм",
    "editor.handedness": "Напрямок",
    "editor.handedness.right": "Права",
    "editor.handedness.left": "Ліва",
    "editor.crestFlat": "Плоска вершина, %",
    "editor.rootFlat": "Плоске дно, %",
    "editor.flankAngle": "Кут бокової грані, град",
    "editor.depthMode": "Режим глибини",
    "editor.depthMode.auto": "Авто",
    "editor.depthMode.manual": "Вручну",
    "editor.depthAutoHint": "Глибина зараз обчислюється автоматично з кроку та геометрії профілю.",
    "editor.manualDepth": "Ручна глибина, мм",
    "editor.clearanceMode": "Режим зазору",
    "editor.clearanceMode.preset": "Пресет",
    "editor.clearanceMode.manual": "Вручну",
    "editor.manualClearance": "Ручний зазор, мм",
    "editor.material": "Матеріал",
    "editor.nozzle": "Сопло, мм",
    "editor.layerHeight": "Висота шару, мм",
    "editor.lineWidth": "Ширина лінії, мм",
    "editor.qualityPreset": "Пресет якості",
    "editor.qualityPreset.fine": "Точний",
    "editor.qualityPreset.balanced": "Збалансований",
    "editor.qualityPreset.strong": "Міцний",
    "preview.eyebrow": "Mock-preview",
    "preview.title": "Preview і підказки",
    "preview.mode.profile": "Профіль",
    "preview.mode.helix": "Гвинтова лінія",
    "preview.mode.layer": "Шар",
    "preview.metrics.depth": "Глибина",
    "preview.metrics.crest": "Вершина",
    "preview.metrics.root": "Дно",
    "preview.helix.turns": "Витки",
    "preview.helix.samples": "Семпли",
    "preview.helix.endZ": "Кінцева z",
    "warnings.title": "Попередження",
    "warnings.empty": "У цьому mock-сценарії активних проблем немає.",
    "recommendations.title": "Рекомендації",
    "recommendations.empty": "Рекомендацій поки немає.",
    "score.label": "Mock-якість",
    "severity.warning": "попередження",
    "severity.error": "помилка",
    "priority.low": "низький",
    "priority.medium": "середній",
    "priority.high": "високий",
    "field.pitchMm": "Крок",
    "field.lengthMm": "Довжина",
    "field.crestFlatPercent": "Плоска вершина",
    "field.layerHeightMm": "Висота шару",
    "field.manualDepthMm": "Ручна глибина",
    "field.manualClearanceMm": "Ручний зазор",
    "field.starts": "Заходи",
    "field.operationMode": "Операція",
    "issue.selection.length.exceeded":
      "Запитана довжина різьби перевищує доступну довжину вибраної геометрії.",
    "issue.print.pitch.tight":
      "Крок занадто малий відносно активного сопла, тому деталізація граней може змазуватися.",
    "issue.print.layer.coarse":
      "Висота шару завелика для цього кроку і підсилить ступінчастість на бокових гранях.",
    "issue.print.crest.thin":
      "Ширина вершини замала для стабільної доріжки, тому верх може вийти закругленим.",
    "issue.print.depth.shallow":
      "Глибина різьби замала відносно висоти шару, тому профіль може замиватися.",
    "issue.thread.pitch.too-large":
      "Крок має бути меншим за зовнішній діаметр для коректної циліндричної різьби.",
    "issue.thread.length.short":
      "Довжина різьби замала відносно кроку і може дати лише частковий виток.",
    "issue.thread.profile.over-flat":
      "Плоска вершина і дно займають більшу частину кроку та можуть зруйнувати форму бокових граней.",
    "issue.thread.depth.invalid": "Ручна глибина різьби має бути більшою за нуль.",
    "issue.thread.clearance.invalid": "Ручний зазор має бути більшим за нуль.",
    "issue.thread.starts.unsupported":
      "Багатозаходна різьба поки не підтримується в поточному MVP core-flow.",
    "recommendation.profile.swap.trapezoid.title": "Розглянь трапецієподібні бокові грані",
    "recommendation.profile.swap.trapezoid.details":
      "Трапецієподібний профіль зазвичай краще зберігає опору вершини на утилітарних FDM-різьбах.",
    "recommendation.material.petg.clearance.title": "Для PETG варто трохи збільшити зазор",
    "recommendation.material.petg.clearance.details":
      "PETG часто поводиться липкіше на стиках, тому трохи вільніша посадка зазвичай працює краще.",
    "recommendation.preview.large-diameter.title":
      "Перевір перший виток перед фінальною побудовою",
    "recommendation.preview.large-diameter.details":
      "На великих діаметрах помилки пропорцій профілю помітніші, тому preview першого витка особливо корисний.",
    "recommendation.build.lead-in.title": "Заплануй заходну фаску для фінальної побудови",
    "recommendation.build.lead-in.details":
      "Довші різьби зазвичай працюють краще, якщо на етапі побудови додати м’який заходний скос.",
    "viewer.profile.aria": "Попередній перегляд профілю різьби",
    "viewer.profile.empty": "Тут з’явиться preview профілю.",
    "viewer.layer.aria": "Попередній перегляд шарів",
    "viewer.layer.empty": "Тут з’явиться preview шарів.",
    "viewer.layer.label": "Шар {index} · z {z} мм"
  }
};

@Injectable({
  providedIn: "root"
})
export class UiI18nService {
  readonly locale = signal<UiLocale>(resolveInitialLocale());

  setLocale(locale: UiLocale): void {
    this.locale.set(locale);
    persistLocale(locale);
  }

  t(key: string, params?: Record<string, string | number>): string {
    const locale = this.locale();
    const fallbackLocale: UiLocale = locale === "uk" ? "en" : "uk";
    const template = TRANSLATIONS[locale][key] ?? TRANSLATIONS[fallbackLocale][key] ?? key;
    return interpolate(template, params);
  }

  localeLabel(locale: UiLocale): string {
    return this.t(`locale.${locale}`);
  }

  severityLabel(severity: IssueSeverity): string {
    return this.t(`severity.${severity}`);
  }

  priorityLabel(priority: RecommendationPriority): string {
    return this.t(`priority.${priority}`);
  }

  fieldLabel(field: string | undefined, fallbackCode: string): string {
    if (!field) {
      return fallbackCode;
    }

    const translated = this.t(`field.${field}`);
    return translated === `field.${field}` ? fallbackCode : translated;
  }

  issueMessage(issue: ValidationIssue): string {
    const translated = this.t(`issue.${issue.code}`);
    return translated === `issue.${issue.code}` ? issue.message : translated;
  }

  recommendationTitle(item: Recommendation): string {
    const translated = this.t(`recommendation.${item.code}.title`);
    return translated === `recommendation.${item.code}.title` ? item.title : translated;
  }

  recommendationDetails(item: Recommendation): string {
    const translated = this.t(`recommendation.${item.code}.details`);
    return translated === `recommendation.${item.code}.details` ? item.details : translated;
  }

  selectionTypeLabel(type: SelectionType | undefined): string {
    if (!type) {
      return this.t("selection.type.none");
    }

    const translated = this.t(`selection.type.${type}`);
    return translated === `selection.type.${type}` ? type : translated;
  }

  formatLayerLabel(index: number, zMm: number): string {
    return this.t("viewer.layer.label", {
      index: index + 1,
      z: zMm.toFixed(2)
    });
  }

  derivedMetricsTitle(): string {
    return this.locale() === "uk" ? "Похідні значення" : "Derived values";
  }

  derivedDepthLabel(): string {
    return this.locale() === "uk" ? "Ефективна глибина" : "Effective depth";
  }

  derivedMinorDiameterLabel(): string {
    return this.locale() === "uk" ? "Мінорний діаметр" : "Minor diameter";
  }

  derivedCrestWidthLabel(): string {
    return this.locale() === "uk" ? "Ширина вершини" : "Crest width";
  }

  derivedRootWidthLabel(): string {
    return this.locale() === "uk" ? "Ширина дна" : "Root width";
  }

  derivedClampHint(): string {
    return this.locale() === "uk"
      ? "Ефективна глибина може бути меншою за ручне значення, якщо її обмежує геометрія бокових граней."
      : "Effective depth may end up smaller than the manual value when flank geometry limits it.";
  }
}

function resolveInitialLocale(): UiLocale {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "uk") {
      return stored;
    }
  }

  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("uk")) {
    return "uk";
  }

  return "en";
}

function persistLocale(locale: UiLocale): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}
