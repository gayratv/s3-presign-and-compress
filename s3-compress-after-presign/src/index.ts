import { compressImage } from "./ImageCompress";
import { YC } from "./yc";
require("dotenv").config();

/*
   inpPictName,
  fit: keyof FitEnum = sharp.fit.contain,
  position: number | string = sharp.gravity.centre,
  bckgrndColor: RGBA = { r: 46, g: 138, b: 138, alpha: 1 },
 */

module.exports.handler = async function (
  event: YC.CloudFunctionsHttpEvent,
  context: YC.CloudFunctionsContext
) {
  const { httpMethod, queryStringParameters } = event;

  if (httpMethod === "OPTIONS") {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify("Hello from Lambda!"),
    };
    return response;
  }

  if (httpMethod != "POST")
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        errMsg: "Используйте метод POST для сжатия изображения",
      }),
      isBase64Encoded: false,
    };

  const inpFnames: Array<string> = context.getPayload();

  const outObject = {};
  for (let i = 0; i < inpFnames.length; i++) {
    const retImgs = await compressImage(
      process.env.TMPBACKETNAME,
      inpFnames[i]
    );
    outObject[inpFnames[i]] = retImgs;
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(outObject),
    isBase64Encoded: false,
  };
};
