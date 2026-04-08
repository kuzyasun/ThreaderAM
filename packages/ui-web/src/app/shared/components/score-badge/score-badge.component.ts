import { Component, computed, input } from "@angular/core";

@Component({
  selector: "threadkit-score-badge",
  standalone: true,
  template: `
    <div class="badge" [class.good]="tone() === 'good'" [class.warn]="tone() === 'warn'" [class.risk]="tone() === 'risk'">
      <span class="label">Mock quality</span>
      <strong>{{ score() }}</strong>
    </div>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(19, 138, 82, 0.1);
      color: #145d3c;
      border: 1px solid rgba(19, 138, 82, 0.16);
    }

    .badge.warn {
      background: rgba(209, 125, 0, 0.12);
      color: #8f5400;
      border-color: rgba(209, 125, 0, 0.18);
    }

    .badge.risk {
      background: rgba(196, 69, 54, 0.12);
      color: #8f2f22;
      border-color: rgba(196, 69, 54, 0.2);
    }

    .label {
      font-size: 0.84rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    strong {
      font-size: 1.15rem;
    }
  `]
})
export class ScoreBadgeComponent {
  readonly score = input(0);

  readonly tone = computed(() => {
    const score = this.score();
    if (score >= 78) {
      return "good";
    }

    if (score >= 55) {
      return "warn";
    }

    return "risk";
  });
}
