"use client";

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => { 
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/admin/courses/${response.data.id}`);
      toast.success("Course created");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="product-surface motion-rise w-full max-w-2xl rounded-2xl p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
          New course
        </p>
        <h1 className="mt-2 text-balance text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Name your course
        </h1>
        <p className="mt-2 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
          Choose a name that describes your course. Don&apos;t worry, you can change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'How to make a website'"
                      className="transition-colors duration-200 focus-visible:ring-brand-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/admin/courses">
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer rounded-full"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="cursor-pointer rounded-full bg-brand-500 px-6 font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
 
export default CreatePage;