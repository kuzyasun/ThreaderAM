import { Component, computed, inject, input } from "@angular/core";
import type { Point2, ProfilePreview2d } from "@threadkit/domain";

import { UiI18nService } from "../../../core/services/ui-i18n.service";

interface RenderModel {
  baselineY: number;
  depthGuideLabel: string;
  depthGuideY: number;
  pitchGuideXs: number[];
  pitchLabel: string;
  pitchLabelX: number;
  pitchLabelY: number;
  pointDots: Array<{ cx: number; cy: number }>;
  polylinePoints: string;
}

@Component({
  selector: "threadkit-svg-profile-viewer",
  standalone: true,
  template: `
    <figure class="viewer">
      @if (renderModel(); as model) {
        <svg viewBox="0 0 240 180" role="img" [attr.aria-label]="i18n.t('viewer.profile.aria')">
          <defs>
            <linearGradient id="profileStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#1f6fff" />
              <stop offset="100%" stop-color="#17a48b" />
            </linearGradient>
            <linearGradient id="profileFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(31, 111, 255, 0.24)" />
              <stop offset="100%" stop-color="rgba(23, 164, 139, 0.08)" />
            </linearGradient>
          </defs>

          @for (guideX of model.pitchGuideXs; track $index) {
            <line
              [attr.x1]="guideX"
              y1="20"
              [attr.x2]="guideX"
              y2="150"
              class="guide-line"
            />
          }

          <line x1="16" [attr.y1]="model.baselineY" x2="224" [attr.y2]="model.baselineY" class="axis-line" />
          <line x1="16" [attr.y1]="model.depthGuideY" x2="224" [attr.y2]="model.depthGuideY" class="depth-line" />

          <polyline
            [attr.points]="model.polylinePoints"
            fill="none"
            stroke="url(#profileStroke)"
            stroke-linecap="square"
            stroke-linejoin="miter"
            stroke-miterlimit="10"
            stroke-width="3.5"
          />

          @for (dot of model.pointDots; track $index) {
            <circle [attr.cx]="dot.cx" [attr.cy]="dot.cy" r="2.2" class="profile-dot" />
          }

          <text x="18" [attr.y]="model.depthGuideY - 6" class="guide-label">{{ model.depthGuideLabel }}</text>
          <text [attr.x]="model.pitchLabelX" [attr.y]="model.pitchLabelY" class="guide-label guide-label--centered">
            {{ model.pitchLabel }}
          </text>
        </svg>
      } @else {
        <div class="empty">{{ i18n.t("viewer.profile.empty") }}</div>
      }
    </figure>
  `,
  styles: [`
    .viewer {
      margin: 0;
      min-height: 200px;
      padding: 12px;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(239, 246, 255, 0.88));
      border: 1px solid rgba(55, 77, 102, 0.1);
    }

    svg {
      width: 100%;
      height: 200px;
      display: block;
    }

    .axis-line {
      stroke: rgba(44, 64, 92, 0.25);
      stroke-width: 2;
    }

    .depth-line,
    .guide-line {
      stroke: rgba(44, 64, 92, 0.15);
      stroke-width: 1.5;
      stroke-dasharray: 4 4;
    }

    .profile-dot {
      fill: #1f6fff;
      opacity: 0.78;
    }

    .guide-label {
      fill: #5a6f88;
      font-size: 10px;
      font-weight: 600;
    }

    .guide-label--centered {
      text-anchor: middle;
    }

    .empty {
      display: grid;
      place-items: center;
      min-height: 176px;
      color: var(--tk-text-muted);
    }
  `]
})
export class SvgProfileViewerComponent {
  readonly i18n = inject(UiI18nService);
  readonly profile = input<ProfilePreview2d | undefined>();

  readonly renderModel = computed<RenderModel | null>(() => {
    const basePoints = this.profile()?.profilePoints ?? [];
    if (basePoints.length === 0) {
      return null;
    }

    const repeatedPoints = repeatProfile(basePoints);
    const xs = repeatedPoints.map((point) => point.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...repeatedPoints.map((point) => point.y), 0);
    const pitchMm = inferPitch(basePoints);
    const modelWidth = Math.max(maxX - minX, 1);
    const topMarginMm = Math.max(pitchMm * 0.16, 0.35);
    const bottomMarginMm = Math.max(pitchMm * 0.24, 0.45);
    const modelHeight = topMarginMm + Math.abs(minY) + bottomMarginMm;
    const availableWidth = 208;
    const availableHeight = 128;
    const scale = Math.min(availableWidth / modelWidth, availableHeight / modelHeight);
    const xOffset = 16 + (availableWidth - modelWidth * scale) / 2 - minX * scale;
    const baselineY = 20 + topMarginMm * scale;

    const toSvgPoint = (point: Point2): string => {
      const x = xOffset + point.x * scale;
      const y = baselineY - point.y * scale;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };
    const toSvgDot = (point: Point2) => ({
      cx: xOffset + point.x * scale,
      cy: baselineY - point.y * scale
    });

    const polylinePoints = repeatedPoints.map(toSvgPoint).join(" ");
    const depthGuideY = baselineY - minY * scale;
    const leftBoundary = xOffset + minX * scale;
    const seamX1 = xOffset + (-pitchMm / 2 + pitchMm) * scale;
    const seamX2 = seamX1 + pitchMm * scale;
    const rightBoundary = xOffset + maxX * scale;

    return {
      baselineY,
      depthGuideLabel: `${this.i18n.derivedDepthLabel()}: ${Math.abs(minY).toFixed(2)} mm`,
      depthGuideY,
      pitchGuideXs: [leftBoundary, seamX1, seamX2, rightBoundary],
      pitchLabel: `p = ${pitchMm.toFixed(2)} mm`,
      pitchLabelX: (seamX1 + seamX2) / 2,
      pitchLabelY: baselineY + bottomMarginMm * scale * 0.65,
      pointDots: repeatedPoints.map(toSvgDot),
      polylinePoints
    };
  });
}

function inferPitch(points: Point2[]): number {
  const xs = points.map((point) => point.x);
  return Math.max(Math.max(...xs) - Math.min(...xs), 0.1);
}

function repeatProfile(points: Point2[]): Point2[] {
  const pitch = inferPitch(points);
  const left = points.map((point) => ({
    x: point.x - pitch,
    y: point.y
  }));
  const center = points.map((point) => ({
    x: point.x,
    y: point.y
  }));
  const right = points.map((point) => ({
    x: point.x + pitch,
    y: point.y
  }));

  return [...left, ...center, ...right];
}
