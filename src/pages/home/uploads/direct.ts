import { password } from "~/store"
import { r } from "~/utils"
import { SetUpload, Upload } from "./types"
import { StreamUpload } from "./stream"

interface DirectUploadInfo {
  upload_url: string
  chunk_size: number
  headers?: Record<string, string>
  method?: string
}

interface DirectUploadResponse {
  code: number
  message: string
  data: {
    upload_info: DirectUploadInfo | null
  }
}

export const DirectUpload: Upload = async (
  uploadPath: string,
  file: File,
  setUpload: SetUpload,
  asTask = false,
  overwrite = false,
  rapid = false,
): Promise<Error | undefined> => {
  // Get directory path and file name
  const pathParts = uploadPath.split("/").filter((p) => p !== "")
  const fileName = pathParts.pop() || file.name
  const dirPath = pathParts.length > 0 ? "/" + pathParts.join("/") : "/"

  // Get direct upload info from backend
  try {
    const resp: DirectUploadResponse = await r.post(
      "/fs/get_direct_upload_info",
      {
        path: dirPath,
        file_name: fileName,
        file_size: file.size,
      },
      {
        headers: {
          Password: password(),
        },
      },
    )

    const uploadInfo = resp.data?.upload_info

    // If upload_info is null, direct upload is not supported - fallback to Stream
    if (!uploadInfo) {
      console.log("[DirectUpload] Not supported, falling back to Stream upload")
      return await StreamUpload(
        uploadPath,
        file,
        setUpload,
        asTask,
        overwrite,
        rapid,
      )
    }

    const uploadUrl = uploadInfo.upload_url
    const chunkSize = uploadInfo.chunk_size || 5 * 1024 * 1024 // Default 5MB
    const method = uploadInfo.method || "PUT"
    const customHeaders = uploadInfo.headers || {}

    // Upload file in chunks directly to storage
    let oldTimestamp = new Date().valueOf()
    let oldLoaded = 0
    let uploaded = 0
    const totalSize = file.size

    while (uploaded < totalSize) {
      const start = uploaded
      const end = Math.min(uploaded + chunkSize, totalSize)
      const chunk = file.slice(start, end)

      const response = await fetch(uploadUrl, {
        method,
        headers: {
          "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
          "Content-Length": (end - start).toString(),
          ...customHeaders,
        },
        body: chunk,
      })

      if (!response.ok && response.status !== 202 && response.status !== 201) {
        const errorText = await response.text()
        return new Error(`Upload failed: ${response.status} ${errorText}`)
      }

      uploaded = end
      const progress = ((uploaded / totalSize) * 100) | 0
      setUpload("progress", progress)

      // Calculate upload speed
      const timestamp = new Date().valueOf()
      const duration = (timestamp - oldTimestamp) / 1000
      if (duration > 0.5) {
        const loaded = uploaded - oldLoaded
        const speed = loaded / duration
        setUpload("speed", speed)
        oldTimestamp = timestamp
        oldLoaded = uploaded
      }

      if (progress === 100) {
        setUpload("status", "success")
      }
    }

    return undefined
  } catch (error: any) {
    // If direct upload fails, fallback to Stream upload
    console.log(
      "[DirectUpload] Error occurred, falling back to Stream upload:",
      error.message,
    )
    return await StreamUpload(
      uploadPath,
      file,
      setUpload,
      asTask,
      overwrite,
      rapid,
    )
  }
}
