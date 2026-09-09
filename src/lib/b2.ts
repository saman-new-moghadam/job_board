// src/lib/b2.ts

import { S3Client, PutObjectCommand  } from "@aws-sdk/client-s3";

export const b2Client  = new S3Client({
    region: process.env.B2_REGION, 
    endpoint: process.env.B2_ENDPOINT, 
    credentials: {
        accessKeyId: process.env.B2_KEY_ID!, 
        secretAccessKey: process.env.B2_APPLICATION_KEY!
    }    
}); 


export async function uploadFile(
    file: Buffer, 
    key: string, 
    contentType: string
) {
    const command = new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME, 
        Key: key, 
        Body: file, 
        ContentType: contentType
    })

    return await b2Client.send(command); 
}

