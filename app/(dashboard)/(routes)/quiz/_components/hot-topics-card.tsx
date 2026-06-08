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
        <WordCloud formattedTopics={visibleTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
