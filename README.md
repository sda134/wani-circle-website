# わにサークル ウェブサイト

わにサークルのイベント情報を表示するAstroベースの静的ウェブサイトです。

## 🚀 プロジェクト概要

このサイトは「わにサークル」の今後のイベントを表示するシンプルな静的ウェブサイトです。Astroフレームワークを使用し、Markdownファイルでイベント情報を管理しています。

## 📁 プロジェクト構造

```text
/
├── public/
│   ├── favicon.svg
│   └── images/
│       └── events/          # イベント画像
├── src/
│   ├── components/
│   │   └── Nav.astro        # ナビゲーションコンポーネント
│   ├── content/
│   │   └── events/          # イベントのMarkdownファイル
│   ├── layouts/
│   │   └── Layout.astro     # ベースレイアウト
│   └── pages/
│       ├── index.astro      # ホームページ
│       └── events/
│           └── [...event].astro  # イベント詳細ページ
├── astro.config.mjs         # Astro設定
├── tailwind.config.mjs      # Tailwind CSS設定
└── package.json
```

## 🧞 コマンド

プロジェクトルートで以下のコマンドを実行してください：

| コマンド                   | アクション                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 依存関係をインストール                            |
| `npm run dev`             | 開発サーバーを `localhost:4321` で起動      |
| `npm run build`           | 本番サイトを `./dist/` にビルド          |
| `npm run preview`         | ビルドしたサイトをローカルでプレビュー     |
| `npm run astro ...`       | Astro CLIコマンドを実行 |

## 🎨 技術スタック

- **Astro v4.16.16**: 静的サイトジェネレーター
- **Tailwind CSS**: スタイリングフレームワーク
- **TypeScript**: 型安全な開発
- **Content Collections**: Markdownベースのコンテンツ管理

## 📝 イベント管理

イベントは `src/content/events/` ディレクトリ内のMarkdownファイルで管理されています。

### イベントファイル形式

```markdown
---
title: "イベント名"
date: "2024-01-01"
time: "14:00-16:00"
location: "場所"
description: "イベントの概要"
image: "/images/events/event-image.jpg"
isUpcoming: true
---

イベントの詳細な説明をここに記載...
```

### 新しいイベントの追加

1. `src/content/events/` に新しい `.md` ファイルを作成
2. 上記の形式でフロントマターと内容を記載
3. 必要に応じて `public/images/events/` に画像を配置
4. Gitコミット・プッシュで自動デプロイ

## 🌐 デプロイ

このサイトはCloudflare Pagesにデプロイされています。`main`ブランチへのプッシュで自動デプロイされます。

**デプロイ設定：**
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- Node.js バージョン: 18以上

## 🎯 主要機能

- **イベント一覧表示**: 今後のイベント（`isUpcoming: true`）のみを表示
- **イベント詳細ページ**: 各イベントの詳細情報とMarkdownコンテンツ
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **高速読み込み**: 静的サイト生成による最適化

## 📄 ライセンス

このプロジェクトは個人利用目的で作成されています。
