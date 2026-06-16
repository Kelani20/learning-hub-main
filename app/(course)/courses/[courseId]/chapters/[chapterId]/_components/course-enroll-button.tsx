"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (price > 0) {
      router.push(`/checkout/${courseId}`);
      return;
    }

    try {
      setIsLoading(true);

      await axios.post(`/api/courses/${courseId}/enroll`);
      toast.success("You are enrolled");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full cursor-pointer gap-x-2 rounded-full bg-brand-600 px-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg md:w-auto"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      Enroll for {price ? formatPrice(price) : "Free"}
    </Button>
  );
};
