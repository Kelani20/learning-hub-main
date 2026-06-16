import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AuthAction({
  href = "/dashboard",
  label = "Explore platform",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link href={href} className="cursor-pointer">
      <Button className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        {label}
      </Button>
    </Link>
  );
}
