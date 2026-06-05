import { MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDiscussionThreads } from "@/lib/discussions";

import { DiscussionComposer } from "./_components/discussion-composer";

export const dynamic = "force-dynamic";

const displayAuthor = (authorId: string) =>
  authorId === "demo_instructor" ? "Demo Instructor" : "Demo Learner";

const DiscussionsPage = async () => {
  const threads = await listDiscussionThreads();

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-800">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-black tracking-normal text-slate-950">Discussions</h1>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Ask questions, compare notes, and keep course context close to the lesson work.
        </p>
      </div>

      <DiscussionComposer />

      <div className="grid gap-4">
        {threads.map((thread) => (
          <Card key={thread.id} className="rounded-md border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {thread.course?.title && <Badge variant="secondary">{thread.course.title}</Badge>}
                <span className="text-xs text-slate-500">
                  Started by {displayAuthor(thread.authorId)}
                </span>
              </div>
              <CardTitle className="text-lg font-black tracking-normal text-slate-950">{thread.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {thread.messages.map((message) => (
                <div key={message.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    {displayAuthor(message.authorId)}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{message.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscussionsPage;
