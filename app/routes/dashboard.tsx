import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { authenticator } from "~/services/auth.server";
import { createBlobServiceClient } from "~/services/blob.client";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 403 });
  }

  const accessToken = user.accessToken;
  const storageAccount = process.env.AZURE_STORAGE_ACCCOUNT;
  const blobContainer = process.env.AZURE_BLOB_CONTAINER
  return { accessToken, storageAccount, blobContainer };
}
export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}

export default function Dashboard() {
  const { accessToken, storageAccount, blobContainer } = useLoaderData();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const blobServiceClient = createBlobServiceClient(
      accessToken,
      storageAccount,
    );

    const containerClient = blobServiceClient.getContainerClient(blobContainer);
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);

    try {
      const response = await blockBlobClient.uploadBrowserData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      });
      console.log("upload succeeded", response.requestId);
      alert("ファイルアップロード完了");
    } catch (error) {
      console.error("upload failed", error);
      alert("ファイルアップロード失敗");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Upload Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Upload a File:
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <Form method="post" className="flex justify-center">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </Form>
      </div>
    </div>
  );

}
