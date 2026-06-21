# 對齊 CI（ubuntu-latest + Node 22 + pnpm）的可重現開發/建置環境。
# 建議在 WSL2 內使用，並把專案放在 Linux 檔案系統（如 ~/projects/…）以獲得正常的 HMR 與效能。
FROM node:22-slim

# 啟用 corepack 內建的 pnpm
RUN corepack enable

WORKDIR /app

# 先複製依賴宣告，利用 Docker layer 快取
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 複製其餘原始碼（實際開發時由 docker-compose 的 bind mount 覆蓋）
COPY . .

EXPOSE 5173

# 預設啟動開發伺服器；--host 讓容器外（host 瀏覽器）可連線
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
