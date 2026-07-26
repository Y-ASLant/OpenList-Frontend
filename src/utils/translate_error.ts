import { dict, i18n } from "~/app/i18n"
import { untrack } from "solid-js"

// 错误消息映射表：将后端英文错误消息映射到翻译键（全部小写）
const errorMessageMap: Record<string, string> = {
  // storage
  "storage not found": "errors.storage_not_found",
  "storage not init": "errors.storage_not_init",
  "please add a storage first": "errors.please_add_storage",
  // object
  "object not found": "errors.object_not_found",
  "object already exists": "errors.object_already_exists",
  // permission
  "permission denied": "errors.permission_denied",
  // user
  "password is empty": "errors.password_empty",
  "password is incorrect": "errors.password_incorrect",
  "wrong password": "errors.password_incorrect",
  // meta
  "meta not found": "errors.meta_not_found",
  // share
  "the share does not exist": "errors.share_not_exist",
  "the share has expired or is no longer valid": "errors.share_expired",
  // archive
  "wrong archive password": "errors.wrong_archive_password",
  // file
  "file exists": "errors.file_exists",
  "failed to mkdir": "errors.failed_to_mkdir",
}

// 子串匹配：用于复合错误消息（如 "failed get storage: storage not found; ...")
const substringMatchers: [RegExp, string][] = [
  [/storage not found/i, "errors.storage_not_found"],
  [/please add a storage first/i, "errors.please_add_storage"],
  [/object not found/i, "errors.object_not_found"],
  [/object already exists/i, "errors.object_already_exists"],
  [/permission denied/i, "errors.permission_denied"],
  [/password is (empty|incorrect)/i, "errors.password_incorrect"],
  [/wrong password/i, "errors.password_incorrect"],
  [/the share does not exist/i, "errors.share_not_exist"],
  [/the share has expired/i, "errors.share_expired"],
  [/wrong archive password/i, "errors.wrong_archive_password"],
]

/**
 * 翻译后端返回的错误消息
 * 后端返回的是英文错误消息，根据当前语言翻译
 */
export const translateError = (message: string): string => {
  if (!message) return message

  // 1. 精确匹配（小写）
  const lowerMessage = message.toLowerCase().trim()
  const exactKey = errorMessageMap[lowerMessage]
  if (exactKey) return tryTranslate(exactKey, message)

  // 2. 子串匹配（处理复合错误消息）
  for (const [pattern, key] of substringMatchers) {
    if (pattern.test(message)) return tryTranslate(key, message)
  }

  // 3. 无匹配，返回原文
  return message
}

function tryTranslate(key: string, fallback: string): string {
  return untrack(() => {
    const currentDict = dict()
    if (currentDict) {
      const translator = i18n.translator(() => currentDict)
      const translated = translator(key)
      if (typeof translated === "string" && translated !== key) {
        return translated
      }
    }
    return fallback
  })
}
