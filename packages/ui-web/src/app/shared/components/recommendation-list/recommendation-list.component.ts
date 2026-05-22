import { Component, inject, input } from "@angular/core";
import type { Recommendation } from "@threadkit/domain";

import { UiI18nService } from "../../../core/services/ui-i18n.service";

@Component({
  selector: "threadkit-recommendation-list",
  standalone: true,
  template: `
    <section class="list-card">
      <header>
        <h3>{{ i18n.t("recommendations.title") }}</h3>
        <span>{{ recommendations().length }}</span>
      </header>

      @if (recommendations().length === 0) {
        <p class="empty">{{ i18n.t("recommendations.empty") }}</p>
      } @else {
        <ul>
          @for (item of recommendations(); track item.code) {
            <li>
              <span class="pill" [class.high]="item.priority === 'high'">{{ i18n.priorityLabel(item.priority) }}</span>
              <div>
                <strong>{{ i18n.recommendationTitle(item) }}</strong>
                <p>{{ i18n.recommendationDetails(item) }}</p>
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

    .pill.high {
      background: rgba(19, 138, 82, 0.12);
      color: var(--tk-success);
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
export class RecommendationListComponent {
  readonly i18n = inject(UiI18nService);
  readonly recommendations = input<Recommendation[]>([]);
}
