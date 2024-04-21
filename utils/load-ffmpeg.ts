// imports
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export default async function loadFfmpeg(setAsdf: any): Promise<FFmpeg> {
  // chack browser and console log
  console.log("loadFfmpeg");
  console.log(navigator.userAgent);

  const userInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    hardwareConcurrency: navigator.hardwareConcurrency,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
  };

  const ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });

  ffmpeg.on("progress", ({ progress, time }) => {
    console.log("Progress:", progress * 100, "Time:", time);
    setAsdf(progress * 100);
  });

  // if firefox, load with worker, else don't
  if (navigator.userAgent.includes("Firefox")) {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/umd";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
  } else {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  }

  return ffmpeg;
}
