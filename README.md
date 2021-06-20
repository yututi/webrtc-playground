# webrtc-playground

Discordライクなチャットアプリ（予定）です  
[demo](https://sample-yututi.df.r.appspot.com/)

### ローカルでの実行

Webpack dev serverの立ち上げ
```
cd client
npm run dev
```

APIサーバの立ち上げ
```
cd server
npm run dev
```

### Google App Engineへのデプロイ

```
cd client
gcloud app deploy client.yaml
```

```
cd server
gcloud app deploy api.yaml
```

```
gcloud app deploy dispatch.yaml
```
