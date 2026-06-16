"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};

const fromSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter description updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="product-muted mt-6 rounded-2xl p-4">
      <div className="font-bold flex items-center justify-between text-slate-950 dark:text-white">
        Chapter Access Settings
        <Button onClick={toggleEdit} variant="ghost" className="cursor-pointer rounded-full">
          {isEditing ? (
            <>Cancel</>
            ): (
              <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2 text-slate-700 dark:text-slate-200",
          !initialData.isFree && "text-slate-500 italic dark:text-slate-400"
        )}>
          {initialData.isFree ? (
            <>This chapter is free.</>
          ) : (
            <>This chapter is not free.</>
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <FormControl>
                    <Checkbox
                      id="make-free"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      <label htmlFor="make-free" className="cursor-pointer">
                        Make this chapter free
                      </label>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="cursor-pointer rounded-full bg-brand-500 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
