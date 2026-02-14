# Project: schedule-manager

## 1. 概要 (Overview)
吹奏楽団（または類似の団体）のスケジュールおよびメンバーの出欠管理を行うアプリケーションです。
管理者（Admin）によるスケジュール作成・メンバー管理と、団員（Member）による出欠登録・帰宅報告（LINE連携）を主な機能とします。

## 2. 技術スタック (Tech Stack)
*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Database / Auth**: Supabase
*   **Integration**: LINE LIFF (LINE Front-end Framework)

## 3. ディレクトリ構造 (Directory Structure)
```
/
├── public/              # 静的ファイル
├── src/
│   ├── app/
│   │   ├── (admin)/     # 管理者用画面 (Layout, Pages)
│   │   ├── (member)/    # 団員用画面 (Layout, Pages)
│   │   ├── api/         # API Route Handlers
│   │   ├── auth/        # 認証関連 (Sign-in, etc.)
│   ├── components/      # 共通コンポーネント
│   ├── domain/          # ドメイン層 (Entities, Repositories Interfaces)
│   ├── infrastructure/  # インフラ層 (Supabase, Repositories Implementations)
│   ├── use_cases/       # ユースケース層 (Business Logic)
│   ├── middleware.ts    # Route Middleware (Auth protection)
├── *.sql                # Database Schema & Data Seeds
```

## 4. データベース設計 (Database Schema)
Supabase (PostgreSQL) を使用。

### Tables (推測含む)
*   **members**
    *   `id`: UUID (PK)
    *   `name`: Text (メンバー名)
    *   `part`: Text (パート: フルート, クラリネット, etc.)
    *   `role`: Text (役職: バンド長, パート長, etc.)
    *   `age`: Integer
    *   `note`: Text
    *   `is_on_leave`: Boolean (休団中フラグ)
*   **admin_profiles**
    *   `id`: UUID (PK, references auth.users)
    *   `role`: Text ('owner' | 'admin')
    *   `is_approved`: Boolean (承認フラグ)
*   **schedules** (推測)
    *   スケジュール詳細（日付、場所、練習内容など）
*   **attendances** (推測)
    *   `returned_home_at`: Timestamp (帰宅報告日時)
    *   メンバーの各スケジュールに対する出欠状況

### Security (RLS)
*   Adminは `admin_profiles` に基づき全権限を持つ。
*   Memberは自身のデータまたは公開データを閲覧可能 (LIFF経由)。

## 5. 主な機能 (Core Features)

### 管理者機能 (Admin)
*   **ダッシュボード**: スケジュール一覧、直近の練習ステータス確認。
*   **スケジュール管理**: 練習日程の作成・編集・削除。
*   **メンバー管理**: 団員情報の追加・編集、役職設定。
*   **出欠確認**: 練習ごとの団員の出欠状況確認・集計。

### 団員機能 (Member)
*   **出欠登録**: 練習日程に対する出欠（出席・欠席・遅刻・早退など）の登録。
*   **帰宅報告**: 練習終了後の帰宅報告ボタン（Admin側で安否確認などに利用）。
*   **LINE連携**: LIFFを利用し、LINEアプリ内からシームレスに利用可能。

## 6. 今後の展望・改善点 (Future Improvements)
*   **LINE通知機能**: 未回答者へのリマインド、スケジュール変更通知など。
*   **権限管理の詳細化**: パートリーダーごとの権限など。
