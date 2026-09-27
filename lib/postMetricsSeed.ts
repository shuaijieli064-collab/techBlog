export const baseViews: Record<string, number> = {
  "nextjs-beginner-notes": 128,
  "data-structures-learning-routine": 96,
  "project-retrospective-first-website": 74,
  "weekly-learning-routine": 63,
  "java-core-notes": 142,
  "springboot-learning-notes": 118,
  "mysql-mybatis-practice-notes": 87,
  "redis-message-queue-java-notes": 105,
};

export const baseLikes: Record<string, number> = {
  "nextjs-beginner-notes": 24,
  "data-structures-learning-routine": 18,
  "project-retrospective-first-website": 15,
  "weekly-learning-routine": 12,
  "java-core-notes": 31,
  "springboot-learning-notes": 22,
  "mysql-mybatis-practice-notes": 16,
  "redis-message-queue-java-notes": 20,
};

export function seedMetric(slug: string): { views: number; likes: number; liked: boolean } {
  return { views: baseViews[slug] ?? 0, likes: baseLikes[slug] ?? 0, liked: false };
}
