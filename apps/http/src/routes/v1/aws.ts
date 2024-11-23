import { Router} from "express";
import { middleware } from "../../middleware";
import {  createSignedUrl } from "../../types";
import { generatePresignedUrl } from "../../utils/s3";

export const awsRouter = Router();


awsRouter.post('/s3-presigned-url', middleware, async (req,res) =>{
    const parsedData = createSignedUrl.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong file input format"})
        return
    }

    const { fileName, fileType } = parsedData.data;

    try{
        const signedUrl = await generatePresignedUrl(fileName, fileType);
        res.json({
            url:signedUrl
        })
    }
    catch (e) {
        console.log(e);
        res.status(404).json({error:"Could not generate presigned URL"});
    }
   
})

