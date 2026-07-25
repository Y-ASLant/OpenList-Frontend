import { Box, useColorModeValue } from "@hope-ui/solid"

const LoginBg = () => {
  const bgColor = useColorModeValue("#a9c6ff", "#062b74")
  return (
    <Box
      bgColor={bgColor()}
      pos="fixed"
      top="0"
      left="0"
      overflow="hidden"
      zIndex="-1"
      w="100vw"
      h="100vh"
    >
      {/* 大气泡 - 右上角 */}
      <Box
        pos="absolute"
        right="-100px"
        top="-100px"
        w="500px"
        h="500px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 70%)"
      />
      {/* 大气泡 - 左下角 */}
      <Box
        pos="absolute"
        left="-150px"
        bottom="-150px"
        w="600px"
        h="600px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 70%)"
      />
      {/* 中等气泡 */}
      <Box
        pos="absolute"
        right="10%"
        top="15%"
        w="200px"
        h="200px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 70%)"
      />
      <Box
        pos="absolute"
        left="15%"
        top="30%"
        w="150px"
        h="150px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 70%)"
      />
      {/* 小气泡群 */}
      <Box
        pos="absolute"
        right="25%"
        bottom="25%"
        w="100px"
        h="100px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 70%)"
      />
      <Box
        pos="absolute"
        left="30%"
        bottom="35%"
        w="80px"
        h="80px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 70%)"
      />
      <Box
        pos="absolute"
        right="40%"
        top="40%"
        w="60px"
        h="60px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 70%)"
      />
    </Box>
  )
}

export default LoginBg
