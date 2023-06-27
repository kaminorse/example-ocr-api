import AxiosConfig from "@/configurations/axios.config";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  const [resultTsv, setResultTsv] = useState("");
  const [resultText, setResultText] = useState("");
  // const [resultWords, setResultWords] = useState([]);
  return (
    <>
      <div>
        <img src={image} className="image" alt="image" />
      </div>
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
              setImage(reader.result ? reader.result as string : "");
              window.console.log(image);
            }
            reader.readAsDataURL(fileObject);
          }
        }}
      />
      </div>
      <div>
        <button onClick={() => {
          if (!image) {
            return;
          }
          AxiosConfig.plainInstance.post("/example", {
            payload: {
              image: image,
            }
          }).then(value => {
            if (value.data.payload.tsv) {
              setResultTsv(value.data.payload.tsv);
            }
            if (value.data.payload.text) {
              setResultText(value.data.payload.text);
            }
            // if (value.data.payload.words) {
            //   setResultWords(value.data.payload.words);
            // }
          })
        }}>
          {"Submit"}
        </button>
      </div>
      <div>
        <label>{"TSV"}</label>
        <textarea value={resultTsv} readOnly={true} style={{
          width: "100%",
          minHeight: "6rem",
        }} />
      </div>
      <div>
        <label>{"テキスト"}</label>
        <textarea value={resultText} readOnly={true} style={{
          width: "100%",
          minHeight: "6rem",
        }} />
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
