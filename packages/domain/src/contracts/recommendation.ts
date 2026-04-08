import type { RecommendationPriority } from "../enums/index.js";

export interface Recommendation {
  code: string;
  title: string;
  details: string;
  priority: RecommendationPriority;
}
