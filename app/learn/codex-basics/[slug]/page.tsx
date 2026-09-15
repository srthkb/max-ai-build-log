import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { debuggingWithCodexArticle, howToTalkToCodexArticle, type CodexArticle, whatIsCodexArticle } from "../../../data/codex-article";
import { learnLessons } from "../../../data/learn";

type ChapterPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return learnLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = learnLessons.find((item) => item.slug === slug);

  return {
    title: lesson?.title ?? "CODEX BASICS",
    description: lesson?.translation ?? "Codex 基础入门",
  };
}

function ComingSoonPage({ title, translation, previous }: { title: string; translation: string; previous?: { label: string; href: string } }) {
  return (
    <>
      <section className="border-t border-sky-100/15 pt-10 sm:pt-14">
        <p className="text-[10px] tracking-[.18em] text-sky-300">CHAPTER / IN PROGRESS</p>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,11vw,7rem)] font-semibold leading-[.84] tracking-[-.075em] text-white">
          {title}
        </h1>
        <p className="cn-subtitle mt-5 text-sky-50/50">{translation}</p>
        <p className="mt-12 border-t border-sky-100/15 pt-5 text-[10px] tracking-[.18em] text-sky-200/60">
          COMING SOON
        </p>
      </section>
      {previous && (
        <nav aria-label="Chapter navigation" className="mt-20 border-t border-sky-100/15 pt-5 text-[10px] tracking-[.14em] sm:mt-28">
          <Link href={previous.href} className="group inline-flex min-h-11 items-center gap-2 text-sky-50/60 transition-colors hover:text-white">
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            {previous.label}
          </Link>
        </nav>
      )}
    </>
  );
}

const codexArticles: Record<string, CodexArticle> = {
  "what-is-codex": whatIsCodexArticle,
  "how-to-talk-to-codex": howToTalkToCodexArticle,
  "debugging-with-codex": debuggingWithCodexArticle,
};

function CodexArticlePage({ article }: { article: CodexArticle }) {
  return (
    <article className="max-w-3xl">
      <header className="border-t border-sky-100/15 pt-10 sm:pt-14">
        <p className="text-[10px] tracking-[.18em] text-sky-300">{article.chapter} / CODEX BASICS</p>
        <h1 className="mt-6 text-[clamp(2.8rem,11vw,7rem)] font-semibold leading-[.84] tracking-[-.075em] text-white">
          {article.title}
        </h1>
        <p className="cn-subtitle mt-5 text-sky-50/50">{article.translation}</p>
      </header>

      <section className="mt-12 border-b border-sky-100/15 pb-12 sm:mt-16 sm:pb-16">
        {article.slug === "what-is-codex" && <h2 className="text-xl font-medium tracking-[-.02em] text-sky-50 sm:text-2xl">什么是 Codex？</h2>}
        <div className={`${article.slug === "what-is-codex" ? "mt-8" : "mt-0"} space-y-7 text-base leading-[2] text-sky-50/72 sm:text-lg`}>
          <p>{article.lead}</p>
          {article.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="space-y-20 sm:space-y-28">
        {article.sections.map((section) => (
          <section key={section.id} className="border-t border-sky-100/15 pt-7 sm:pt-9">
            <div className={section.id ? "flex items-start gap-5 sm:gap-8" : "block"}>
              {section.id && <span className="pt-1 text-[10px] tracking-[.18em] text-sky-300">{section.id} /</span>}
              <h2 className="max-w-2xl text-xl font-semibold leading-tight tracking-[-.035em] text-white sm:text-3xl">
                {section.title}
              </h2>
            </div>

            <div className="mt-8 space-y-7 text-base leading-[2] text-sky-50/72 sm:ml-[3.25rem] sm:text-lg">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {section.highlight && section.highlightPosition === "before" && (
              <blockquote className="mt-9 whitespace-pre-line border-l border-sky-300/70 pl-5 text-lg leading-relaxed text-sky-50/90 sm:ml-[3.25rem] sm:pl-6 sm:text-xl">
                {section.highlight}
              </blockquote>
            )}

            {section.bullets && (
              <ul className="mt-8 space-y-3 border-y border-sky-100/10 py-6 text-base leading-relaxed text-sky-50/75 sm:ml-[3.25rem] sm:text-lg">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-[.7em] h-1 w-1 shrink-0 rounded-full bg-sky-300/70" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.highlight && section.highlightPosition !== "before" && (
              <blockquote className="mt-9 whitespace-pre-line border-l border-sky-300/70 pl-5 text-lg leading-relaxed text-sky-50/90 sm:ml-[3.25rem] sm:pl-6 sm:text-xl">
                {section.highlight}
              </blockquote>
            )}
          </section>
        ))}
      </div>

      <nav aria-label="Chapter navigation" className="mt-20 flex flex-col gap-4 border-t border-sky-100/15 pt-5 text-[10px] tracking-[.14em] sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
        <Link href={article.previous.href} className="group inline-flex min-h-11 items-center gap-2 text-sky-50/60 transition-colors hover:text-white">
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          {article.previous.label}
        </Link>
        {article.next && (
          <Link href={article.next.href} className="group inline-flex min-h-11 items-center gap-2 text-right text-sky-50/60 transition-colors hover:text-white">
            <span>
              <span className="block">{article.next.label}</span>
              {article.next.translation && <span className="mt-1 block text-[9px] font-normal tracking-[.08em] text-sky-50/40">{article.next.translation}</span>}
            </span>
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </nav>
    </article>
  );
}

export default async function CodexChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const lesson = learnLessons.find((item) => item.slug === slug);

  if (!lesson) notFound();

  return (
    <main className="site-space min-h-[100svh] overflow-x-clip text-sky-50">
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-[-0.08em] text-white">
          MAX<span className="ml-0.5 align-top text-[8px] text-sky-300">®</span>
        </Link>
        <Link
          href="/learn/codex-basics"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-100/20 px-4 text-[10px] font-medium tracking-[.14em] text-sky-50/75 transition-colors duration-200 hover:border-sky-100/55 hover:bg-sky-100/[.06] hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          CODEX BASICS
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:pb-20 sm:pt-20 md:px-12 md:pb-24 md:pt-24">
        {codexArticles[lesson.slug] ? (
          <CodexArticlePage article={codexArticles[lesson.slug]} />
        ) : (
          <ComingSoonPage
            title={lesson.title}
            translation={lesson.translation}
            previous={lesson.slug === "debugging-with-codex" ? { label: "HOW TO TALK TO CODEX", href: "/learn/codex-basics/how-to-talk-to-codex" } : undefined}
          />
        )}
      </div>
    </main>
  );
}
