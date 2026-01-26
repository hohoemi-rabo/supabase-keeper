# 008: GitHub Actions設定

## 概要

毎日定時にCron APIを呼び出すGitHub Actionsワークフローを設定する。

## 関連セクション

- REQUIREMENTS.md: 8. Cron実行仕様

## ワークフロー仕様

- 実行タイミング: 毎日 AM 9:00 (JST) = UTC 0:00
- 手動実行も可能（workflow_dispatch）

## タスク

### ワークフローファイル作成

- [ ] `.github/workflows/keepalive-cron.yml` 作成

### GitHub Secrets設定

- [ ] `KEEPER_CRON_URL` を設定（本番環境のURL）
- [ ] `KEEPER_CRON_SECRET` を設定

### 動作確認

- [ ] 手動実行でテスト
- [ ] ログでレスポンス確認

## ワークフロー定義

```yaml
# .github/workflows/keepalive-cron.yml
name: Supabase Keeper Daily Ping

on:
  schedule:
    # 毎日 AM 9:00 (JST) = UTC 0:00
    - cron: '0 0 * * *'
  workflow_dispatch: # 手動実行も可能

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger keep-alive
        run: |
          response=$(curl -s -w "\n%{http_code}" -X POST "${{ secrets.KEEPER_CRON_URL }}" \
            -H "Authorization: Bearer ${{ secrets.KEEPER_CRON_SECRET }}" \
            -H "Content-Type: application/json")

          http_code=$(echo "$response" | tail -n1)
          body=$(echo "$response" | sed '$d')

          echo "HTTP Status: $http_code"
          echo "Response: $body"

          if [ "$http_code" != "200" ]; then
            echo "Error: API returned status $http_code"
            exit 1
          fi

      - name: Log result
        if: always()
        run: echo "Keep-alive ping completed at $(date -u)"
```

## Secrets設定手順

1. GitHubリポジトリの Settings > Secrets and variables > Actions
2. 以下のSecretsを追加:
   - `KEEPER_CRON_URL`: `https://your-app.vercel.app/api/cron/ping`
   - `KEEPER_CRON_SECRET`: Cron API認証用のシークレット

## 完了条件

- [ ] ワークフローファイルが作成されている
- [ ] GitHub Secretsが設定されている
- [ ] 手動実行でテストが成功する
- [ ] 定時実行が動作する（翌日以降に確認）
