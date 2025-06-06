import Api from '##/src/request.js';

function extractFileNameFromS3Path(s3Path) {
  const match = s3Path.match(/[^/]+$/);
  if (!match) {
    throw new Error(`Invalid S3 path: ${s3Path}`);
  }
  return match[0];
}

async function getSignedUrlForS3(s3Key, options = {}) {
  if (options.method === 'PUT' && !options.body?.fileName) {
    throw new Error('Expected `fileName` when uploading attachment');
  }

  const url = new URL('/api/files', window.origin);
  url.searchParams.set('file', s3Key);
  const response = await Api.fetch(url, options);
  // Fix casing on `signedURL` parameter.
  const { signedURL: signedUrl, ...rest } = response;
  return { signedUrl, ...rest };
}

/**
 * Deletes a file from S3 using a pre-signed URL.
 *
 * 1. Retrieves a signed URL for deletion based on the file path.
 * 2. Sends a DELETE request to the signed URL.
 *
 * On failure, logs the error and returns the original file.
 * On success, returns null.
 */
async function deleteFile(filePath, handleError) {
  try {
    const { signedUrl } = await getSignedUrlForS3(filePath, {
      method: 'DELETE',
    });

    await fetch(signedUrl, { method: 'DELETE' });
    return null;
  } catch (error) {
    handleError('deleteFile', error, '');
    return filePath;
  }
}

/**
 * Uploads a new file to S3 using a pre-signed URL.
 *
 * 1. Requests a signed URL to upload the file.
 * 2. Sends a PUT request with the file content.
 *
 * On success, returns the updated file with its new file path.
 * On failure, logs the error and returns null.
 */
async function uploadFile(file, handleError) {
  try {
    const { signedUrl, filePath } = await getSignedUrlForS3(file.name, {
      method: 'PUT',
      body: { fileName: file.name },
    });
    await fetch(signedUrl, { method: 'PUT', body: file });

    return { ...file, value: filePath, signedUrl: signedUrl };
  } catch (error) {
    handleError('uploadFile', error, '');
    return null;
  }
}

const getFileNameFromS3Key = (filePath) => {
  const match = filePath && filePath.match(/[^/]+\/\d+\/(.+)$/);

  if (!match) return '';
  return match[1];
};

async function downloadGoodsList(viewingId, type = 'excel') {
  // Create a form dynamically
  const url = new URL(
    `${window.location.origin}/api/files/goods/${viewingId}/${type}`,
  );
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = url.href;
  form.target = '_blank'; // Opens the request in a new tab
  // Attach and submit the form
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export { uploadFile, deleteFile, getFileNameFromS3Key, downloadGoodsList };
