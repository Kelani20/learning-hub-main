import React from "react";
import { db } from "@/lib/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "./word-cloud";

const HotTopicsCard = async () => {
  const topics = await db.topic_count.findMany({});
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });
  
  return (
    <Card className="col-span-4 overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-white">
        <CardTitle className="text-2xl tracking-normal">
          Hot Topics
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          See what topics are trending in the community.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <WordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
