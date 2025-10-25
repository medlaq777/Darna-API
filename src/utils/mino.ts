// src/minioClient.ts
import * as Minio from 'minio';

// Configure MinIO
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',    
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});
export const publicUrl = process.env.MINIO_PUBLIC_URL!;
const bucketName = process.env.MINIO_BUCKET_NAME || 'my-uploads-bucket';

/**
 * Ensures the bucket exists, creating it if it doesn't.
 */
export async function ensureBucketExists() {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
        await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
        console.log(`Bucket '${bucketName}' created.`);
    }
}

export { minioClient, bucketName };