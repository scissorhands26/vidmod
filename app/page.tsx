import { BackgroundGradient } from "@/components/BackgroundGradient";
import { Dropzone } from "@/components/Dropzone2";
import { HoverCard } from "@/components/HoverCard";
import SignUpForAlertsForm from "@/components/SignUpForAlertsForm";

export default function Home() {
  const steps = [
    {
      title: "1. Upload Your Video",
      description:
        "Easily upload your video by dragging and dropping it into the Dropzone area or by clicking to select a file from your device. Our platform supports a variety of video formats, catering to your diverse needs.",
      link: "#",
    },
    {
      title: "2. Convert Locally",
      description:
        "Experience swift and secure video processing directly within your browser. With local processing, there’s no need to upload your files to a server, ensuring faster turnaround times and superior privacy.",
      link: "#",
    },
    {
      title: "3. Download Your Video",
      description:
        "Once conversion is complete, you can download your modified video directly from the browser. Your files remain on your device throughout the process, safeguarding your privacy and security.",
      link: "#",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title + Desc */}
      <div>
        <h1 className="text-center text-3xl font-medium text-neutral-200 md:text-5xl">
          VidMod.io
        </h1>
      </div>

      {/* Upload Box */}
      <Dropzone />

      <p className="flex items-center justify-center text-white">
        *Works best on FireFox.
      </p>

      {/* How It Works Section */}
      <HoverCard items={steps} />

      <BackgroundGradient className="rounded-[22px] bg-slate-900 p-4 text-neutral-200 sm:p-10">
        <h2 className="mb-2 mt-4 text-2xl text-neutral-200 sm:text-4xl">
          Need Faster Video Conversions?
        </h2>
        <div className="my-4 border border-white" />
        <p className="text-lg text-neutral-200">
          Get{" "}
          <span className="relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Mod Tokens
            </span>
          </span>{" "}
          to accelerate your video processing times. Use tokens to prioritize
          your conversions and experience faster results.
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          <span className="text-lg text-white underline">How it works:</span> To
          boost conversion speeds, files are temporarily uploaded to our
          high-performance servers. This method surpasses the limitations of
          local hardware, providing you with quicker processing times. Your data
          only lives on our servers until the conversion is complete.
        </p>
        <SignUpForAlertsForm />
      </BackgroundGradient>

      <div className="space-y-10"></div>
    </div>
  );
}
