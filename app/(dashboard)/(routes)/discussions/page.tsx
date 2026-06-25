import { MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDiscussionThreads } from "@/lib/discussions";

import { DiscussionComposer } from "./_components/discussion-composer";
import { ThreadReply } from "./_components/thread-reply";

export const dynamic = "force-dynamic";

const displayAuthor = (authorId: string) =>
  authorId === "demo_instructor" ? "Instructor" : "Learner";

const DiscussionsPage = async () => {
  const threads = await listDiscussionThreads();

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="product-surface motion-rise rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Discussions</h1>
        </div>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
          Ask questions, compare notes, and keep course context close to the lesson work.
        </p>
      </div>

      <DiscussionComposer />

      {threads.length === 0 ? (
        <div className="product-muted motion-rise-delay-1 flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950 dark:text-white">
            Start the first conversation
          </h2>
          <p className="mt-2 max-w-md text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
            Post a question above and it will appear here for your cohort to jump in on.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {threads.map((thread) => (
            <Card key={thread.id} className="product-surface rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {thread.course?.title && (
                    <Badge variant="secondary" className="rounded-full">
                      {thread.course.title}
                    </Badge>
                  )}
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Started by {displayAuthor(thread.authorId)}
                  </span>
                </div>
                <CardTitle className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                  {thread.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {thread.messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {displayAuthor(message.authorId)}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{message.body}</p>
                  </div>
                ))}
                <ThreadReply threadId={thread.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionsPage;
