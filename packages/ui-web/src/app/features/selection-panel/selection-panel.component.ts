import { Component, inject, input } from "@angular/core";
import type { HostSelectionContext } from "@threadkit/domain";

import { UiI18nService } from "../../core/services/ui-i18n.service";

@Component({
  selector: "threadkit-selection-panel",
  standalone: true,
  template: `
    <section class="panel">
      <header>
        <div>
          <p class="eyebrow">{{ i18n.t("selection.eyebrow") }}</p>
          <h2>{{ i18n.t("selection.title") }}</h2>
        </div>
        <span class="type">{{ i18n.selectionTypeLabel(selection().selectionType) }}</span>
      </header>

      <dl class="stats">
        <div>
          <dt>{{ i18n.t("selection.diameter") }}</dt>
          <dd>{{ selection().cylinderDiameterMm ?? i18n.t("selection.na") }} mm</dd>
        </div>
        <div>
          <dt>{{ i18n.t("selection.length") }}</dt>
          <dd>{{ selection().availableLengthMm ?? i18n.t("selection.na") }} mm</dd>
        </div>
        <div>
          <dt>{{ i18n.t("selection.axis") }}</dt>
          <dd>
            @if (selection().axisDirection; as axis) {
              {{ axis.x }}, {{ axis.y }}, {{ axis.z }}
            } @else {
              {{ i18n.t("selection.na") }}
            }
          </dd>
        </div>
      </dl>

      <div class="chips">
        <span [class.active]="selection().isExternalCandidate">{{ i18n.t("selection.externalCandidate") }}</span>
        <span [class.active]="selection().isInternalCandidate">{{ i18n.t("selection.internalCandidate") }}</span>
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

    .type {
      padding: 8px 10px;
      border-radius: 999px;
      background: var(--tk-accent-soft);
      color: var(--tk-accent);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    .stats {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      margin: 0;
    }

    dt {
      margin-bottom: 4px;
      color: var(--tk-text-muted);
      font-size: 0.85rem;
    }

    dd {
      margin: 0;
      font-weight: 600;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .chips span {
      padding: 8px 10px;
      border-radius: 999px;
      background: rgba(80, 99, 123, 0.1);
      color: var(--tk-text-muted);
      font-size: 0.82rem;
      font-weight: 600;
    }

    .chips span.active {
      background: rgba(19, 138, 82, 0.12);
      color: var(--tk-success);
    }
  `]
})
export class SelectionPanelComponent {
  readonly i18n = inject(UiI18nService);
  readonly selection = input.required<HostSelectionContext>();
}
