import { Upload, SetUpload } from "./types"
import { r, pathDir } from "~/utils"
import { StreamUpload } from "./stream"

export const DirectUpload: Upload = async (
  uploadPath: string,
  file: File,
  setUpload: SetUpload,
  asTask: boolean,
  overwrite: boolean,
  rapid: boolean,
) => {
  const path = pathDir(uploadPath)

  // Get direct upload info from backend
  try {
    const resp = await r.post("/fs/get_direct_upload_info", {
      path,
      file_name: file.name,
      file_size: file.size,
    })

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

    // Upload file directly to storage
    const chunkSize = uploadInfo.chunk_size || 0
    const uploadURL = uploadInfo.upload_url
    const method = uploadInfo.method || "PUT"

    if (chunkSize > 0 && file.size > chunkSize) {
      // Chunked upload
      return await uploadChunked(
        file,
        uploadURL,
        chunkSize,
        method,
        uploadInfo.headers,
        setUpload,
      )
    } else {
      // Single upload
      return await uploadSingle(
        file,
        uploadURL,
        method,
        uploadInfo.headers,
        setUpload,
      )
    }
  } catch (error: any) {
    console.error(
      "[DirectUpload] Failed, falling back to Stream upload:",
      error,
    )
    // Fallback to Stream upload on any error
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

async function uploadSingle(
  file: File,
  uploadURL: string,
  method: string,
  headers?: Record<string, string>,
  setUpload?: SetUpload,
): Promise<Error | undefined> {
  try {
    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && setUpload) {
          const progress = (e.loaded / e.total) * 100
          setUpload("progress", progress)
          setUpload("speed", 0) // Speed calculation not implemented
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(undefined)
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"))
      })

      xhr.open(method, uploadURL)

      // Set custom headers if provided
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value)
        })
      }

      xhr.send(file)
    })
  } catch (error: any) {
    return error
  }
}

async function uploadChunked(
  file: File,
  uploadURL: string,
  chunkSize: number,
  method: string,
  headers?: Record<string, string>,
  setUpload?: SetUpload,
): Promise<Error | undefined> {
  const totalChunks = Math.ceil(file.size / chunkSize)
  let uploadedBytes = 0

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    try {
      const xhr = new XMLHttpRequest()

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && setUpload) {
            const chunkProgress = uploadedBytes + e.loaded
            const progress = (chunkProgress / file.size) * 100
            setUpload("progress", progress)
            setUpload("speed", 0) // Speed calculation not implemented
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            uploadedBytes += chunk.size
            resolve()
          } else {
            reject(
              new Error(
                `Upload chunk ${i + 1} failed with status ${xhr.status}`,
              ),
            )
          }
        })

        xhr.addEventListener("error", () => {
          reject(new Error(`Upload chunk ${i + 1} failed`))
        })

        xhr.open(method, uploadURL)

        // Set Content-Range header for chunked upload
        xhr.setRequestHeader(
          "Content-Range",
          `bytes ${start}-${end - 1}/${file.size}`,
        )

        // Set custom headers if provided
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value)
          })
        }

        xhr.send(chunk)
      })
    } catch (error: any) {
      return error
    }
  }

  return undefined
}
