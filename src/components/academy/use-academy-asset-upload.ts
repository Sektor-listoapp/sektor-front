import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";
import {
  CONFIRM_ACADEMY_COURSE_ASSET_UPLOAD,
  REQUEST_ACADEMY_COURSE_ASSET_UPLOAD,
} from "@/lib/sektor-api/mutations";
import {
  AcademyCourseAssetType,
  Mutation,
} from "@/lib/sektor-api/__generated__/types";

/**
 * Same 3-step flow as the app: ask the backend for a presigned URL, PUT the
 * file straight to storage, then confirm so the asset can be referenced.
 * Returns the public file URL to store in the course.
 */
export const useAcademyAssetUpload = () => {
  const client = useApolloClient();

  return useCallback(
    async (
      file: File,
      assetType: AcademyCourseAssetType,
      onProgress?: (percent: number) => void
    ): Promise<string> => {
      const contentType = file.type || "application/octet-stream";
      const { data } = await client.mutate<Mutation>({
        mutation: REQUEST_ACADEMY_COURSE_ASSET_UPLOAD,
        variables: {
          input: {
            assetType,
            fileName: file.name,
            contentType,
            size: file.size,
          },
        },
      });
      const upload = data?.requestAcademyCourseAssetUpload;
      if (!upload) throw new Error("No se pudo iniciar la subida del archivo");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", upload.signedUrl);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Error al subir ${file.name} (${xhr.status})`));
        xhr.onerror = () =>
          reject(new Error(`Error de red al subir ${file.name}`));
        xhr.send(file);
      });

      const { data: confirmed } = await client.mutate<Mutation>({
        mutation: CONFIRM_ACADEMY_COURSE_ASSET_UPLOAD,
        variables: { input: { assetId: upload.assetId } },
      });
      return confirmed?.confirmAcademyCourseAssetUpload?.fileUrl ?? upload.fileUrl;
    },
    [client]
  );
};

/** Reads a video file's duration in seconds without uploading it. */
export const getVideoDuration = (file: File) =>
  new Promise<number>((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(video.duration || 0));
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    video.src = url;
  });
