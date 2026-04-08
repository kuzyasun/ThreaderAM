import { DecimalPipe } from "@angular/common";
import { Component, input, output } from "@angular/core";
import type { PreviewMode, PreviewResult } from "@threadkit/domain";

import { CanvasLayerViewerComponent } from "../../shared/components/canvas-layer-viewer/canvas-layer-viewer.component";
import { RecommendationListComponent } from "../../shared/components/recommendation-list/recommendation-list.component";
import { ScoreBadgeComponent } from "../../shared/components/score-badge/score-badge.component";
import { SvgProfileViewerComponent } from "../../shared/components/svg-profile-viewer/svg-profile-viewer.component";
import { WarningListComponent } from "../../shared/components/warning-list/warning-list.component";

@Component({
  selector: "threadkit-preview-panel",
  standalone: true,
  imports: [
    CanvasLayerViewerComponent,
    DecimalPipe,
    RecommendationListComponent,
    ScoreBadgeComponent,
    SvgProfileViewerComponent,
    WarningListComponent
  ],
  template: `
    <section class="panel">
      <header>
        <div>
          <p class="eyebrow">Mock preview</p>
          <h2>Preview and guidance</h2>
        </div>
        <threadkit-score-badge [score]="preview().score ?? 0" />
      </header>

      <nav class="tabs" aria-label="Preview mode">
        @for (tab of tabs; track tab.mode) {
          <button type="button" [class.active]="previewMode() === tab.mode" (click)="previewModeChange.emit(tab.mode)">
            {{ tab.label }}
          </button>
        }
      </nav>

      <article class="viewer-card">
        @switch (previewMode()) {
          @case ("profile") {
            <threadkit-svg-profile-viewer [profile]="preview().profile2d" />
            @if (preview().profile2d?.dimensionsMm; as dimensions) {
              <dl class="metrics">
                <div>
                  <dt>Depth</dt>
                  <dd>{{ dimensions.threadDepth | number: "1.2-2" }} mm</dd>
                </div>
                <div>
                  <dt>Crest</dt>
                  <dd>{{ dimensions.crestWidth | number: "1.2-2" }} mm</dd>
                </div>
                <div>
                  <dt>Root</dt>
                  <dd>{{ dimensions.rootWidth | number: "1.2-2" }} mm</dd>
                </div>
              </dl>
            }
          }

          @case ("helix") {
            <div class="helix-grid">
              <div class="stat">
                <span>Turns</span>
                <strong>{{ preview().helix3d?.turnCount ?? 0 }}</strong>
              </div>
              <div class="stat">
                <span>Samples</span>
                <strong>{{ preview().helix3d?.pathPoints?.length ?? 0 }}</strong>
              </div>
              <div class="stat">
                <span>End z</span>
                <strong>{{ (preview().helix3d?.pathPoints?.at(-1)?.z ?? 0) | number: "1.2-2" }} mm</strong>
              </div>
            </div>
            <div class="code-block">
              @for (point of preview().helix3d?.pathPoints?.slice(0, 8) ?? []; track $index) {
                <div>({{ point.x }}, {{ point.y }}, {{ point.z }})</div>
              }
            </div>
          }

          @case ("layer") {
            <threadkit-canvas-layer-viewer [slices]="preview().layerSlices ?? []" />
          }
        }
      </article>

      <div class="insight-grid">
        <threadkit-warning-list [issues]="preview().issues" />
        <threadkit-recommendation-list [recommendations]="preview().recommendations" />
      </div>
    </section>
  `,
  styles: [`
    .panel {
      padding: 22px;
      border: 1px solid var(--tk-border);
      border-radius: 22px;
      background: var(--tk-surface);
      box-shadow: var(--tk-shadow);
    }

    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: var(--tk-text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      font-size: 1.2rem;
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
    }

    .tabs button {
      padding: 10px 14px;
      border: 0;
      border-radius: 999px;
      background: rgba(80, 99, 123, 0.1);
      color: var(--tk-text-muted);
      cursor: pointer;
      transition: background-color 120ms ease;
    }

    .tabs button.active {
      background: var(--tk-accent);
      color: white;
    }

    .viewer-card {
      display: grid;
      gap: 16px;
      margin-bottom: 16px;
    }

    .metrics {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      margin: 0;
    }

    dt {
      margin-bottom: 4px;
      color: var(--tk-text-muted);
      font-size: 0.84rem;
    }

    dd {
      margin: 0;
      font-weight: 700;
    }

    .helix-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }

    .stat,
    .code-block {
      padding: 16px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(55, 77, 102, 0.1);
    }

    .stat span {
      display: block;
      margin-bottom: 8px;
      color: var(--tk-text-muted);
      font-size: 0.84rem;
    }

    .stat strong {
      font-size: 1.2rem;
    }

    .code-block {
      color: #21415f;
      font-family: Consolas, "Courier New", monospace;
      font-size: 0.84rem;
      line-height: 1.6;
    }

    .insight-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  `]
})
export class PreviewPanelComponent {
  readonly preview = input.required<PreviewResult>();
  readonly previewMode = input.required<PreviewMode>();
  readonly previewModeChange = output<PreviewMode>();

  readonly tabs: Array<{ mode: PreviewMode; label: string }> = [
    { mode: "profile", label: "Profile" },
    { mode: "helix", label: "Helix" },
    { mode: "layer", label: "Layer" }
  ];
}
