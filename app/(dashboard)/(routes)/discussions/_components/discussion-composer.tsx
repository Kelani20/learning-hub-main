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
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-md border bg-white p-4 md:flex-row">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ask a question about a course or topic"
      />
      <Button type="submit" disabled={isPosting}>
        Post
      </Button>
    </form>
  );
}
