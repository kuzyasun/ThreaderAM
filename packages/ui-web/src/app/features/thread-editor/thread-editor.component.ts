import { DecimalPipe } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { buildThreadProfile, normalizeThreadSpec } from "@threadkit/core-engine";
import type { PrintSettings, ThreadSpec } from "@threadkit/domain";

import { UiI18nService } from "../../core/services/ui-i18n.service";

@Component({
  selector: "threadkit-thread-editor",
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  template: `
    <section class="panel">
      <header>
        <div>
          <p class="eyebrow">{{ i18n.t("editor.eyebrow") }}</p>
          <h2>{{ i18n.t("editor.title") }}</h2>
        </div>
        <span class="status">{{ i18n.t("editor.status") }}</span>
      </header>

      <div class="card-grid">
        <article class="card">
          <h3>{{ i18n.t("editor.baseParameters") }}</h3>
          <div class="field-grid">
            <label>
              {{ i18n.t("editor.threadStandard") }}
              <select [ngModel]="threadSpec().threadStandard ?? 'custom'" (ngModelChange)="updateThreadStandard($event)">
                <option value="custom">{{ i18n.t("editor.threadStandard.custom") }}</option>
                <option value="isoMetric">{{ i18n.t("editor.threadStandard.isoMetric") }}</option>
                <option value="trapezoidalMetric">{{ i18n.t("editor.threadStandard.trapezoidalMetric") }}</option>
                <option value="acmeImperial">{{ i18n.t("editor.threadStandard.acmeImperial") }}</option>
              </select>
            </label>

            <label>
              {{ i18n.t("editor.operation") }}
              <select [ngModel]="threadSpec().operationMode" (ngModelChange)="threadSpecChange.emit({ operationMode: $event })">
                <option value="external">{{ i18n.t("editor.operation.external") }}</option>
                <option value="internal">{{ i18n.t("editor.operation.internal") }}</option>
              </select>
            </label>

            <label>
              {{ i18n.t("editor.profile") }}
              <select [ngModel]="threadSpec().profileShape" (ngModelChange)="threadSpecChange.emit({ profileShape: $event })">
                <option value="triangular">{{ i18n.t("editor.profile.triangular") }}</option>
                <option value="trapezoidal">{{ i18n.t("editor.profile.trapezoidal") }}</option>
                <option value="squareLike">{{ i18n.t("editor.profile.squareLike") }}</option>
              </select>
            </label>

            <label>
              {{ i18n.t("editor.majorDiameter") }}
              <input
                type="number"
                step="0.1"
                [ngModel]="threadSpec().majorDiameterMm"
                (ngModelChange)="threadSpecChange.emit({ majorDiameterMm: numberValue($event, threadSpec().majorDiameterMm) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.pitch") }}
              <input
                type="number"
                step="0.05"
                [ngModel]="threadSpec().pitchMm"
                (ngModelChange)="threadSpecChange.emit({ pitchMm: numberValue($event, threadSpec().pitchMm) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.length") }}
              <input
                type="number"
                step="0.5"
                [ngModel]="threadSpec().lengthMm"
                (ngModelChange)="threadSpecChange.emit({ lengthMm: numberValue($event, threadSpec().lengthMm) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.handedness") }}
              <select [ngModel]="threadSpec().handedness" (ngModelChange)="threadSpecChange.emit({ handedness: $event })">
                <option value="right">{{ i18n.t("editor.handedness.right") }}</option>
                <option value="left">{{ i18n.t("editor.handedness.left") }}</option>
              </select>
            </label>
          </div>
        </article>

        <article class="card">
          <h3>{{ i18n.t("editor.profileTuning") }}</h3>
          <div class="field-grid">
            <label>
              {{ i18n.t("editor.crestFlat") }}
              <input
                type="number"
                step="1"
                [ngModel]="threadSpec().crestFlatPercent ?? 0"
                (ngModelChange)="threadSpecChange.emit({ crestFlatPercent: numberValue($event, threadSpec().crestFlatPercent ?? 0) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.rootFlat") }}
              <input
                type="number"
                step="1"
                [ngModel]="threadSpec().rootFlatPercent ?? 0"
                (ngModelChange)="threadSpecChange.emit({ rootFlatPercent: numberValue($event, threadSpec().rootFlatPercent ?? 0) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.flankAngle") }}
              <input
                type="number"
                step="1"
                [ngModel]="threadSpec().flankAngleDeg ?? 30"
                (ngModelChange)="threadSpecChange.emit({ flankAngleDeg: numberValue($event, threadSpec().flankAngleDeg ?? 30) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.clearanceMode") }}
              <select [ngModel]="threadSpec().clearanceMode" (ngModelChange)="threadSpecChange.emit({ clearanceMode: $event })">
                <option value="preset">{{ i18n.t("editor.clearanceMode.preset") }}</option>
                <option value="manual">{{ i18n.t("editor.clearanceMode.manual") }}</option>
              </select>
            </label>

            @if ((threadSpec().threadStandard ?? "custom") === "custom") {
              <label>
                {{ i18n.t("editor.depthMode") }}
                <select [ngModel]="threadSpec().depthMode ?? 'auto'" (ngModelChange)="updateDepthMode($event)">
                  <option value="auto">{{ i18n.t("editor.depthMode.auto") }}</option>
                  <option value="manual">{{ i18n.t("editor.depthMode.manual") }}</option>
                </select>
              </label>
            }

            @if ((threadSpec().threadStandard ?? "custom") === "custom" && (threadSpec().depthMode ?? "auto") === "manual") {
              <label class="span-2">
                {{ i18n.t("editor.manualDepth") }}
                <input
                  type="number"
                  step="0.01"
                  [ngModel]="threadSpec().manualDepthMm ?? derivedDepthFallback()"
                  (ngModelChange)="threadSpecChange.emit({ manualDepthMm: numberValue($event, derivedDepthFallback()) })"
                />
              </label>
            } @else if ((threadSpec().threadStandard ?? "custom") === "custom") {
              <p class="inline-note span-2">{{ i18n.t("editor.depthAutoHint") }}</p>
            } @else {
              <p class="inline-note span-2">{{ i18n.t("editor.standardPlaceholder") }}</p>
            }

            @if (threadSpec().clearanceMode === "manual") {
              <label class="span-2">
                {{ i18n.t("editor.manualClearance") }}
                <input
                  type="number"
                  step="0.01"
                  [ngModel]="threadSpec().manualClearanceMm ?? 0.18"
                  (ngModelChange)="threadSpecChange.emit({ manualClearanceMm: numberValue($event, threadSpec().manualClearanceMm ?? 0.18) })"
                />
              </label>
            }

            @if ((threadSpec().threadStandard ?? "custom") === "custom") {
              <section class="derived-card span-2">
                <h4>{{ i18n.derivedMetricsTitle() }}</h4>
                <dl class="derived-grid">
                  <div>
                    <dt>{{ i18n.derivedDepthLabel() }}</dt>
                    <dd>{{ derivedGeometry().depthMm | number: "1.2-3" }} mm</dd>
                  </div>
                  <div>
                    <dt>{{ i18n.derivedMinorDiameterLabel() }}</dt>
                    <dd>{{ derivedGeometry().minorDiameterMm | number: "1.2-3" }} mm</dd>
                  </div>
                  <div>
                    <dt>{{ i18n.derivedCrestWidthLabel() }}</dt>
                    <dd>{{ derivedGeometry().crestWidthMm | number: "1.2-3" }} mm</dd>
                  </div>
                  <div>
                    <dt>{{ i18n.derivedRootWidthLabel() }}</dt>
                    <dd>{{ derivedGeometry().rootWidthMm | number: "1.2-3" }} mm</dd>
                  </div>
                </dl>

                @if (derivedGeometry().depthWasClamped) {
                  <p class="inline-note">{{ i18n.derivedClampHint() }}</p>
                }
              </section>
            }
          </div>
        </article>

        <article class="card">
          <h3>{{ i18n.t("editor.printSettings") }}</h3>
          <div class="field-grid">
            <label>
              {{ i18n.t("editor.material") }}
              <select [ngModel]="printSettings().materialFamily" (ngModelChange)="printSettingsChange.emit({ materialFamily: $event })">
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS_ASA">ABS/ASA</option>
                <option value="PA_CF">PA-CF</option>
                <option value="TPU">TPU</option>
              </select>
            </label>

            <label>
              {{ i18n.t("editor.nozzle") }}
              <input
                type="number"
                step="0.05"
                [ngModel]="printSettings().nozzleDiameterMm"
                (ngModelChange)="printSettingsChange.emit({ nozzleDiameterMm: numberValue($event, printSettings().nozzleDiameterMm) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.layerHeight") }}
              <input
                type="number"
                step="0.02"
                [ngModel]="printSettings().layerHeightMm"
                (ngModelChange)="printSettingsChange.emit({ layerHeightMm: numberValue($event, printSettings().layerHeightMm) })"
              />
            </label>

            <label>
              {{ i18n.t("editor.lineWidth") }}
              <input
                type="number"
                step="0.02"
                [ngModel]="printSettings().lineWidthMm ?? 0.45"
                (ngModelChange)="printSettingsChange.emit({ lineWidthMm: numberValue($event, printSettings().lineWidthMm ?? 0.45) })"
              />
            </label>

            <label class="span-2">
              {{ i18n.t("editor.qualityPreset") }}
              <select [ngModel]="printSettings().qualityPreset ?? 'balanced'" (ngModelChange)="printSettingsChange.emit({ qualityPreset: $event })">
                <option value="fine">{{ i18n.t("editor.qualityPreset.fine") }}</option>
                <option value="balanced">{{ i18n.t("editor.qualityPreset.balanced") }}</option>
                <option value="strong">{{ i18n.t("editor.qualityPreset.strong") }}</option>
              </select>
            </label>
          </div>
        </article>
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

    h2,
    h3 {
      margin: 0;
    }

    .status {
      padding: 8px 10px;
      border-radius: 999px;
      background: var(--tk-accent-soft);
      color: var(--tk-accent);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .card-grid {
      display: grid;
      gap: 16px;
    }

    .card {
      padding: 18px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.74);
      border: 1px solid rgba(55, 77, 102, 0.1);
    }

    h3 {
      margin-bottom: 14px;
      font-size: 1rem;
    }

    .field-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }

    .span-2 {
      grid-column: span 2;
    }

    label {
      display: grid;
      gap: 6px;
      color: var(--tk-text-muted);
      font-size: 0.88rem;
      font-weight: 600;
    }

    input,
    select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid rgba(55, 77, 102, 0.14);
      border-radius: 12px;
      background: var(--tk-surface-strong);
      color: #122033;
    }

    .inline-note {
      margin: 0;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(31, 111, 255, 0.06);
      color: var(--tk-text-muted);
      line-height: 1.5;
    }

    .derived-card {
      display: grid;
      gap: 12px;
      padding: 14px;
      border-radius: 14px;
      background: rgba(16, 44, 72, 0.05);
      border: 1px solid rgba(55, 77, 102, 0.08);
    }

    .derived-card h4 {
      margin: 0;
      font-size: 0.95rem;
    }

    .derived-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      margin: 0;
    }

    .derived-grid dt {
      margin-bottom: 4px;
      color: var(--tk-text-muted);
      font-size: 0.82rem;
    }

    .derived-grid dd {
      margin: 0;
      font-weight: 700;
      color: var(--tk-text);
    }

    @media (max-width: 700px) {
      .span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class ThreadEditorComponent {
  readonly i18n = inject(UiI18nService);
  readonly threadSpec = input.required<ThreadSpec>();
  readonly printSettings = input.required<PrintSettings>();

  readonly threadSpecChange = output<Partial<ThreadSpec>>();
  readonly printSettingsChange = output<Partial<PrintSettings>>();

  readonly derivedGeometry = computed(() => {
    const spec = normalizeThreadSpec(this.threadSpec());
    const profile = buildThreadProfile(spec);
    const minorDiameterMm = Math.max(spec.majorDiameterMm - profile.metrics.threadDepthMm * 2, 0);

    return {
      depthMm: profile.metrics.threadDepthMm,
      minorDiameterMm,
      crestWidthMm: profile.metrics.crestWidthMm,
      rootWidthMm: profile.metrics.rootWidthMm,
      depthWasClamped:
        (spec.threadStandard ?? "custom") === "custom" &&
        (spec.depthMode ?? "auto") === "manual" &&
        spec.manualDepthMm !== undefined &&
        profile.metrics.threadDepthMm < spec.manualDepthMm
    };
  });

  updateThreadStandard(value: string): void {
    if (
      value === "custom" ||
      value === "isoMetric" ||
      value === "trapezoidalMetric" ||
      value === "acmeImperial"
    ) {
      this.threadSpecChange.emit({
        threadStandard: value,
        depthMode: value === "custom" ? this.threadSpec().depthMode ?? "auto" : "auto",
        manualDepthMm: value === "custom" ? this.threadSpec().manualDepthMm : undefined
      });
    }
  }

  updateDepthMode(value: string): void {
    if (value === "auto" || value === "manual") {
      this.threadSpecChange.emit({
        depthMode: value,
        manualDepthMm: value === "manual" ? this.threadSpec().manualDepthMm ?? this.derivedDepthFallback() : undefined
      });
    }
  }

  derivedDepthFallback(): number {
    const pitch = this.numberValue(this.threadSpec().pitchMm, 0.1);

    switch (this.threadSpec().profileShape) {
      case "triangular":
        return pitch * 0.613;
      case "squareLike":
        return pitch * 0.44;
      case "trapezoidal":
      default:
        return pitch * 0.52;
    }
  }

  numberValue(value: string | number, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
