//@ts-nocheck

"use client";

// imports
import { FiUploadCloud } from "react-icons/fi";
import { LuFileSymlink } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import ReactDropzone from "react-dropzone";
import bytesToSize from "@/utils/bytes-to-size";
import fileToIcon from "@/utils/file-to-icon";
import { useState, useEffect, useRef } from "react";
import compressFileName from "@/utils/compress-file-name";
import { Skeleton } from "@/components/ui/skeleton";
import convertFile from "@/utils/convert";
import { ImSpinner3 } from "react-icons/im";
import { MdDone } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { HiOutlineDownload } from "react-icons/hi";
import { BiError } from "react-icons/bi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import loadFfmpeg from "@/utils/load-ffmpeg";
import type { Action } from "@/types";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const extensions = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
};

export function Dropzone() {
  // variables & hooks
  const [is_hover, setIsHover] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [is_loaded, setIsLoaded] = useState<boolean>(false);
  const [is_converting, setIsConverting] = useState<boolean>(false);
  const [is_done, setIsDone] = useState<boolean>(false);
  const ffmpegRef = useRef<any>(null);
  const [defaultValues, setDefaultValues] = useState<string>("video");
  const [conversionProgress, setConversionProgress] = useState<
    number | undefined
  >();
  const [logMsg, setLogMsg] = useState();
  const [applyToAllType, setApplyToAllType] = useState<string>("");

  const accepted_files = [
    ...extensions.image.map((elt) => `image/${elt}`),
    ...extensions.video.map((elt) => `video/${elt}`),
    ...extensions.audio.map((elt) => `audio/${elt}`),
  ];

  // functions
  function reset() {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
    location.reload();
  }

  function downloadAll(): void {
    for (let action of actions) {
      !action.is_error && download(action);
    }
  }

  function download(action: Action) {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    // Clean up after download
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  }

  async function convert(): Promise<any> {
    let tmp_actions = actions.map((elt) => ({
      ...elt,
      is_converting: true,
    }));
    setActions(tmp_actions);
    setIsConverting(true);

    try {
      const conversionPromises = tmp_actions.map(async (action) => {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        return {
          ...action,
          is_converted: true,
          is_converting: false,
          url,
          output,
        };
      });

      const results = await Promise.all(conversionPromises);

      setActions(results);

      results.forEach((action) => {
        if (!action.is_error) {
          let postBody = {
            fileName: action.file_name,
            size: bytesToSize(action.file_size),
            action: action,
          };

          fetch("/api/convert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postBody),
          }).then((response) => console.log(postBody));
        }
      });

      setIsDone(true);
      setIsConverting(false);
    } catch (err) {
      tmp_actions = tmp_actions.map((elt) => ({
        ...elt,
        is_converted: false,
        is_converting: false,
        is_error: true,
      }));
      setActions(tmp_actions);
      setIsDone(true);
      setIsConverting(false);
    }
  }

  function handleUpload(data: Array<any>): void {
    handleExitHover();
    setFiles(data);
    const tmp: Action[] = [];
    data.forEach((file: any) => {
      const formData = new FormData();
      tmp.push({
        id: uuidv4(), // Add unique ID to each action
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      });
    });
    setActions(tmp);
  }

  function handleHover(): void {
    return setIsHover(true);
  }

  function handleExitHover(): void {
    return setIsHover(false);
  }

  function updateAction(id: string, to: string) {
    setActions(
      actions.map((action): Action => {
        if (action.id === id) {
          console.log("FOUND");
          return {
            ...action,
            to,
          };
        }
        return action;
      }),
    );
  }

  function applyToAll() {
    setActions(actions.map((action) => ({ ...action, to: applyToAllType })));
  }

  function checkIsReady(): void {
    let tmp_is_ready = true;
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false;
    });
    setIsReady(tmp_is_ready);
  }

  function deleteAction(action: Action): void {
    setActions(actions.filter((elt) => elt.id !== action.id));
    setFiles(files.filter((elt) => elt.name !== action.file_name));
  }

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else checkIsReady();
  }, [actions]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const ffmpeg_response: FFmpeg = await loadFfmpeg(setConversionProgress);
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  }

  // returns
  if (actions.length) {
    return (
      <div className="space-y-6">
        {actions.map((action: Action, i: any) => (
          <div
            key={i}
            className="relative grid h-fit w-full grid-cols-4 flex-wrap items-center justify-between space-y-2 rounded-xl border px-4 py-4 text-white lg:h-20 lg:grid-cols-5 lg:flex-nowrap lg:px-10 lg:py-0"
          >
            {!is_loaded && (
              <Skeleton className="absolute -ml-10 h-full w-full cursor-progress rounded-xl" />
            )}
            <div className="col-span-4 flex items-center gap-4 lg:col-span-2">
              <span className="text-2xl text-white">
                {fileToIcon(action.file_type)}
              </span>
              <div className="flex w-96 items-center gap-1">
                <span className="text-md overflow-x-hidden font-medium">
                  {compressFileName(action.file_name)}
                </span>
                <span className="items-center justify-center text-center text-sm text-gray-400">
                  ({bytesToSize(action.file_size)})
                </span>
              </div>
            </div>
            {action.is_error ? (
              <Badge variant="destructive" className="flex gap-2">
                <span>Error Converting File</span>
                <BiError />
              </Badge>
            ) : action.is_converted ? (
              <Badge variant="default" className="flex gap-2 bg-green-500">
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.is_converting ? (
              <Badge
                variant="converting"
                className="flex gap-2"
                conversionProgress={conversionProgress}
              >
                <span>Converting {conversionProgress?.toFixed(0)}%</span>
                <span className="animate-spin">
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className="text-md col-span-2 flex items-center gap-4 text-white lg:col-span-1">
                <span>Convert to</span>
                <Select
                  onValueChange={(value) => {
                    if (extensions.audio.includes(value)) {
                      setDefaultValues("audio");
                    } else if (extensions.video.includes(value)) {
                      setDefaultValues("video");
                    }
                    updateAction(action.id, value); // Update specific action using its ID
                    if (i === 0 && actions.length > 1) {
                      setApplyToAllType(value);
                    }
                  }}
                  value={action.to ?? "..."}
                >
                  <SelectTrigger className="text-md w-32 bg-slate-900 text-center font-medium text-white outline-none focus:outline-none focus:ring-0">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent className="h-fit bg-slate-900 text-white">
                    {action.file_type.includes("image") && (
                      <div className="grid w-fit grid-cols-2 gap-2">
                        {extensions.image.map((elt, i) => (
                          <div key={i} className="col-span-1 text-center">
                            <SelectItem value={elt} className="mx-auto">
                              {elt}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                    {action.file_type.includes("video") && (
                      <Tabs defaultValue={defaultValues} className="w-full">
                        <TabsList className="w-full bg-slate-800 text-white">
                          <TabsTrigger
                            value="video"
                            className="w-full bg-slate-950 text-white"
                          >
                            Video
                          </TabsTrigger>
                          <TabsTrigger
                            value="audio"
                            className="w-full bg-slate-950 text-white"
                          >
                            Audio
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="video">
                          <div className="grid w-fit grid-cols-3 gap-2">
                            {extensions.video.map((elt, i) => (
                              <div key={i} className="col-span-1 text-center">
                                <SelectItem value={elt} className="mx-auto">
                                  {elt}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="audio">
                          <div className="grid w-fit grid-cols-3 gap-2">
                            {extensions.audio.map((elt, i) => (
                              <div key={i} className="col-span-1 text-center">
                                <SelectItem value={elt} className="mx-auto">
                                  {elt}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                    {action.file_type.includes("audio") && (
                      <div className="grid w-fit grid-cols-2 gap-2">
                        {extensions.audio.map((elt, i) => (
                          <div key={i} className="col-span-1 text-center">
                            <SelectItem value={elt} className="mx-auto">
                              {elt}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              {i === 0 && actions.length > 1 && (
                <Button className="ml-4 flex items-center" onClick={applyToAll}>
                  Apply to all
                </Button>
              )}
            </div>
            <div className="relative">
              {action.is_converted ? (
                <span
                  onClick={() => deleteAction(action)}
                  className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 transform cursor-pointer justify-end rounded-full text-2xl text-red-700 hover:border hover:border-red-700"
                >
                  <MdClose />
                </span>
              ) : (
                <span
                  onClick={() => deleteAction(action)}
                  className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full text-2xl text-red-700 hover:border hover:border-red-700"
                >
                  <MdClose />
                </span>
              )}
            </div>{" "}
          </div>
        ))}
        <div className="flex w-full justify-end">
          {is_done ? (
            <div className="flex w-fit flex-col space-y-4">
              <Button
                size="lg"
                className="relative inline-flex h-12 overflow-hidden rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                onClick={downloadAll}
              >
                {actions.length > 1 ? "Download All" : "Download"}
                <HiOutlineDownload className="ml-1" />
              </Button>
              <Button
                size="lg"
                onClick={reset}
                variant="outline"
                className="relative inline-flex h-12 overflow-hidden rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                Convert Another File(s)
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              disabled={!is_ready || is_converting}
              className="relative inline-flex h-12 min-w-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              onClick={convert}
            >
              {is_converting ? (
                <span className="animate-spin text-lg">
                  <ImSpinner3 />
                </span>
              ) : (
                <div className="relative inline-flex h-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Convert Now
                  </span>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex w-full overflow-hidden rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-black py-10 text-sm font-medium text-white backdrop-blur-3xl">
        {is_loaded ? (
          <ReactDropzone
            onDrop={handleUpload}
            onDragEnter={handleHover}
            onDragLeave={handleExitHover}
            accept={accepted_files}
            onDropRejected={() => {
              handleExitHover();
              toast("Error uploading your file(s)");
            }}
            onError={() => {
              handleExitHover();
              toast("Error uploading your file(s)");
            }}
          >
            {({ getRootProps, getInputProps }: any) => (
              <div
                {...getRootProps()}
                className="flex w-full cursor-pointer items-center justify-center rounded-2xl p-4 shadow-sm"
              >
                <input {...getInputProps()} />
                <div className="space-y-4 text-white">
                  {is_hover ? (
                    <>
                      <div className="flex justify-center text-6xl">
                        <LuFileSymlink />
                      </div>
                      <h3 className="text-center text-2xl font-medium">
                        Yes, right there
                      </h3>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center text-6xl">
                        <FiUploadCloud />
                      </div>
                      <h3 className="text-center text-2xl font-medium">
                        Click, or drop your files here
                      </h3>
                    </>
                  )}
                </div>
              </div>
            )}
          </ReactDropzone>
        ) : (
          <div className="flex w-full cursor-progress items-center justify-center rounded-2xl p-4 shadow-sm">
            <div className="space-y-4 text-white">
              <div className="flex justify-center text-6xl">
                <FiUploadCloud />
              </div>
              <h3 className="text-center text-2xl font-medium">
                Loading FFMpeg...
              </h3>
            </div>
          </div>
        )}
      </span>
    </div>
  );
}
