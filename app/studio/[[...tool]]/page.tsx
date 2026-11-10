import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: 560, margin: "15vh auto", padding: 20 }}>
        <h1>DOTS Admin isn&apos;t connected yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>) in <code>.env.local</code> and in your Vercel
          project&apos;s Environment Variables, then redeploy.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
