import AWS from "aws-sdk";
import { env } from "../../env/server.mjs";

export default new AWS.S3({
  region: "eu-north-1",
  endpoint: env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: !!env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY,
    secretAccessKey: env.AWS_S3_SECRET_KEY,
  },
});
