import { objStore } from "~/store"
import { FormUpload } from "./form"
import { StreamUpload } from "./stream"
import { DirectUpload } from "./direct"
import { Upload } from "./types"

export type Uploader = {
  upload: Upload
  name: string
  provider: RegExp
}

// All upload methods
const AllUploads: Uploader[] = [
  {
    name: "Direct",
    upload: DirectUpload,
    provider: /.*/,
  },
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
]

export const getUploads = (): Pick<Uploader, "name" | "upload">[] => {
  return AllUploads.filter((u) => {
    // Filter Direct upload based on backend configuration
    if (u.name === "Direct" && !objStore.direct_upload_enabled) {
      return false
    }
    return u.provider.test(objStore.provider)
  })
}
