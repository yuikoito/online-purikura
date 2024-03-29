import {
  Center,
  Icon,
  VisuallyHidden,
  Grid,
  Box,
  Image,
  Flex,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  Radio,
} from "@chakra-ui/react";
import Hero from "../components/Hero";
import Tite from "../components/Title";
import Footer from "../components/Footer";
import CommonButton from "../components/CommonButton";
import { FiUploadCloud, FiDownloadCloud } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineChangeCircle } from "react-icons/md";
import useTranlate from "../hooks/useTranslate";
import { useState, useRef, useEffect } from "react";
import resizeImage from "../libs/resizeImage";
import useMove from "../hooks/useMove";
// import { fabric } from "fabric";
import { SketchPicker } from "react-color";
import axios from "axios";

export default function Home() {
  const brushType =
    "PatternBrush" || "SprayBrush" || "PencilBrush" || "CircleBrush";
  const effects = [1, 2, 3, 4, 5, 6];
  const stamps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const t = useTranlate();
  const [images, setImages] = useState<string[]>([]);
  const [base64array, setBase64array] = useState<string[]>([]);
  const [background, setBackground] = useState<number>(1);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>();
  const [changedImage, setChangedImage] = useState<string>();
  const [brushT, setBrushT] = useState<string>("PencilBrush");
  const [color, setColor] = useState<string>("#000");
  const [width, setWidth] = useState<number>(20);
  const { move } = useMove("selectPhoto");
  const [playType, setPlayType] = useState<"painting" | "stamp">("painting");
  const [isLoad, setIsLoad] = useState<boolean>(false);

  // const setBrush = (
  //   canvas: fabric.Canvas,
  //   color: string,
  //   width: number,
  //   type: string
  // ) => {
  //   canvas.freeDrawingBrush = new fabric[type](canvas);
  //   if (canvas.freeDrawingBrush) {
  //     const brush = canvas.freeDrawingBrush;
  //     brush.color = color;
  //     if (brush.getPatternSrc) {
  //       brush.source = brush.getPatternSrc.call(brush);
  //     }
  //     brush.width = width;
  //     brush.shadow = new fabric.Shadow({
  //       blur: 3,
  //       offsetX: 0,
  //       offsetY: 0,
  //       affectStroke: true,
  //       color: "white",
  //     });
  //   }
  // };

  // const setBackgroundImage = (canvas: fabric.Canvas, changedImage: string) => {
  //   fabric.Image.fromURL(changedImage, (img) => {
  //     img.set({
  //       opacity: 1,
  //       scaleX: canvas.width / img.width,
  //       scaleY: canvas.height / img.height,
  //     });
  //     canvas.setBackgroundImage(img, canvas.requestRenderAll.bind(canvas));
  //   });
  // };

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
    move();
  };
  const changeImage = async () => {
    setIsLoad(true);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT,
      JSON.stringify({
        image: base64array,
        style: background,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setIsLoad(false);
    setChangedImage(`data:image/png;base64,${response.data.image}`);
    // setBackgroundImage(
    //   fabricCanvas,
    //   `data:image/png;base64,${response.data.image}`
    // );
    // setBackgroundImage(fabricCanvas, "/a.jpeg");
  };

  useEffect(() => {
    // const canvas = new fabric.Canvas("canvas", {
    //   isDrawingMode: true, // 手書き入力ON
    // });
    // setFabricCanvas(canvas);
    // setBrush(canvas, "#000", 20, "PencilBrush");
  }, []);

  const onSaveClick = () => {
    // if (!fabricCanvas) return;
    const link = document.createElement("a");
    // const dataurl = fabricCanvas.toDataURL();
    // link.href = dataurl;
    // link.download = "purikura-" + new Date().getTime() + ".jpg";
    // link.click();
  };

  const onHandleColorChange = (c: string) => {
    setColor(c);
    // setBrush(fabricCanvas, c, width, brushT);
  };

  const onHandleWidthChange = (w: number) => {
    setWidth(w);
    // setBrush(fabricCanvas, color, w, brushT);
  };

  const onHandleTypeChange = (t: string) => {
    setBrushT(t);
    // setBrush(fabricCanvas, color, width, t);
  };

  const selectPainting = () => {
    // fabricCanvas.isDrawingMode = true;
    setPlayType("painting");
  };

  const selectStamp = () => {
    // fabricCanvas.isDrawingMode = false;
    setPlayType("stamp");
  };

  // const selectStampHandler = (stamp: number) => {
  //   fabric.Image.fromURL(`/stamps/${stamp}.png`, (img) => {
  //     fabricCanvas.add(img);
  //   });
  // };

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
        <Tite id={"selectPhoto"}>{t.selectPhoto}</Tite>
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
            {images.length ? (
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
            <Box w={"500px"}>
              <Image src={"/images/hero.png"} alt={`default_image`} />
            </Box>
          ) : (
            <Grid templateColumns="repeat(3, 1fr)" gap={3} w={"500px"}>
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

      {!changedImage && (
        <Center>
          <Text my={"3"} color={"gray.500"}>
            先に画像を作成してください
          </Text>
        </Center>
      )}
      <Center>
        <Flex mt={10} maxW={"5xl"}>
          <Box as={"div"}>
            <canvas id="canvas" ref={canvasRef} width="600" height="420" />
          </Box>
          <Box w={"300px"} ml={10}>
            <Stack spacing={10} direction="row" mb={6}>
              <Radio
                colorScheme="red"
                value="painting"
                isChecked={playType === "painting"}
                onClick={selectPainting}
              >
                落書き
              </Radio>
              <Radio
                colorScheme="red"
                value="stamp"
                isChecked={playType === "stamp"}
                onClick={selectStamp}
              >
                スタンプ
              </Radio>
            </Stack>
            {playType === "painting" && (
              <>
                <SketchPicker
                  color={color}
                  onChangeComplete={(e) => onHandleColorChange(e.hex)}
                />
                <Image
                  mt={"5"}
                  src={`/brushes/${brushT}.png`}
                  alt={"brush"}
                  w={"200px"}
                />
                <Select
                  maxW="250px"
                  borderColor="red.400"
                  onChange={(e) => onHandleTypeChange(e.currentTarget.value)}
                  focusBorderColor="red.400"
                >
                  <option value="PencilBrush">{"PencilBrush"}</option>
                  <option value="SprayBrush">{"SprayBrush"}</option>
                  <option value="PatternBrush">{"PatternBrush"}</option>
                  <option value="CircleBrush">{"CircleBrush"}</option>
                </Select>
                <Slider
                  aria-label="slider-ex-4"
                  defaultValue={width}
                  min={1}
                  max={50}
                  my={3}
                  onChange={(e) => onHandleWidthChange(e)}
                >
                  <SliderTrack bg="red.100">
                    <SliderFilledTrack bg="red.400" />
                  </SliderTrack>
                  <SliderThumb boxSize={10} bg={"red.400"}>
                    <Box color="white" as={FaPencilAlt} />
                  </SliderThumb>
                </Slider>
              </>
            )}
            {/* {playType === "stamp" && (
              <Grid templateColumns="repeat(3, 1fr)" gap={3} w={"100%"}>
                {stamps.map((stamp, index) => {
                  return (
                    <Image
                      src={`/stamps/${stamp}.png`}
                      key={index}
                      alt={`${index}_image`}
                      onClick={() => selectStampHandler(stamp)}
                      cursor={"pointer"}
                    />
                  );
                })}
              </Grid>
            )} */}
            <CommonButton
              leftIcon={<Icon as={FiDownloadCloud} />}
              onClick={onSaveClick}
              full
            >
              {t.save}
            </CommonButton>
            {playType === "stamp" && (
              <Center mt={5}>
                <Image src={"/gomi.png"} alt={"gomi"} />
              </Center>
            )}
          </Box>
        </Flex>
      </Center>
      <Footer />
    </>
  );
}
