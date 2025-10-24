import { Anchor, HStack, VStack } from "@hope-ui/solid"
import { onMount } from "solid-js"

export const Footer = () => {
  onMount(() => {
    // 动态加载不蒜子统计脚本
    const script = document.createElement("script")
    script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
    script.async = true
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
        <span id="busuanzi_container_site_pv">
          本站总访问量:2<span id="busuanzi_value_site_pv"></span>次
        </span>
        <span>|</span>
        <Anchor
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          鲁ICP备2023044278号
        </Anchor>
      </HStack>
    </VStack>
  )
}
