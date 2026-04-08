import { Component, computed, input } from "@angular/core";
import type { LayerSlicePreview } from "@threadkit/domain";

@Component({
  selector: "threadkit-canvas-layer-viewer",
  standalone: true,
  template: `
    <figure class="viewer">
      @if (rows().length > 0) {
        <svg [attr.viewBox]="'0 0 260 ' + viewHeight()" role="img" aria-label="Layer slice preview">
          @for (row of rows(); track row.index) {
            <g [attr.transform]="'translate(0,' + row.offsetY + ')'">
              <text x="8" y="18" fill="#5a6f88" font-size="11">{{ row.label }}</text>
              @for (segment of row.segments; track $index) {
                <line
                  [attr.x1]="segment.x1"
                  [attr.y1]="segment.y1"
                  [attr.x2]="segment.x2"
                  [attr.y2]="segment.y2"
                  stroke="#1f6fff"
                  stroke-linecap="round"
                  stroke-width="4"
                />
              }
            </g>
          }
        </svg>
      } @else {
        <div class="empty">Layer preview will appear here.</div>
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
export class CanvasLayerViewerComponent {
  readonly slices = input<LayerSlicePreview[]>([]);

  readonly rows = computed(() => {
    const slices = this.slices();
    if (slices.length === 0) {
      return [];
    }

    const xs = slices.flatMap((slice) =>
      slice.segments.flatMap((segment) => [segment.start.x, segment.end.x])
    );
    const ys = slices.flatMap((slice) =>
      slice.segments.flatMap((segment) => [segment.start.y, segment.end.y])
    );
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = Math.max(maxX - minX, 1);
    const height = Math.max(maxY - minY, 1);

    return slices.map((slice, index) => ({
      index: slice.index,
      label: `Layer ${slice.index + 1} · z ${slice.zMm.toFixed(2)} mm`,
      offsetY: index * 44,
      segments: slice.segments.map((segment) => ({
        x1: 74 + ((segment.start.x - minX) / width) * 164,
        y1: 28 - ((segment.start.y - minY) / height) * 20,
        x2: 74 + ((segment.end.x - minX) / width) * 164,
        y2: 28 - ((segment.end.y - minY) / height) * 20
      }))
    }));
  });

  readonly viewHeight = computed(() => Math.max(this.rows().length * 44, 60));
}
