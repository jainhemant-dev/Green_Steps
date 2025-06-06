import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { config } from '##/server/config/default.js';
const s3Client = new S3Client({ region: config.s3.region });

function _getSignedUrl(
  command,
  // Default expiration time is 1 minute
  expiresInSeconds = 60,
) {
  return getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });
}

/**
 * Asynchronously generates a signed URL for deleting a file from an S3 bucket.
 *
 * @param {string} filePath - The path of the file to be deleted in the S3 bucket.
 * @param {string} bucket - The name of the S3 bucket.
 * @returns {Promise<{ signedURL: string }>} A promise that resolves to an object
 * containing the signed URL for deleting the specified file.
 */
async function getSignedUrlForDelete(filePath, bucket) {
  const signedURL = await _getSignedUrl(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: filePath,
    }),
  );

  return { signedURL };
}

/*
 * Generates a signed URL for uploading a file to an S3 bucket.
 */

async function getSignedUrlForUpload(companyId, fileName, bucket) {
  const filePath = `${companyId}/${Date.now()}/${fileName}`;

  const signedURL = await _getSignedUrl(
    new PutObjectCommand({
      Bucket: bucket,
      Key: filePath,
    }),
  );

  return { signedURL, filePath };
}

export { getSignedUrlForDelete, getSignedUrlForUpload };
