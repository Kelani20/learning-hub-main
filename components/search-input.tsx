"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="group relative w-full md:ml-8 md:w-[320px]">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition group-focus-within:text-teal-600 dark:group-focus-within:text-teal-300" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        aria-label="Search for a course"
        className="h-10 w-full rounded-full border-slate-200 bg-slate-100 pl-9 text-sm shadow-none transition focus-visible:border-teal-500 focus-visible:ring-teal-500/40 dark:border-slate-800 dark:bg-slate-900"
        placeholder="Search for a course"
      />
    </div>
  );
};
