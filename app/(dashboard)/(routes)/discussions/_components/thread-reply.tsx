"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ThreadReply({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = body.trim();

    if (trimmed.length < 1) {
      toast.error("Write a reply first");
      return;
    }

    try {
      setIsPosting(true);
      await axios.post(`/api/discussions/${threadId}/messages`, { body: trimmed });
      setBody("");
      toast.success("Reply posted");
      router.refresh();
    } catch {
      toast.error("Could not post reply");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
      <label htmlFor={`reply-${threadId}`} className="sr-only">
        Write a reply
      </label>
      <Input
        id={`reply-${threadId}`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="h-10 rounded-full border-slate-200 bg-slate-50 px-4 shadow-none transition-colors duration-200 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
        placeholder="Add a reply…"
      />
      <Button
        type="submit"
        disabled={isPosting}
        className="h-10 shrink-0 cursor-pointer rounded-full bg-brand-500 px-5 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPosting ? "Posting…" : "Reply"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
