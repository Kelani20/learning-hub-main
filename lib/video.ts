import { env } from "@/lib/env";

export function toEmbeddableVideoUrl(url?: string | null) {
  if (!url) return null;

  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  return url;
}

async function getMuxVideo() {
  if (env.VIDEO_PROVIDER !== "mux") return null;

  if (!env.MUX_TOKEN_ID || !env.MUX_TOKEN_SECRET) {
    throw new Error("Mux credentials are required when VIDEO_PROVIDER=mux");
  }

  const Mux = (await import("@mux/mux-node")).default;
  const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET);
  return Video;
}

export async function deleteMuxAsset(assetId: string) {
  const Video = await getMuxVideo();
  if (!Video) return;

  await Video.Assets.del(assetId);
}

export async function createMuxAsset(input: string) {
  const Video = await getMuxVideo();
  if (!Video) return null;

  return Video.Assets.create({
    input,
    playback_policy: "public",
    test: false,
  });
}
