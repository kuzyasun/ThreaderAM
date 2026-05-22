import { Component, inject, input } from "@angular/core";
import type { ValidationIssue } from "@threadkit/domain";

import { UiI18nService } from "../../../core/services/ui-i18n.service";

@Component({
  selector: "threadkit-warning-list",
  standalone: true,
  template: `
    <section class="list-card">
      <header>
        <h3>{{ i18n.t("warnings.title") }}</h3>
        <span>{{ issues().length }}</span>
      </header>

      @if (issues().length === 0) {
        <p class="empty">{{ i18n.t("warnings.empty") }}</p>
      } @else {
        <ul>
          @for (issue of issues(); track issue.code + issue.message) {
            <li>
              <span class="pill" [class.warning]="issue.severity === 'warning'" [class.error]="issue.severity === 'error'">
                {{ i18n.severityLabel(issue.severity) }}
              </span>
              <div>
                <strong>{{ i18n.fieldLabel(issue.field, issue.code) }}</strong>
                <p>{{ i18n.issueMessage(issue) }}</p>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [`
    .list-card {
      padding: 18px;
      border: 1px solid var(--tk-border);
      border-radius: 18px;
      background: var(--tk-surface);
      box-shadow: var(--tk-shadow);
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    h3 {
      margin: 0;
      font-size: 1rem;
    }

    ul {
      display: grid;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 12px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.72);
    }

    .pill {
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(31, 111, 255, 0.12);
      color: var(--tk-accent);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .pill.warning {
      background: rgba(209, 125, 0, 0.12);
      color: var(--tk-warning);
    }

    .pill.error {
      background: rgba(196, 69, 54, 0.12);
      color: var(--tk-danger);
    }

    strong {
      display: block;
      margin-bottom: 4px;
    }

    p,
    .empty {
      margin: 0;
      color: var(--tk-text-muted);
      line-height: 1.5;
    }
  `]
})
export class WarningListComponent {
  readonly i18n = inject(UiI18nService);
  readonly issues = input<ValidationIssue[]>([]);
}
