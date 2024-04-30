// imports
import Dropzone from "@/components/Dropzone";

export default function Home() {
  return (
    <div className="space-y-16 pb-8">
      {/* Title + Desc */}
      <div className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-medium text-center text-white">
          VidMod.io
        </h1>
      </div>

      {/* Upload Box */}
      <Dropzone />
    </div>
  );
}
