import { Component, inject } from "@angular/core";

import { MockThreadkitStateService } from "../../core/services/mock-threadkit-state.service";
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
          <p class="eyebrow">ThreadKit MVP - P9</p>
          <h1>Bridge-aware palette shell</h1>
          <p class="lede">
            The UI now keeps a live handshake with the Fusion host, surfaces recent config
            state, and stays useful in browser fallback mode while the add-in hardens.
          </p>

          <div class="hero-actions">
            <button type="button" class="action-button primary" (click)="saveRecentConfig()">
              Save current
            </button>
            <button type="button" class="action-button" (click)="loadRecentConfig()">
              Load recent
            </button>
          </div>

          <div class="status-row">
            <span class="status-pill">
              Host: {{ state.hostStatus()?.host ?? "disconnected" }}
            </span>
            <span class="status-pill">
              Status: {{ state.hostStatus()?.status ?? "pending" }}
            </span>
            <span class="status-pill" [class.status-pill--active]="state.recentConfigMeta().hasConfig">
              Recent config:
              {{
                state.recentConfigMeta().hasConfig
                  ? "saved " + formatSavedAt(state.recentConfigMeta().savedAt)
                  : "none"
              }}
            </span>
          </div>
        </div>

        <div class="hero-stats">
          <article>
            <span>Quality score</span>
            <strong>{{ state.summary().score }}</strong>
          </article>
          <article>
            <span>Warnings</span>
            <strong>{{ state.summary().issueCount }}</strong>
          </article>
          <article>
            <span>Recommendations</span>
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
  readonly state = inject(MockThreadkitStateService);

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

  formatSavedAt(savedAt: string | null | undefined): string {
    if (!savedAt) {
      return "just now";
    }

    const parsed = new Date(savedAt);
    if (Number.isNaN(parsed.getTime())) {
      return "recently";
    }

    return parsed.toLocaleString();
  }

  private async initializeBridge(): Promise<void> {
    try {
      await this.state.initializeBridge();
    } catch (error) {
      console.error(error);
    }
  }
}
