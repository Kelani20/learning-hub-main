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
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
};

const fromSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({
  initialData,
  courseId,
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course price updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="product-muted mt-6 rounded-2xl p-4">
      <div className="font-bold flex items-center justify-between text-slate-950 dark:text-white">
        Course Price
        <Button onClick={toggleEdit} variant="ghost" className="cursor-pointer rounded-full">
          {isEditing ? (
            <>Cancel</>
            ): (
              <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2 text-slate-700 dark:text-slate-200",
          !initialData.price && "text-slate-500 italic dark:text-slate-400"
        )}>
          {initialData.price
            ? formatPrice(initialData.price)
            : "No price set"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
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