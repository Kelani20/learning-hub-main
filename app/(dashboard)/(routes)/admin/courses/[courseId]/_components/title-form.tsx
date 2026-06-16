"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
};

const fromSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
});

export const TitleForm = ({
  initialData,
  courseId,
}: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course title updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="product-muted mt-6 rounded-2xl p-4">
      <div className="font-bold flex items-center justify-between text-slate-950 dark:text-white">
        Course Title
        <Button onClick={toggleEdit} variant="ghost" className="cursor-pointer rounded-full">
          {isEditing ? (
            <>Cancel</>
            ): (
              <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 text-slate-700 dark:text-slate-200">
          {initialData.title}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="E.g. 'Advanced web development'"
                      className="transition-colors duration-200 focus-visible:ring-brand-500"
                      {...field}
                    />
                  </FormControl>
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