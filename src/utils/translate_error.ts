import { dict, i18n } from "~/app/i18n"
import { untrack } from "solid-js"

// 错误消息映射表：将后端英文错误消息映射到翻译键（全部小写）
const errorMessageMap: Record<string, string> = {
  "the share does not exist": "shares.errors.does_not_exist",
  "the share has expired or is no longer valid":
    "shares.errors.expired_or_invalid",
}

/**
 * 翻译后端返回的错误消息
 * 后端返回的是英文错误消息，根据当前语言翻译
 * 刷新页面后生效
 */
export const translateError = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  const key = errorMessageMap[lowerMessage]

  if (!key) {
    return message
  }

  // 使用 untrack 避免创建响应式依赖
  return untrack(() => {
    const currentDict = dict()
    if (currentDict) {
      const translator = i18n.translator(() => currentDict)
      const translated = translator(key)
      if (typeof translated === "string") {
        return translated
      }
    }
    return message
  })
}
