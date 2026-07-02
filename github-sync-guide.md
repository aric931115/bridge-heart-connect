# GitHub 同步使用方法

這份文件是給你最簡單、最常用的 GitHub 同步流程。

## 最簡單流程（直接照這樣做）

```bash
git status
git add .
git commit -m "你的提交說明"
git push
```

## 每一步在做什麼

### 1. 看目前有哪些變更

```bash
git status
```

### 2. 把所有修改加入準備提交

```bash
git add .
```

### 3. 建立提交紀錄

```bash
git commit -m "新增啟動說明"
```

### 4. 推送到 GitHub

```bash
git push
```

## 如果是第一次推送

```bash
git push -u origin main
```

## 如果要先拿到最新版本

```bash
git pull
```

## 如果你想先設定 GitHub 帳號

```bash
git config --global user.name "你的名字"
git config --global user.email "你的信箱"
```

## 你現在最常用的版本

```bash
git add .
git commit -m "更新內容"
git push
```

