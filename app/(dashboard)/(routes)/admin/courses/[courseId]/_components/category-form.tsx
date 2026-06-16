"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string; }[];
};

const fromSchema = z.object({
  categoryId: z.string().min(1),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course category updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const selectedOption = options.find((option) => (option.value === initialData.categoryId));

  return (
    <div className="product-muted mt-6 rounded-2xl p-4">
      <div className="font-bold flex items-center justify-between text-slate-950 dark:text-white">
        Course Category
        <Button onClick={toggleEdit} variant="ghost" className="cursor-pointer rounded-full">
          {isEditing ? (
            <>Cancel</>
            ): (
              <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2 text-slate-700 dark:text-slate-200",
          !selectedOption && "text-slate-500 italic dark:text-slate-400"
        )}>
          {selectedOption?.label || "No category provided."}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox 
                      options={options}
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