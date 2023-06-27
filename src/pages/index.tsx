import AxiosConfig from "@/configurations/axios.config";
import { useEffect, useState } from "react";

export default function Home() {
  const [originalImage, setOriginalImage] = useState("");
  const [resultTsv, setResultTsv] = useState("");
  const [resultText, setResultText] = useState("");
  const [threshold, setThreshold] = useState(127);
  // const [resultWords, setResultWords] = useState([]);

  useEffect(() => {
    const originalImageCanvas = document.getElementById(
      "original-image-canvas"
    ) as HTMLCanvasElement;
    if (!originalImageCanvas) {
      return;
    }
    const originalImageCanvasContext = originalImageCanvas.getContext("2d");
    const originalImageObject = new Image();
    originalImageObject.src = originalImage;
    originalImageObject.onload = () => {
      originalImageCanvas.width = originalImageObject.width;
      originalImageCanvas.height = originalImageObject.height;
      if (originalImageCanvasContext && originalImageObject) {
        originalImageCanvasContext.drawImage(
          originalImageObject,
          0,
          0,
          originalImageObject.width,
          originalImageObject.height
        );
      }

      const binarizedImageCanvas = document.getElementById(
        "binarized-image-canvas"
      ) as HTMLCanvasElement;
      if (!binarizedImageCanvas) {
        return;
      }
      binarizedImageCanvas.width = originalImageObject.width;
      binarizedImageCanvas.height = originalImageObject.height;
      const binarizedImageCanvasContext = binarizedImageCanvas.getContext("2d");
      if (!binarizedImageCanvasContext) {
        return;
      }
      const binarizedImage = binarizedImageCanvasContext.createImageData(
        originalImageObject.width,
        originalImageObject.height
      );
      if (originalImageCanvasContext) {
        const imageData = originalImageCanvasContext.getImageData(
          0,
          0,
          originalImageObject.width,
          originalImageObject.height
        );
        for (let i = 0; i < originalImageObject.height; i++) {
          for (let j = 0; j < originalImageObject.width; j++) {
            const pos = 4 * (i * originalImageObject.width + j);

            const red = imageData.data[pos];
            const green = imageData.data[pos + 1];
            const blue = imageData.data[pos + 2];
            const alpha = imageData.data[pos + 3];

            const lightness = 0.299 * red + 0.587 * green + 0.144 * blue;

            // binarizedImage.data[pos] = lightness;
            // binarizedImage.data[pos + 1] = lightness;
            // binarizedImage.data[pos + 2] = lightness;
            // binarizedImage.data[pos + 3] = imageData.data[pos + 3];
            if (lightness > threshold) {
              binarizedImage.data[pos] = 255;
              binarizedImage.data[pos + 1] = 255;
              binarizedImage.data[pos + 2] = 255;
              binarizedImage.data[pos + 3] = alpha;
            } else {
              binarizedImage.data[pos] = 0;
              binarizedImage.data[pos + 1] = 0;
              binarizedImage.data[pos + 2] = 0;
              binarizedImage.data[pos + 3] = alpha;
            }
          }
        }
        binarizedImageCanvasContext.putImageData(binarizedImage, 0, 0);
      }
    };
  }, [originalImage, threshold]);

  return (
    <>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            if (!event.target.files) {
              return;
            }
            if (typeof window !== "undefined") {
              const fileObject = event.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => {
                setOriginalImage(
                  reader.result ? (reader.result as string) : ""
                );
              };
              reader.readAsDataURL(fileObject);
            }
          }}
        />
      </div>
      <div>
        {/* <img src={originalImage} className="image" alt="image" /> */}
        <label htmlFor="original-image-canvas">{"元画像"}</label>
        <div>
          <canvas
            id={"original-image-canvas"}
            width={900}
            height={450}
          ></canvas>
        </div>
      </div>
      <div>
        {/* <img src={originalImage} className="image" alt="image" /> */}
        <label htmlFor="original-image-canvas">{"2値化"}</label>
        <div>
          <canvas
            id={"binarized-image-canvas"}
            width={900}
            height={450}
          ></canvas>
        </div>
      </div>
      <div>
        <label htmlFor="threshold">Threshold</label>
        <input
          type="range"
          id="threshold"
          name="threshold"
          min="0"
          max="255"
          value={threshold}
          onChange={(event) => {
            setThreshold(event.target.valueAsNumber);
          }}
        />
      </div>
      <div>
        <button
          onClick={() => {
            if (!originalImage) {
              return;
            }

            const binarizedImageCanvas = document.getElementById(
              "binarized-image-canvas"
            ) as HTMLCanvasElement;
            if (!binarizedImageCanvas) {
              return;
            }
            AxiosConfig.plainInstance
              .post("/example", {
                payload: {
                  image: binarizedImageCanvas.toDataURL(),
                },
              })
              .then((value) => {
                if (value.data.payload.tsv) {
                  setResultTsv(value.data.payload.tsv);
                }
                if (value.data.payload.text) {
                  setResultText(value.data.payload.text);
                }
                // if (value.data.payload.words) {
                //   setResultWords(value.data.payload.words);
                // }
              });
          }}
        >
          {"Submit"}
        </button>
      </div>
      <div>
        <label>{"TSV"}</label>
        <textarea
          value={resultTsv}
          readOnly={true}
          style={{
            width: "100%",
            minHeight: "6rem",
          }}
        />
      </div>
      <div>
        <label>{"テキスト"}</label>
        <textarea
          value={resultText}
          readOnly={true}
          style={{
            width: "100%",
            minHeight: "6rem",
          }}
        />
      </div>
      {/* <div>
        <label>{"テキストの配列"}</label>
        <textarea value={resultWords.join("\r\n")} readOnly={true} style={{
          width: "100%",
          minHeight: "6rem",
        }} />
      </div> */}
    </>
  );
}
