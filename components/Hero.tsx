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

export default function Hero() {
  const t = useTranslate();
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
            <Button
              rounded={"full"}
              bg={"red.400"}
              color={"white"}
              _hover={{
                bg: "red.500",
              }}
            >
              {t.start}
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"Image"} objectFit={"cover"} src={"/images/hero.png"} />
      </Flex>
    </Stack>
  );
}
