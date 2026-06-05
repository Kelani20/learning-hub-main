"use client";

import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({
  onChange,
  value,
}: EditorProps) => {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <Textarea
        className="min-h-[220px] resize-y border-0 bg-transparent p-0 text-sm leading-7 text-slate-800 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write a concise chapter summary..."
        value={value}
      />
    </div>
  );
};
