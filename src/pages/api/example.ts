import TesseractConfig from "@/configurations/tesseract.config";
import ResponseModel from "@/models/shared/ResponseModel";
import type { NextApiRequest, NextApiResponse } from "next";

interface Payload {
  tsv: string;
  text: string;
  words: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseModel<Payload>>
): Promise<void> {
  switch (req.method) {
    case "POST":
      try {
        await TesseractConfig.initialize();
        const worker = TesseractConfig.getWorker();
        if (worker) {
          const result = await worker.recognize(req.body.payload.image);
          await TesseractConfig.terminate();
          res.status(200).json({
            status: 200,
            payload: {
              tsv: result.data.tsv ? result.data.tsv : "",
              text: result.data.text ? result.data.text : "",
              words: result.data.words ? result.data.words.map(word => word.text) : [],
            },
          });
          return;
        }
        res.status(400).json({
          status: 400,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 500,
        });
      }
      return;
  }
  res.status(404).json({
    status: 404,
  });
}
