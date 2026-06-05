"use client";

interface PreviewProps {
  value: string;
}

const htmlToReadableText = (value: string) => {
  return value
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
};

export const Preview = ({
  value,
}: PreviewProps) => {
  const paragraphs = htmlToReadableText(value)
    .split(/\n{1,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-sm leading-7 text-slate-700">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
};
