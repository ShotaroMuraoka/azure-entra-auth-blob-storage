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
  return { accessToken, storageAccount };
}
export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}

export default function Dashboard() {
  const { accessToken, storageAccount } = useLoaderData();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const blobServiceClient = createBlobServiceClient(
      accessToken,
      storageAccount,
    );
    const containerClient = blobServiceClient.getContainerClient("azuresas");

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
    <div>
      <div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={handleUpload} disabled={!file}>
          Upload
        </button>
      </div>
      <div>
        <Form method="post">
          <button type="submit">Logout</button>
        </Form>
      </div>
    </div>
  );
}
