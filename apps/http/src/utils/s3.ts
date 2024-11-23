import { S3Client, PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
require("dotenv").config();
import { S3 } from "aws-sdk"


const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

export const generatePresignedUrl = async (fileName: string, fileType: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Valid for 1 hour
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Could not generate presigned URL");
  }
};

export const deleteObjectFromS3 = async (key:string) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
  
    try {
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
      console.log(`Successfully deleted ${key} from ${process.env.AWS_BUCKET_NAME}`);
    } catch (error) {
      console.error("Error deleting object from S3:", error);
      throw new Error("Could not delete object from S3");
    }
  };
  

