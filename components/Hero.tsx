import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import useTranslate from "../hooks/useTranslate";
import CommonButton from "./CommonButton";
import smoothscroll from "smoothscroll-polyfill";

export default function Hero() {
  const t = useTranslate();
  const move = () => {
    const elm = document.getElementById("start");
    const content_position = elm.getBoundingClientRect();
    const elemtop = content_position.top + window.pageYOffset;
    smoothscroll.polyfill();
    window.scroll({ top: elemtop, behavior: "smooth" });
  };
  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      bgColor={"red.100"}
    >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "blue.400",
                zIndex: -1,
              }}
            >
              {t.title}
            </Text>
            <br />
            <Text
              color={"red.400"}
              as={"span"}
              fontSize={{ base: "xl", md: "2xl" }}
            >
              {t.subTitle}
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            {t.description}
          </Text>
          <Stack direction={{ base: "column", md: "row" }}>
            <CommonButton onClick={move}> {t.start}</CommonButton>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"Image"} objectFit={"cover"} src={"/images/hero.png"} />
      </Flex>
    </Stack>
  );
}
