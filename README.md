# azure-entra-auth-blob-storage

## Overview
Microsoft Entra ID でログインして Azure Blob Storage にファイルをアップロードする Web アプリです。

## Usage
詳細な利用方法は以下を参照してください。  
https://wptech.kiichiro.work/14rqfd1ec6/

`.env` ファイルを作成します。

```sh
$ cp .env.example .env
$ npm run dev
```

`.env` に必要な値を入力します。

```
ENTRA_CLIENT_ID={クライアントID}
ENTRA_CLIENT_SECRET={クライアントシークレット}
ENTRA_REDIRECT_URI=http://localhost:5173/auth/microsoft/callback
ENTRA_TENANT_ID={テナントID}
AZURE_STORAGE_ACCCOUNT={ストレージアカウント名}
AZURE_BLOB_CONTAINER={コンテナー名}
```

起動します。

```sh
$ npm run dev
```

`http://localhost:5173/login` にアクセスします。
