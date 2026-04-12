# Bridge Heart Connect

一個專為橋牌愛好者設計的社交與活動管理平台，讓您輕鬆連接橋牌社群、參與活動，並享受橋牌的樂趣。

## ✨ 主要功能

- **🏠 首頁**：快速瀏覽最新活動和社群動態
- **👤 個人帳戶**：管理個人資料和橋牌成績
- **🎯 活動管理**：瀏覽、加入和創建橋牌活動
- **🎮 遊戲中心**：線上橋牌遊戲和練習模式
- **🤝 社交功能**：連接其他橋牌玩家，分享經驗
- **⚙️ 系統設定**：自訂應用偏好和通知
- **🗣️ 語音助手**：智慧語音互動，協助橋牌學習

## 🚀 快速啟動

### Windows 使用者
雙擊 `start-dev.bat` 或 `start-dev.ps1` 檔案即可啟動！

### Mac/Linux 使用者
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

應用將在 http://localhost:8080/ 啟動

## 🛠️ 技術棧

- **前端**：React + TypeScript + Vite
- **UI 框架**：Tailwind CSS + shadcn/ui
- **狀態管理**：React Context
- **路由**：React Router
- **建構工具**：Vite
- **測試**：Vitest

## 📁 專案結構

```
src/
├── components/          # 可重用元件
│   ├── ui/             # UI 元件庫
│   └── ...
├── pages/              # 頁面元件
├── contexts/           # React Context
├── hooks/              # 自訂 Hooks
├── lib/                # 工具函數
└── test/               # 測試檔案
```

## 🤝 貢獻

歡迎橋牌社群的貢獻！請遵循以下步驟：

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡我們

有任何問題或建議？歡迎透過 GitHub Issues 聯絡我們！

---

**讓橋牌連接每顆心 ❤️**

**直接在 GitHub 上編輯檔案**

- 導航到所需的檔案。
- 點擊檔案檢視右上方的「編輯」按鈕（鉛筆圖示）。
- 進行修改並提交變更。

**使用 GitHub Codespaces**

- 導航到儲存庫的主頁面。
- 點擊右上方附近的「Code」按鈕（綠色按鈕）。
- 選擇「Codespaces」分頁。
- 點擊「New codespace」以啟動新的 Codespace 環境。
- 直接在 Codespace 中編輯檔案，完成後提交並推送您的變更。

## 本專案使用了哪些技術？

本專案使用以下技術建置：

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 如何部署此專案？

只需開啟 [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)，然後點擊「分享 → 發布」。

## 我可以將自訂網域連結到 Lovable 專案嗎？

可以的！

若要連結網域，請導航到「專案 > 設定 > 網域」，然後點擊「連結網域」。

更多資訊請閱讀：[設定自訂網域](https://docs.lovable.dev/features/custom-domain#custom-domain)
