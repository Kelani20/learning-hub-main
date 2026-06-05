import { MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDiscussionThreads } from "@/lib/discussions";

import { DiscussionComposer } from "./_components/discussion-composer";

const displayAuthor = (authorId: string) =>
  authorId === "demo_instructor" ? "Demo Instructor" : "Demo Learner";

const DiscussionsPage = async () => {
  const threads = await listDiscussionThreads();

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-sky-600" />
          <h1 className="text-2xl font-semibold tracking-tight">Discussions</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask questions, compare notes, and keep course context close to the lesson work.
        </p>
      </div>

      <DiscussionComposer />

      <div className="grid gap-4">
        {threads.map((thread) => (
          <Card key={thread.id} className="rounded-md">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {thread.course?.title && <Badge variant="secondary">{thread.course.title}</Badge>}
                <span className="text-xs text-muted-foreground">
                  Started by {displayAuthor(thread.authorId)}
                </span>
              </div>
              <CardTitle className="text-lg">{thread.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {thread.messages.map((message) => (
                <div key={message.id} className="rounded-md bg-slate-50 p-3">
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
