import {
  Center,
  Icon,
  VisuallyHidden,
  Grid,
  Box,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import Hero from "../components/Hero";
import Tite from "../components/Title";
import CommonButton from "../components/CommonButton";
import { FiUploadCloud } from "react-icons/fi";
import { MdOutlineChangeCircle } from "react-icons/md";
import useTranlate from "../hooks/useTranslate";
import { useState, useRef } from "react";
import resizeImage from "../libs/resizeImage";

export default function Home() {
  const effects = [1, 2, 3, 4, 5, 6];
  const t = useTranlate();
  const [images, setImages] = useState<string[]>([]);
  const [base64array, setBase64array] = useState<string[]>([]);
  const [background, setBackground] = useState<number>(1);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [changedImage, setChangedImage] = useState<string>();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const imageFile = e.target.files[i];
      const imageUrl = URL.createObjectURL(imageFile);
      const concatPhotos = images.concat(imageUrl);
      setImages(concatPhotos);
      let imgToBase64 = await resizeImage(imageFile, 800, 800);
      imgToBase64 = imgToBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      const concatBase64s = base64array.concat(imgToBase64);
      setBase64array(concatBase64s);
    }
  };
  const uploadImage = () => {
    inputImageRef.current.click();
  };
  const selectBackground = (id: number) => {
    setBackground(id);
  };
  const changeImage = () => {
    console.log(background, base64array);
  };

  return (
    <>
      <Hero />
      <Center>
        <Tite id={"start"}>{t.selectBackground}</Tite>
      </Center>
      <Center>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} maxW={"5xl"}>
          {effects.map((effect, index) => {
            return (
              <Box
                key={index}
                borderRadius={"xl"}
                borderWidth={background === effect ? "5px" : "none"}
                borderColor={"red.200"}
              >
                <Image
                  src={`/backgrounds/${effect}.png`}
                  alt={`${effect}_image`}
                  borderRadius={"lg"}
                  _hover={{ opacity: 0.8, cursor: "pointer" }}
                  onClick={() => selectBackground(effect)}
                />
              </Box>
            );
          })}
        </Grid>
      </Center>
      <Center>
        <Tite>{t.selectPhoto}</Tite>
      </Center>
      <Center>
        <Flex mt={10} maxW={"5xl"} justifyContent={"space-between"}>
          <Box w={"40%"}>
            <Text fontSize={{ base: "2xl", lg: "3xl" }}>
              {t.selectPhotoFromLibrary}
            </Text>
            <Text my={"3"} color={"gray.500"}>
              {t.max3photos}
            </Text>
            <CommonButton
              leftIcon={<Icon as={FiUploadCloud} />}
              onClick={uploadImage}
            >
              {t.uploadPicture}
              <VisuallyHidden>
                <input
                  name="picture"
                  type="file"
                  ref={inputImageRef}
                  multiple
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFile(e)}
                />
              </VisuallyHidden>
            </CommonButton>
            <Text fontSize={{ base: "2xl", lg: "3xl" }} my={"3"}>
              {t.changeImage}
            </Text>
            {changedImage ? (
              <CommonButton
                leftIcon={<Icon as={MdOutlineChangeCircle} />}
                onClick={changeImage}
              >
                {t.changeImage}
              </CommonButton>
            ) : (
              <Text my={"3"} color={"gray.500"}>
                {t.selectPhotoFirst}
              </Text>
            )}
          </Box>
          {images.length === 0 ? (
            <Box w={"50%"}>
              <Image src={"/images/hero.png"} alt={`default_image`} />
            </Box>
          ) : (
            <Grid templateColumns="repeat(3, 1fr)" gap={6} w={"60%"}>
              {images.map((image, index) => {
                return <Image src={image} key={index} alt={`${index}_image`} />;
              })}
            </Grid>
          )}
        </Flex>
      </Center>
      <Center>
        <Tite>{t.addPaint}</Tite>
      </Center>
      <Center>
        <Flex mt={10} maxW={"5xl"} justifyContent={"space-between"}>
          <Box w={"60%"}>
            <canvas></canvas>
          </Box>
        </Flex>
      </Center>
    </>
  );
}
