"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DiscussionComposer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (trimmed.length < 4) {
      toast.error("Add a clearer question");
      return;
    }

    try {
      setIsPosting(true);
      await axios.post("/api/discussions", { title: trimmed });
      setTitle("");
      toast.success("Discussion created");
      router.refresh();
    } catch {
      toast.error("Could not create discussion");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="product-surface flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="h-11 rounded-full border-slate-200 bg-slate-50 px-4 shadow-none transition-colors duration-200 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
        placeholder="Ask a question about a course or topic"
      />
      <Button
        type="submit"
        disabled={isPosting}
        className="h-11 cursor-pointer rounded-full bg-brand-500 px-6 font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPosting ? "Posting…" : "Post"}
      </Button>
    </form>
  );
}
