import { Component, computed, input } from "@angular/core";
import type { ProfilePreview2d } from "@threadkit/domain";

@Component({
  selector: "threadkit-svg-profile-viewer",
  standalone: true,
  template: `
    <figure class="viewer">
      @if (polylinePoints()) {
        <svg viewBox="0 0 240 160" role="img" aria-label="Thread profile preview">
          <defs>
            <linearGradient id="profileStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#1f6fff" />
              <stop offset="100%" stop-color="#17a48b" />
            </linearGradient>
          </defs>
          <line x1="16" y1="112" x2="224" y2="112" stroke="rgba(44, 64, 92, 0.18)" stroke-width="2" />
          <polyline
            [attr.points]="polylinePoints()"
            fill="none"
            stroke="url(#profileStroke)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="6"
          />
        </svg>
      } @else {
        <div class="empty">Profile preview will appear here.</div>
      }
    </figure>
  `,
  styles: [`
    .viewer {
      margin: 0;
      min-height: 180px;
      padding: 12px;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(239, 246, 255, 0.85));
      border: 1px solid rgba(55, 77, 102, 0.1);
    }

    svg {
      width: 100%;
      height: 180px;
      display: block;
    }

    .empty {
      display: grid;
      place-items: center;
      min-height: 156px;
      color: var(--tk-text-muted);
    }
  `]
})
export class SvgProfileViewerComponent {
  readonly profile = input<ProfilePreview2d | undefined>();

  readonly polylinePoints = computed(() => {
    const points = this.profile()?.profilePoints ?? [];
    if (points.length === 0) {
      return "";
    }

    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = Math.max(maxX - minX, 1);
    const height = Math.max(maxY - minY, 1);

    return points
      .map((point) => {
        const x = 20 + ((point.x - minX) / width) * 200;
        const y = 24 + (1 - (point.y - minY) / height) * 96;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  });
}
