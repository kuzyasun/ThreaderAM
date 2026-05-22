import { Component, inject } from "@angular/core";

import { MockThreadkitStateService } from "../../core/services/mock-threadkit-state.service";
import { UiI18nService, type UiLocale } from "../../core/services/ui-i18n.service";
import { PreviewPanelComponent } from "../preview-panel/preview-panel.component";
import { SelectionPanelComponent } from "../selection-panel/selection-panel.component";
import { ThreadEditorComponent } from "../thread-editor/thread-editor.component";

@Component({
  selector: "threadkit-shell",
  standalone: true,
  imports: [PreviewPanelComponent, SelectionPanelComponent, ThreadEditorComponent],
  template: `
    <main class="shell">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">{{ i18n.t("shell.eyebrow") }}</p>
          <h1>{{ i18n.t("shell.title") }}</h1>
          <p class="lede">{{ i18n.t("shell.lede") }}</p>

          <div class="hero-actions">
            <label class="locale-picker">
              <span>{{ i18n.t("shell.language") }}</span>
              <select [value]="i18n.locale()" (change)="setLocale($any($event.target).value)">
                @for (locale of locales; track locale) {
                  <option [value]="locale">{{ i18n.localeLabel(locale) }}</option>
                }
              </select>
            </label>

            <button type="button" class="action-button primary" (click)="saveRecentConfig()">
              {{ i18n.t("shell.saveCurrent") }}
            </button>
            <button type="button" class="action-button" (click)="loadRecentConfig()">
              {{ i18n.t("shell.loadRecent") }}
            </button>
          </div>

          <div class="status-row">
            <span class="status-pill">
              {{ i18n.t("shell.host") }}:
              {{ state.hostStatus()?.host ?? i18n.t("shell.hostDisconnected") }}
            </span>
            <span class="status-pill">
              {{ i18n.t("shell.status") }}:
              {{ state.hostStatus()?.status ?? i18n.t("shell.hostPending") }}
            </span>
            <span class="status-pill" [class.status-pill--active]="state.recentConfigMeta().hasConfig">
              {{ i18n.t("shell.recentConfig") }}:
              {{
                state.recentConfigMeta().hasConfig
                  ? i18n.t("shell.recentConfigSaved", { value: formatSavedAt(state.recentConfigMeta().savedAt) })
                  : i18n.t("shell.recentConfigNone")
              }}
            </span>
          </div>
        </div>

        <div class="hero-stats">
          <article>
            <span>{{ i18n.t("shell.qualityScore") }}</span>
            <strong>{{ state.summary().score }}</strong>
          </article>
          <article>
            <span>{{ i18n.t("shell.warnings") }}</span>
            <strong>{{ state.summary().issueCount }}</strong>
          </article>
          <article>
            <span>{{ i18n.t("shell.recommendations") }}</span>
            <strong>{{ state.summary().recommendationCount }}</strong>
          </article>
        </div>
      </section>

      @if (state.lastBridgeError(); as bridgeError) {
        <section class="bridge-error">
          <strong>{{ bridgeError.code }}</strong>
          <span>{{ bridgeError.message }}</span>
        </section>
      }

      <div class="layout">
        <section class="column">
          <threadkit-selection-panel [selection]="state.selectionContext()" />
          <threadkit-thread-editor
            [threadSpec]="state.threadSpec()"
            [printSettings]="state.printSettings()"
            (threadSpecChange)="state.updateThreadSpec($event)"
            (printSettingsChange)="state.updatePrintSettings($event)"
          />
        </section>

        <section class="column">
          <threadkit-preview-panel
            [preview]="state.previewResult()"
            [previewMode]="state.previewMode()"
            (previewModeChange)="state.setPreviewMode($event)"
          />
        </section>
      </div>
    </main>
  `,
  styles: [`
    .shell {
      width: min(1240px, calc(100% - 32px));
      margin: 0 auto;
      padding: 32px 0 48px;
    }

    .hero {
      display: grid;
      gap: 20px;
      align-items: end;
      grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.9fr);
      margin-bottom: 20px;
    }

    .hero-copy {
      display: grid;
      gap: 18px;
    }

    .eyebrow {
      margin: 0;
      color: var(--tk-text-muted);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.1rem, 5vw, 3.8rem);
      line-height: 0.98;
      letter-spacing: -0.03em;
    }

    .lede {
      margin: 0;
      max-width: 760px;
      color: var(--tk-text-muted);
      font-size: 1.02rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: end;
    }

    .locale-picker {
      display: grid;
      gap: 6px;
      color: var(--tk-text-muted);
      font-size: 0.82rem;
      font-weight: 600;
    }

    .locale-picker select {
      min-width: 152px;
      padding: 10px 12px;
      border: 1px solid rgba(55, 77, 102, 0.14);
      border-radius: 12px;
      background: var(--tk-surface-strong);
      color: #122033;
      font: inherit;
    }

    .action-button {
      border: 1px solid color-mix(in srgb, var(--tk-border) 80%, #ffffff 20%);
      border-radius: 999px;
      background: color-mix(in srgb, var(--tk-surface) 82%, #ffffff 18%);
      color: var(--tk-text);
      padding: 11px 18px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
    }

    .action-button:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--tk-accent) 35%, var(--tk-border) 65%);
    }

    .action-button.primary {
      background: linear-gradient(135deg, var(--tk-accent), #ef7d57);
      border-color: transparent;
      color: #fdfbf7;
    }

    .status-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--tk-surface) 90%, #ffffff 10%);
      border: 1px solid var(--tk-border);
      color: var(--tk-text-muted);
      font-size: 0.88rem;
    }

    .status-pill--active {
      color: var(--tk-text);
      border-color: color-mix(in srgb, var(--tk-accent) 45%, var(--tk-border) 55%);
    }

    .hero-stats {
      display: grid;
      gap: 12px;
    }

    .hero-stats article {
      padding: 16px 18px;
      border: 1px solid var(--tk-border);
      border-radius: 18px;
      background: var(--tk-surface);
      box-shadow: var(--tk-shadow);
    }

    .hero-stats span {
      display: block;
      margin-bottom: 8px;
      color: var(--tk-text-muted);
      font-size: 0.84rem;
    }

    .hero-stats strong {
      font-size: 1.4rem;
    }

    .bridge-error {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 14px 16px;
      margin-bottom: 20px;
      border: 1px solid color-mix(in srgb, #b73a2f 50%, var(--tk-border) 50%);
      border-radius: 16px;
      background: color-mix(in srgb, #b73a2f 10%, var(--tk-surface) 90%);
      color: #7d2018;
    }

    .layout {
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
    }

    .column {
      display: grid;
      gap: 20px;
      align-content: start;
    }

    @media (max-width: 980px) {
      .hero,
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ShellComponent {
  readonly i18n = inject(UiI18nService);
  readonly state = inject(MockThreadkitStateService);
  readonly locales: UiLocale[] = ["uk", "en"];

  constructor() {
    void this.initializeBridge();
  }

  async loadRecentConfig(): Promise<void> {
    try {
      await this.state.loadRecentConfig();
    } catch (error) {
      console.error(error);
    }
  }

  async saveRecentConfig(): Promise<void> {
    try {
      await this.state.saveRecentConfig();
    } catch (error) {
      console.error(error);
    }
  }

  setLocale(locale: string): void {
    if (locale === "uk" || locale === "en") {
      this.i18n.setLocale(locale);
    }
  }

  formatSavedAt(savedAt: string | null | undefined): string {
    if (!savedAt) {
      return this.i18n.t("shell.justNow");
    }

    const parsed = new Date(savedAt);
    if (Number.isNaN(parsed.getTime())) {
      return this.i18n.t("shell.recently");
    }

    return parsed.toLocaleString(this.i18n.locale() === "uk" ? "uk-UA" : "en-US");
  }

  private async initializeBridge(): Promise<void> {
    try {
      await this.state.initializeBridge();
    } catch (error) {
      console.error(error);
    }
  }
}
