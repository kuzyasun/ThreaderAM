export const RECOMMENDATION_PRIORITIES = ["low", "medium", "high"] as const;

export type RecommendationPriority = (typeof RECOMMENDATION_PRIORITIES)[number];
