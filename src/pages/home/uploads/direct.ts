import { password } from "~/store"
import { r } from "~/utils"
import { SetUpload, Upload } from "./types"

interface DirectUploadResponse {
  code: number
  message: string
  data: {
    upload_url: string
    chunk_size: number
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

  // Get direct upload URL from backend
  const urlResp: DirectUploadResponse = await r.post(
    "/fs/get_direct_upload_url",
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

  if (urlResp.code !== 200) {
    return new Error(urlResp.message)
  }

  const uploadUrl = urlResp.data.upload_url
  const chunkSize = urlResp.data.chunk_size || 5 * 1024 * 1024 // Default 5MB

  // Upload file in chunks directly to OneDrive
  let oldTimestamp = new Date().valueOf()
  let oldLoaded = 0
  let uploaded = 0
  const totalSize = file.size

  while (uploaded < totalSize) {
    const start = uploaded
    const end = Math.min(uploaded + chunkSize, totalSize)
    const chunk = file.slice(start, end)

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
          "Content-Length": (end - start).toString(),
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
    } catch (error: any) {
      return new Error(`Upload error: ${error.message}`)
    }
  }

  return undefined
}
