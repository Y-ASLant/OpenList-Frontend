import { Resp } from "~/types"
import { bus, notify } from "."
import { translateError } from "./translate_error"

export const handleResp = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code: number) => void,
  auth: boolean = true,
  notify_error: boolean = true,
  notify_success?: boolean,
) => {
  if (resp.code === 200) {
    notify_success && notify.success(resp.message)
    success?.(resp.data)
  } else {
    const translatedMessage = translateError(resp.message)
    notify_error && notify.error(translatedMessage)
    if (auth && resp.code === 401) {
      if (location.pathname === "/@manage") {
        bus.emit("to", "/")
      } else {
        bus.emit(
          "to",
          `/@login?redirect=${encodeURIComponent(location.pathname)}`,
        )
      }
      return
    }
    fail?.(translatedMessage, resp.code)
  }
}

export const handleRespWithoutAuth = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  notify_error: boolean = true,
) => {
  return handleResp(resp, success, fail, false, notify_error)
}

export const handleRespWithoutNotify = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  auth: boolean = true,
) => {
  return handleResp(resp, success, fail, auth, false)
}

export const handleRespWithoutAuthAndNotify = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
) => {
  return handleResp(resp, success, fail, false, false)
}

export const handleRespWithNotifySuccess = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  auth: boolean = true,
  notify_error: boolean = true,
) => {
  return handleResp(resp, success, fail, auth, notify_error, true)
}
