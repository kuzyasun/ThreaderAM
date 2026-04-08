import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { PrintSettings, ThreadSpec } from "@threadkit/domain";

@Component({
  selector: "threadkit-thread-editor",
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel">
      <header>
        <div>
          <p class="eyebrow">Mock editor</p>
          <h2>Thread setup</h2>
        </div>
        <span class="status">Domain-driven mock state</span>
      </header>

      <div class="card-grid">
        <article class="card">
          <h3>Base parameters</h3>
          <div class="field-grid">
            <label>
              Operation
              <select [ngModel]="threadSpec().operationMode" (ngModelChange)="threadSpecChange.emit({ operationMode: $event })">
                <option value="external">External</option>
                <option value="internal">Internal</option>
              </select>
            </label>

            <label>
              Profile
              <select [ngModel]="threadSpec().profileShape" (ngModelChange)="threadSpecChange.emit({ profileShape: $event })">
                <option value="triangular">Triangular</option>
                <option value="trapezoidal">Trapezoidal</option>
                <option value="squareLike">Square-like</option>
              </select>
            </label>

            <label>
              Major diameter, mm
              <input
                type="number"
                step="0.1"
                [ngModel]="threadSpec().majorDiameterMm"
                (ngModelChange)="threadSpecChange.emit({ majorDiameterMm: numberValue($event, threadSpec().majorDiameterMm) })"
              />
            </label>

            <label>
              Pitch, mm
              <input
                type="number"
                step="0.05"
                [ngModel]="threadSpec().pitchMm"
                (ngModelChange)="threadSpecChange.emit({ pitchMm: numberValue($event, threadSpec().pitchMm) })"
              />
            </label>

            <label>
              Length, mm
              <input
                type="number"
                step="0.5"
                [ngModel]="threadSpec().lengthMm"
                (ngModelChange)="threadSpecChange.emit({ lengthMm: numberValue($event, threadSpec().lengthMm) })"
              />
            </label>

            <label>
              Handedness
              <select [ngModel]="threadSpec().handedness" (ngModelChange)="threadSpecChange.emit({ handedness: $event })">
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </label>
          </div>
        </article>

        <article class="card">
          <h3>Profile tuning</h3>
          <div class="field-grid">
            <label>
              Crest flat, %
              <input
                type="number"
                step="1"
                [ngModel]="threadSpec().crestFlatPercent ?? 0"
                (ngModelChange)="threadSpecChange.emit({ crestFlatPercent: numberValue($event, threadSpec().crestFlatPercent ?? 0) })"
              />
            </label>

            <label>
              Root flat, %
              <input
                type="number"
                step="1"
                [ngModel]="threadSpec().rootFlatPercent ?? 0"
                (ngModelChange)="threadSpecChange.emit({ rootFlatPercent: numberValue($event, threadSpec().rootFlatPercent ?? 0) })"
              />
            </label>

            <label>
              Flank angle, deg
              <input
                type="number"
                step="1"
                [ngModel]="threadSpec().flankAngleDeg ?? 30"
                (ngModelChange)="threadSpecChange.emit({ flankAngleDeg: numberValue($event, threadSpec().flankAngleDeg ?? 30) })"
              />
            </label>

            <label>
              Clearance mode
              <select [ngModel]="threadSpec().clearanceMode" (ngModelChange)="threadSpecChange.emit({ clearanceMode: $event })">
                <option value="preset">Preset</option>
                <option value="manual">Manual</option>
              </select>
            </label>

            @if (threadSpec().clearanceMode === "manual") {
              <label class="span-2">
                Manual clearance, mm
                <input
                  type="number"
                  step="0.01"
                  [ngModel]="threadSpec().manualClearanceMm ?? 0.18"
                  (ngModelChange)="threadSpecChange.emit({ manualClearanceMm: numberValue($event, threadSpec().manualClearanceMm ?? 0.18) })"
                />
              </label>
            }
          </div>
        </article>

        <article class="card">
          <h3>Print settings</h3>
          <div class="field-grid">
            <label>
              Material
              <select [ngModel]="printSettings().materialFamily" (ngModelChange)="printSettingsChange.emit({ materialFamily: $event })">
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS_ASA">ABS/ASA</option>
                <option value="PA_CF">PA-CF</option>
                <option value="TPU">TPU</option>
              </select>
            </label>

            <label>
              Nozzle, mm
              <input
                type="number"
                step="0.05"
                [ngModel]="printSettings().nozzleDiameterMm"
                (ngModelChange)="printSettingsChange.emit({ nozzleDiameterMm: numberValue($event, printSettings().nozzleDiameterMm) })"
              />
            </label>

            <label>
              Layer height, mm
              <input
                type="number"
                step="0.02"
                [ngModel]="printSettings().layerHeightMm"
                (ngModelChange)="printSettingsChange.emit({ layerHeightMm: numberValue($event, printSettings().layerHeightMm) })"
              />
            </label>

            <label>
              Line width, mm
              <input
                type="number"
                step="0.02"
                [ngModel]="printSettings().lineWidthMm ?? 0.45"
                (ngModelChange)="printSettingsChange.emit({ lineWidthMm: numberValue($event, printSettings().lineWidthMm ?? 0.45) })"
              />
            </label>

            <label class="span-2">
              Quality preset
              <select [ngModel]="printSettings().qualityPreset ?? 'balanced'" (ngModelChange)="printSettingsChange.emit({ qualityPreset: $event })">
                <option value="fine">Fine</option>
                <option value="balanced">Balanced</option>
                <option value="strong">Strong</option>
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

    @media (max-width: 700px) {
      .span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class ThreadEditorComponent {
  readonly threadSpec = input.required<ThreadSpec>();
  readonly printSettings = input.required<PrintSettings>();

  readonly threadSpecChange = output<Partial<ThreadSpec>>();
  readonly printSettingsChange = output<Partial<PrintSettings>>();

  numberValue(value: string | number, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
