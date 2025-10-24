import { objStore } from "~/store"
import { FormUpload } from "./form"
import { StreamUpload } from "./stream"
import { DirectUpload } from "./direct"
import { Upload } from "./types"
import { r } from "~/utils"

type Uploader = {
  upload: Upload
  name: string
  provider: RegExp
}

const AllUploads: Uploader[] = [
  {
    name: "Stream",
    upload: StreamUpload,
    provider: /.*/,
  },
  {
    name: "Form",
    upload: FormUpload,
    provider: /.*/,
  },
  {
    name: "Direct",
    upload: DirectUpload,
    provider: /.*/,
  },
]

let directUploadEnabled = false
let lastCheckedPath = ""

export const checkDirectUpload = async (path: string): Promise<boolean> => {
  try {
    const resp: any = await r.get("/fs/check_direct_upload", {
      params: { path },
    })
    if (resp.code === 200) {
      directUploadEnabled = resp.data.enabled
      lastCheckedPath = path
      return directUploadEnabled
    }
  } catch (error) {
    console.error("Failed to check direct upload:", error)
  }
  return false
}

export const getUploads = async (
  currentPath?: string,
): Promise<Pick<Uploader, "name" | "upload">[]> => {
  // Check if direct upload is enabled for current path
  if (currentPath && currentPath !== lastCheckedPath) {
    await checkDirectUpload(currentPath)
  }

  // If direct upload is enabled, only show Direct option
  if (directUploadEnabled) {
    return AllUploads.filter((u) => u.name === "Direct")
  }

  // Otherwise show Stream and Form
  return AllUploads.filter(
    (u) => u.name !== "Direct" && u.provider.test(objStore.provider),
  )
}
