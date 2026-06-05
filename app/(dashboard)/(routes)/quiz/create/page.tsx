import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import QuizCreation from "./_components/quiz-creation";

const Quiz = async ({
  searchParams 
}: {
  searchParams: Promise<{
    topic?: string;
  }>;
}) => {
  const { topic = "" } = await searchParams;
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  return <QuizCreation topic={topic} />;
};

export default Quiz;
