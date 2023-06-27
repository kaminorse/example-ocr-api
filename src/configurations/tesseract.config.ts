import Tesseract, { createWorker } from "tesseract.js";

let worker: Tesseract.Worker | undefined = undefined;

async function initialize(): Promise<void> {
  if (!worker) {
    worker = await createWorker({
      logger: m => console.log(m)
    });
    await worker.loadLanguage('eng');
    await worker.loadLanguage('jpn');
    await worker.initialize('eng');
    await worker.initialize('jpn');
  }  
}

function getWorker() {
  return worker;
}

async function terminate() {
  if (worker) {
    await worker.terminate();
    worker = undefined;
  }
}

const TesseractConfig = {
  initialize,
  terminate,
  getWorker,
};

export default TesseractConfig;