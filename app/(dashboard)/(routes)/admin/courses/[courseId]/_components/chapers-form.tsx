"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChaptersList from "./chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
};

const fromSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({
  initialData,
  courseId,
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Course chapter created.");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });

      toast.success("Course chapters reordered.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = async (id: string) => {
    router.push(`/admin/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="product-muted relative mt-6 rounded-2xl p-4">
      {isUpdating && (
        <div className="absolute h-full w-full top-0 right-0 bg-slate-500/20 flex items-center justify-center rounded-2xl">
          <Loader2 className="animate-spin h-6 w-6 text-brand-600 dark:text-brand-400" />
        </div>
      )}
      <div className="font-bold flex items-center justify-between text-slate-950 dark:text-white">
        Course Chapters
        <Button onClick={toggleCreating} variant="ghost" className="cursor-pointer rounded-full">
          {isCreating ? (
            <>Cancel</>
            ): (
              <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="E.g. 'Introduction to the course'"
                      className="transition-colors duration-200 focus-visible:ring-brand-500"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="cursor-pointer rounded-full bg-brand-500 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Create
              </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2 text-slate-700 dark:text-slate-200",
          !initialData.chapters.length && "text-slate-500 italic dark:text-slate-400",
        )}>
          {!initialData.chapters.length && "No chapters yet."}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder chapters
        </p>
      )}
    </div>
  );
}