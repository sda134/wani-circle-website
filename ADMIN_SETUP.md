# 管理画面セットアップガイド

このドキュメントでは、わにサークルのイベント管理画面の設定と使用方法を説明します。

## 必要な環境変数

`.env`ファイルを作成し、以下の環境変数を設定してください：

```bash
# 管理画面パスワード
ADMIN_PASSWORD=your_secure_password_here

# GitHub API設定
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=your-github-username  
GITHUB_REPO_NAME=wani-circle-website
```

## GitHub Personal Access Token の作成

1. GitHubの[Personal Access Tokens](https://github.com/settings/tokens)ページにアクセス
2. "Generate new token (classic)" をクリック
3. 以下の権限を設定：
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
4. トークンをコピーして`GITHUB_TOKEN`に設定

## 管理画面へのアクセス

1. サイトを起動：`npm run dev`
2. ブラウザで`http://localhost:4321/admin`にアクセス
3. 設定したパスワードでログイン

## 管理画面機能

### ログイン画面 (`/admin`)
- パスワード認証
- セッション管理（8時間有効）

### ダッシュボード (`/admin/dashboard`)
- 全イベントの一覧表示
- 新規作成、編集、削除の操作

### 新規イベント作成 (`/admin/new`)
- イベント情報入力フォーム
- Markdownでの詳細コンテンツ作成
- GitHub APIでファイル自動生成

### イベント編集 (`/admin/edit/[event]`)
- 既存イベント情報の編集
- GitHub APIでファイル更新

## ファイル構造

```
src/
├── lib/
│   ├── auth.ts          # 認証管理
│   ├── github-api.ts    # GitHub API操作
│   └── admin-init.ts    # 管理画面初期化
├── pages/
│   ├── admin/
│   │   ├── index.astro        # ログイン画面
│   │   ├── dashboard.astro    # ダッシュボード
│   │   ├── new.astro         # 新規作成
│   │   └── edit/[event].astro # 編集画面
│   └── api/
│       ├── config.ts          # 環境変数API
│       └── events/
│           └── create.ts      # イベント作成API
└── types/
    └── global.d.ts      # TypeScript型定義
```

## セキュリティ注意事項

1. **環境変数の管理**
   - `.env`ファイルは`.gitignore`に追加
   - 本番環境では適切に環境変数を設定

2. **GitHub Token**
   - 最小権限での設定
   - 定期的なローテーション

3. **パスワード**
   - 強力なパスワードを使用
   - 定期的な変更

## トラブルシューティング

### よくある問題

1. **ログインできない**
   - 環境変数`ADMIN_PASSWORD`が正しく設定されているか確認
   - ブラウザのローカルストレージをクリア

2. **GitHub APIエラー**
   - `GITHUB_TOKEN`の権限確認
   - リポジトリ名・所有者名の確認
   - APIレート制限の確認

3. **ファイル作成/更新エラー**
   - ファイル名の重複確認
   - ブランチ権限の確認

### ログの確認

ブラウザの開発者ツールのコンソールでエラーログを確認してください。

## 開発者向け情報

### カスタマイズ

1. **UI スタイル**: Tailwind CSSクラスで調整
2. **バリデーション**: フォームバリデーションの追加
3. **機能拡張**: 画像アップロード機能など

### API エンドポイント

- `GET /api/config?password=xxx` - 認証済み設定取得
- `POST /api/events/create` - イベント作成（未実装）

## Cloudflare Pages デプロイ

1. 環境変数を Cloudflare Pages の設定で追加
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `dist`

環境変数は Cloudflare Pages の「設定」→「環境変数」で設定できます。