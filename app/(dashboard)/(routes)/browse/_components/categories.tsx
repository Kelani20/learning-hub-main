"use client";

import {
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
  Lightbulb,
  LucideIcon,
  MonitorSmartphone,
  Shapes,
} from "lucide-react";
import { Category } from "@prisma/client";

import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<string, LucideIcon> = {
  "AI": BrainCircuit,
  "Backend": Database,
  "Computer Science": MonitorSmartphone,
  "Engineering": Shapes,
  "Frontend": Code2,
  "Product": BarChart3,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name] ?? Lightbulb}
          value={item.id}
        />
      ))}
    </div>
  );
};
