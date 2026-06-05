import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

import { env } from "@/lib/env";

const demoUser = {
  id: "demo_learner",
  name: "Demo Learner",
  image: undefined,
};

export default function useInitializeChatClient() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(env.NEXT_PUBLIC_STREAM_KEY);

    client
      .connectUser(demoUser, async () => {
        const response = await fetch("/api/get-token");
        if (!response.ok) {
          throw Error("Failed to get token");
        }
        const body = await response.json();
        return body.token;
      })
      .catch((error) => console.error("Failed to connect demo user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error));
    };
  }, []);

  return chatClient;
}
