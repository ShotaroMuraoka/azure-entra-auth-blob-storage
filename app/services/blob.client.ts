import {BlobServiceClient} from "@azure/storage-blob";

export function createBlobServiceClient(accessToken, storageAccount) {
  const credential = {
    getToken: async () => {
      return {
        token: accessToken,
        expiresOnTimestamp: Date.now() + 3600 * 1000,
      };
    },
  };

  const blobServiceClient = new BlobServiceClient(
    `https://${storageAccount}.blob.core.windows.net`,
    credential
  );

  return blobServiceClient;
}
