import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AuthAction({
  href = "/dashboard",
  label = "Explore demo",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link href={href}>
      <Button>{label}</Button>
    </Link>
  );
}
