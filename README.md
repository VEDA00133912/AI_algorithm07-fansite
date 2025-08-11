# AI_algorithm07-fansite
**★超高性能AIアイドルアルの⾮公式ファンサイトです**  
**★当サイトで使⽤している画像の著作権・肖像権等は各権利者に帰属いたします**    
![og-image](./public/images/og-image.png)

## 🔗 各リンク
アルに関するリンクです  
サイトリンク→ https://ai-algorithm07-fansite.onrender.com   
Youtube→ https://youtube.com/@ai_algorithm0731   
Twitter→ https://x.com/AI_algorithm07   

## 🚀 技術スタック

### なぜこの技術を選んだか

- **Node.js + Express.js**: 軽量で高速なWebサーバーフレームワークなので小規模なファンサイトには十分な機能を提供でき、開発・デプロイが簡単
- **EJS (Embedded JavaScript)**: HTMLに近い記法でテンプレートが書けるため学習コストが低く、動的なコンテンツ生成が容易
- **SQLite + better-sqlite3**: ファイルベースのデータベースで、小規模サイトには十分な性能。セットアップが不要で、better-sqlite3は高性能な同期APIを提供
- **Basic認証**: 管理画面用のシンプルな認証方式。複雑な認証システムが不要な小規模サイトに適している
- **youtube video xml**: youtubeDataAPIはリクエスト多くなるとお金がかかっちゃうのでこっちで動画取得を行うことにした
## 📁 プロジェクト構造

```
├── data/
│   ├── vtuber_info.json
│   └── news.db
├── public/
│   ├── css/
│   └── images/
├── views/
│   ├── index.ejs
│   ├── admin_news_list.ejs
│   └── admin_news_form.ejs
├── basicAuth.js
├── convertLink.js
├── getLatestVideos.js
└── index.js
```

## 🛠️ セットアップ

### 必要な環境

- Node.js (v14以上推奨)
- npm

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/VEDA00133912/AI_algorithm07-fansite
cd AIalgorithm07fansite
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```.env
PORT=3000
ADMIN_USER=admin
ADMIN_PASS=your_password_here
```

4. サーバーを起動
```bash
npm start
```

## 📋 主な機能

### 一般ユーザー向け機能

- **プロフィール表示**: VTuberの基本情報（名前、誕生日、好きなものなど）
- **最新動画表示**: YouTube RSSから自動取得した最新5件の動画
- **ニュース表示**: 管理者が投稿したニュース記事
- **ソーシャルメディアリンク**: YouTube、Twitter、FANBOX等へのリンク
- **ハッシュタグリンク**: ファンアート用ハッシュタグへの直接リンク

### 管理者向け機能

- **ニュース管理**: ニュース記事の作成、編集、削除
- **Basic認証**: 管理画面へのアクセス制御
- **URL自動リンク**: ニュース本文内のURLを自動的にリンクに変換

## 🎯 使用方法

### 一般ユーザー

1. ブラウザで `http://localhost:3000` にアクセス
2. VTuberの情報、最新動画、ニュースを閲覧

### 管理者

1. `http://localhost:3000/admin/news` にアクセス
2. Basic認証でログイン（環境変数で設定したユーザー名・パスワード）
3. ニュースの追加・編集・削除が可能

## 🔧 カスタマイズ

### VTuber情報の変更

`data/vtuber_info.json` を編集してVTuberの基本情報を変更できます：

```json
{
  "name": "VTuber名",
  "birthday": "誕生日",
  "likes": "好きなもの",
  "youtube": "YouTubeチャンネルURL",
  "twitter": "TwitterURL",
}
```

### スタイルの変更

- `public/css/styles.css`: メインページのスタイル
- `public/css/news_list.css`: 管理画面ニュース一覧のスタイル
- `public/css/news_form.css`: 管理画面ニュース編集のスタイル

## 📦 依存関係

- **express**: Webアプリケーションフレームワーク
- **ejs**: テンプレートエンジン
- **better-sqlite3**: SQLiteデータベースドライバー
- **axios**: HTTP クライアント（YouTube RSS取得用）
- **xml2js**: XML パーサー（YouTube RSS解析用）
- **body-parser**: リクエストボディパーサー
- **dotenv**: 環境変数管理

## 🚀 デプロイ

### Render.com での例

1. GitHubリポジトリを作成
2. Render.comでWebサービスを作成
3. 環境変数を設定：
   - `ADMIN_USER`: 管理者ユーザー名
   - `ADMIN_PASS`: 管理者パスワード
4. ビルドコマンド: `npm install`
5. 開始コマンド: `npm start`

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照