export type QuizQuestion = {
  q: string;
  choices: string[];
  answer: number;
};

export type LessonMeta = {
  id: string;
  title: string;
  track: string;
  level: string;
  durationMinutes: number;
  objectives: string[];
  timeline: { atSec: number; label: string; action: string }[];
  demoFiles: string[];
  practicePrompt: string;
  quiz: QuizQuestion[];
  docsLinks?: string[];
  offlineDocSlugs?: string[];
  assistMode?: string;
};

export type ContentBundle = {
  schemaVersion: number;
  generatedAt: string;
  catalog: Record<string, unknown>;
  lessons: Record<
    string,
    {
      meta: LessonMeta;
      demoMarkdown: string;
      assistMarkdown: string | null;
    }
  >;
  docs: Record<
    string,
    {
      slug: string;
      title: string;
      canonicalUrl: string;
      lastReviewed?: string;
      attribution: string;
      markdown: string;
    }
  >;
  manifest: { slugs: { slug: string; title: string; canonicalUrl: string }[] };
};

export type Env = {
  CORS_ORIGIN?: string;
};
