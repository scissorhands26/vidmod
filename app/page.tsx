import Dropzone from "@/components/Dropzone";
import { BackgroundGradient } from "@/components/BackgroundGradient";
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
        <h1 className="text-3xl md:text-5xl font-medium text-center text-neutral-200">
          VidMod.io
        </h1>
      </div>

      {/* Upload Box */}
      <Dropzone />

      {/* How It Works Section */}
      <HoverCard items={steps} />

      <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-zinc-900 text-neutral-200">
        <p className="text-base sm:text-xl mt-4 mb-2 text-neutral-200">
          Need Faster Video Conversions?
        </p>
        <p className="text-sm text-neutral-400">
          Purchase Speed Tokens to accelerate your video processing times. Use
          tokens to prioritize your conversions and experience faster results.
        </p>
        <p className="text-sm text-neutral-400 mt-2">
          How it works: To boost conversion speeds, files are temporarily
          uploaded to our high-performance servers. This method surpasses the
          limitations of local hardware, providing you with quicker processing
          times. Rest assured, your data remains secure with us; we prioritize
          your privacy and employ stringent security measures to protect your
          videos.
        </p>
        <SignUpForAlertsForm />
      </BackgroundGradient>

      <div className="space-y-10"></div>
    </div>
  );
}
