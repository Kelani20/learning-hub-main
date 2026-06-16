import React from "react";
import { db } from "@/lib/db";
import { getDemoTopicCounts } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "./word-cloud";

const HotTopicsCard = async () => {
  const topics =
    isDemoMode && !hasDatabaseUrl
      ? []
      : await db.topic_count.findMany({}).catch((error) => {
          console.log("[HOT_TOPICS_CARD]", error);
          return [];
        });
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });
  const visibleTopics =
    formattedTopics.length === 0 && isDemoMode
      ? getDemoTopicCounts()
      : formattedTopics;
  
  return (
    <Card className="col-span-4 overflow-hidden rounded-2xl border-slate-200 shadow-sm product-surface dark:border-slate-800">
      <CardHeader className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-transparent">
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950 dark:text-slate-50">
          Trending topics
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
          See which subjects learners are practicing most. Tap any topic to start a quiz.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <WordCloud formattedTopics={visibleTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
