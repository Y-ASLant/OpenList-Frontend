import {
  Center,
  createDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  VStack,
  Switch as HopeSwitch,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@hope-ui/solid"
import { For, Match, onCleanup, Switch } from "solid-js"
import { FaSolidMinus, FaSolidPlus } from "solid-icons/fa"
import { IoLanguageOutline } from "solid-icons/io"
import { FiSun, FiMoon } from "solid-icons/fi"
import { SwitchLanguage } from "~/components"
import { useT } from "~/hooks"
import { initialLocalSettings, local, LocalSetting, setLocal } from "~/store"
import { bus } from "~/utils"

function LocalSettingEdit(props: LocalSetting) {
  const t = useT()
  return (
    <FormControl>
      <FormLabel>{t(`home.local_settings.${props.key}`)}</FormLabel>
      <Switch
        fallback={
          <Input
            value={local[props.key]}
            onInput={(e) => {
              setLocal(props.key, e.currentTarget.value)
            }}
          />
        }
      >
        <Match when={props.type === "select"}>
          <Select
            id={props.key}
            defaultValue={local[props.key]}
            onChange={(v) => setLocal(props.key, v)}
          >
            <SelectTrigger>
              <SelectPlaceholder>{t("global.choose")}</SelectPlaceholder>
              <SelectValue />
              <SelectIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectListbox>
                <For each={props.options}>
                  {(item) => (
                    <SelectOption value={item}>
                      <SelectOptionText>
                        {t(`home.local_settings.${props.key}_options.${item}`)}
                      </SelectOptionText>
                      <SelectOptionIndicator />
                    </SelectOption>
                  )}
                </For>
              </SelectListbox>
            </SelectContent>
          </Select>
        </Match>
        <Match when={props.type === "boolean"}>
          <HopeSwitch
            defaultChecked={local[props.key] === "true"}
            onChange={(e: { currentTarget: HTMLInputElement }) => {
              setLocal(props.key, e.currentTarget.checked.toString())
            }}
          />
        </Match>
        <Match when={props.type === "number"}>
          <HStack>
            <IconButton
              aria-label="decrease"
              icon={<FaSolidMinus />}
              onClick={() => {
                setLocal(
                  props.key,
                  Math.max(1, parseInt(local[props.key]) - 1).toString(),
                )
              }}
            />
            <Input
              type="number"
              value={local[props.key]}
              onInput={(e) => {
                setLocal(props.key, e.currentTarget.value)
              }}
              style={{
                "-moz-appearance": "textfield",
                "::-webkit-inner-spin-button": { display: "none" },
                "::-webkit-outer-spin-button": { display: "none" },
              }}
              class="hide-spin"
            />
            <IconButton
              aria-label="increase"
              icon={<FaSolidPlus />}
              onClick={() => {
                setLocal(props.key, (parseInt(local[props.key]) + 1).toString())
              }}
            />
          </HStack>
        </Match>
      </Switch>
    </FormControl>
  )
}

export const LocalSettings = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const t = useT()
  const { toggleColorMode } = useColorMode()
  const colorModeIcon = useColorModeValue(FiMoon, FiSun)

  const handler = (name: string) => {
    if (name === "local_settings") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <Drawer opened={isOpen()} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <HStack
          position="absolute"
          top="$3"
          right="$3"
          spacing="$2"
          zIndex="$docked"
        >
          <SwitchLanguage
            as={IconButton}
            aria-label="switch language"
            icon={<Icon as={IoLanguageOutline} boxSize="$5" />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            aria-label="toggle color mode"
            icon={<Icon as={colorModeIcon()} boxSize="$5" />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
          <DrawerCloseButton position="relative" top="0" right="0" />
        </HStack>
        <DrawerHeader
          color="$info9"
          display="flex"
          alignItems="center"
          minH="$12"
        >
          {t("home.toolbar.local_settings")}
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing="$2">
            <For each={initialLocalSettings.filter((s) => !s.hidden)}>
              {(setting) => <LocalSettingEdit {...setting} />}
            </For>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
