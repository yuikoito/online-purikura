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
} from "@chakra-ui/react";
import Hero from "../components/Hero";
import Tite from "../components/Title";
import CommonButton from "../components/CommonButton";
import { FiUploadCloud, FiDownloadCloud } from "react-icons/fi";
import { MdOutlineChangeCircle } from "react-icons/md";
import useTranlate from "../hooks/useTranslate";
import { useState, useRef, useEffect } from "react";
import resizeImage from "../libs/resizeImage";
import useMove from "../hooks/useMove";
import { fabric } from "fabric";
import { SketchPicker } from "react-color";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";

export default function Home() {
  const brushType =
    "PatternBrush" || "SprayBrush" || "PencilBrush" || "CircleBrush";
  const effects = [1, 2, 3, 4, 5, 6];
  const t = useTranlate();
  const [images, setImages] = useState<string[]>([]);
  const [base64array, setBase64array] = useState<string[]>([]);
  const [background, setBackground] = useState<number>(1);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>();
  const [changedImage, setChangedImage] = useState<string>();
  const [brushT, setBrushT] = useState<string>("PencilBrush");
  const [color, setColor] = useState<string>("#000");
  const [width, setWidth] = useState<number>(20);

  const { move } = useMove("selectPhoto");

  const setBrush = (
    canvas: fabric.Canvas,
    color: string,
    width: number,
    type: string
  ) => {
    canvas.freeDrawingBrush = new fabric[type](canvas);
    if (canvas.freeDrawingBrush) {
      const brush = canvas.freeDrawingBrush;
      brush.color = color;
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
      }
      brush.width = width;
      brush.shadow = new fabric.Shadow({
        blur: 3,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: "white",
      });
    }
  };

  const setBackgroundImage = (canvas: fabric.Canvas) => {
    fabric.Image.fromURL("/images/hero.png", (img) => {
      img.set({
        opacity: 1,
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      });
      canvas.setBackgroundImage(img, canvas.requestRenderAll.bind(canvas));
    });
  };

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
  const changeImage = () => {
    console.log(background, base64array);
  };

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      isDrawingMode: true, // 手書き入力ON
    });
    setFabricCanvas(canvas);
    // canvas.isDrawingMode = false
    // var rect = new fabric.Rect({
    //   top: 100,
    //   left: 100,
    //   width: 60,
    //   height: 70,
    //   fill: "red",
    // });

    // canvas.add(rect);
    setBrush(canvas, "#000", 20, "PencilBrush");
    setBackgroundImage(canvas);
  }, [changedImage]);

  const onSaveClick = () => {
    if (!fabricCanvas) return;
    const link = document.createElement("a");
    const dataurl = fabricCanvas.toDataURL();
    link.href = dataurl;
    link.download = "purikura-" + new Date().getTime() + ".jpg";
    link.click();
  };

  const onHandleColorChange = (c: string) => {
    setColor(c);
    setBrush(fabricCanvas, c, width, brushT);
  };

  const onHandleWidthChange = (w: number) => {
    setWidth(w);
    setBrush(fabricCanvas, color, w, brushT);
  };

  const onHandleTypeChange = (t: string) => {
    setBrushT(t);
    setBrush(fabricCanvas, color, width, t);
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
        <Flex mt={10}>
          <Box as={"div"}>
            <canvas id="canvas" ref={canvasRef} width="600" height="600" />
          </Box>
          <Box>
            <SketchPicker
              color={color}
              onChangeComplete={(e) => onHandleColorChange(e.hex)}
            />
            <Select
              maxW="250px"
              borderColor="tomato"
              onChange={(e) => onHandleTypeChange(e.currentTarget.value)}
              focusBorderColor="tomato"
            >
              <option value="PencilBrush">{"PencilBrush"}</option>
              <option value="SprayBrush">{"SprayBrush"}</option>
              <option value="PatternBrush">{"PatternBrush"}</option>
              <option value="CircleBrush">{"CircleBrush"}</option>
            </Select>
            <CommonButton
              leftIcon={<Icon as={FiDownloadCloud} />}
              onClick={onSaveClick}
            >
              {t.save}
            </CommonButton>
          </Box>
        </Flex>
      </Center>
    </>
  );
}
