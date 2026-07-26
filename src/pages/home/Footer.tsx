import { Anchor, HStack, VStack } from "@hope-ui/solid"
import { Show, onMount } from "solid-js"
import { getSetting } from "~/store"

const VERCOUNT_SCRIPT = "https://events.vercount.one/js"

export const Footer = () => {
  onMount(() => {
    if (document.querySelector(`script[src="${VERCOUNT_SCRIPT}"]`)) return
    const script = document.createElement("script")
    script.src = VERCOUNT_SCRIPT
    script.defer = true
    document.body.appendChild(script)
  })

  return (
    <VStack
      class="footer"
      w="$full"
      py="$4"
      fontSize="$base"
      color="$neutral11"
    >
      <HStack spacing="$1">
        <span>
          本站总访问量:<span id="vercount_value_site_pv">-</span>次
        </span>
        <Show when={getSetting("site_icp")}>
          <span>|</span>
          <Anchor
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {getSetting("site_icp")}
          </Anchor>
        </Show>
      </HStack>
    </VStack>
  )
}
