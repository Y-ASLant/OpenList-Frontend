import { dict, i18n } from "~/app/i18n"
import { untrack } from "solid-js"

/**
 * 将 OpenList 后端英文错误消息映射到 i18n 键。
 * 来源：E:\Code_Repository\OpenList
 *   - internal/model/user.go
 *   - internal/errs/*.go
 *   - server/handles/*.go（ErrorStrResp 常用文案）
 */
const errorMessageMap: Record<string, string> = {
  // internal/errs
  "storage not found": "errors.storage_not_found",
  "storage not init": "errors.storage_not_init",
  "please add a storage first": "errors.please_add_storage",
  "object not found": "errors.object_not_found",
  "object already exists": "errors.object_already_exists",
  "meta not found": "errors.meta_not_found",
  "wrong archive password": "errors.wrong_archive_password",
  "wrong share code": "errors.wrong_share_code",
  "invalid sharing": "errors.invalid_sharing",
  "sharing not found": "errors.sharing_not_found",
  "system file upload ignored": "errors.system_file_ignored",
  // permission
  "permission denied": "errors.permission_denied",
  "password is incorrect or you have no permission":
    "errors.password_or_permission",
  "refresh without permission": "errors.refresh_without_permission",
  // internal/model/user.go — auth
  "invalid username or password": "errors.invalid_credentials",
  "invalid 2fa code": "errors.invalid_2fa",
  "too many unsuccessful sign-in attempts have been made using an incorrect username or password, try again later.":
    "errors.too_many_attempts",
  "guest user can not update profile": "errors.guest_cannot_update_profile",
  "guest user can not generate 2fa code": "errors.guest_cannot_generate_2fa",
  "guest user is disabled, login please": "errors.guest_disabled",
  "password has been changed, login please": "errors.password_changed",
  "current user is disabled, replace please": "errors.user_disabled_relogin",
  "you are a guest": "errors.you_are_guest",
  "you are not an admin": "errors.not_admin",
  "ldap is not enabled": "errors.ldap_not_enabled",
  "login via ldap is not allowed": "errors.ldap_login_not_allowed",
  // share (handles/sharing.go)
  "the share does not exist": "errors.share_not_exist",
  "the share has expired or is no longer valid": "errors.share_expired",
  "invalid share id": "errors.invalid_share_id",
  // file / upload
  "file exists": "errors.file_exists",
  "current storage doesn't support upload": "errors.upload_not_supported",
  // task
  "task not found": "errors.task_not_found",
  "user invalid": "errors.user_invalid",
  // index
  "index is running": "errors.index_running",
  "index is not running": "errors.index_not_running",
  // legacy / alias
  "password is empty": "errors.password_empty",
  "password is incorrect": "errors.password_incorrect",
  "wrong password": "errors.password_incorrect",
}

const substringMatchers: [RegExp, string][] = [
  [/storage not found/i, "errors.storage_not_found"],
  [/storage not init/i, "errors.storage_not_init"],
  [/please add a storage first/i, "errors.please_add_storage"],
  [/object not found/i, "errors.object_not_found"],
  [/object already exists/i, "errors.object_already_exists"],
  [/permission denied/i, "errors.permission_denied"],
  [
    /password is incorrect or you have no permission/i,
    "errors.password_or_permission",
  ],
  [/refresh without permission/i, "errors.refresh_without_permission"],
  [/invalid username or password/i, "errors.invalid_credentials"],
  [/invalid 2fa code/i, "errors.invalid_2fa"],
  [/too many unsuccessful sign-in attempts/i, "errors.too_many_attempts"],
  [/guest user is disabled/i, "errors.guest_disabled"],
  [/password has been changed/i, "errors.password_changed"],
  [/current user is disabled/i, "errors.user_disabled_relogin"],
  [/the share does not exist/i, "errors.share_not_exist"],
  [/the share has expired/i, "errors.share_expired"],
  [/sharing not found/i, "errors.sharing_not_found"],
  [/wrong archive password/i, "errors.wrong_archive_password"],
  [/wrong share code/i, "errors.wrong_share_code"],
  [/file \[[^\]]+\] exists/i, "errors.file_exists"],
  [/^file exists$/i, "errors.file_exists"],
  [/task not found/i, "errors.task_not_found"],
  [/meta not found/i, "errors.meta_not_found"],
]

export const translateError = (message: string): string => {
  if (!message) return message

  const lowerMessage = message.toLowerCase().trim()
  const exactKey = errorMessageMap[lowerMessage]
  if (exactKey) return tryTranslate(exactKey, message)

  for (const [pattern, key] of substringMatchers) {
    if (pattern.test(message)) return tryTranslate(key, message)
  }

  return message
}

function tryTranslate(key: string, fallback: string): string {
  return untrack(() => {
    const currentDict = dict()
    if (currentDict) {
      const translator = i18n.translator(() => currentDict)
      const i18nKey = key.startsWith("global.") ? key : `global.${key}`
      const translated = translator(i18nKey)
      if (typeof translated === "string" && translated !== i18nKey) {
        return translated
      }
    }
    return fallback
  })
}
