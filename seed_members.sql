-- =========================================
-- 1. メンバーテーブルとスケジュールテーブルのRLS設定
-- (以前の設定では許可ポリシーがなかったため、Admin操作もblockedされていた可能性があります)
-- =========================================

-- Adminプロファイル(role='owner' or 'admin')を持つユーザーは、MembersとSchedulesの操作を全許可
create policy "Admins can do everything on members"
  on members
  using (
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and (role = 'owner' or role = 'admin') and is_approved = true
    )
  );

create policy "Admins can do everything on schedules"
  on schedules
  using (
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and (role = 'owner' or role = 'admin') and is_approved = true
    )
  );

-- Attendancesも同上
create policy "Admins can do everything on attendances"
  on attendances
  using (
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and (role = 'owner' or role = 'admin') and is_approved = true
    )
  );

-- 公開読み取り（LIFF用）: メンバーリストとスケジュールは誰でも見れる（または認証なしでAPI叩ける）必要がある場合
-- LIFFからAPIを叩く際、Supabase Authを通さないなら、Anon Keyでのアクセスになる。
-- ひとまず「誰でもReadはOK」にしておくのが簡単です。
create policy "Public read access for members"
  on members for select
  using ( true );

create policy "Public read access for schedules"
  on schedules for select
  using ( true );

-- =========================================
-- 2. メンバーデータの一括投入
-- =========================================

insert into members (name, part) values
('水谷 英一', 'フルート'),
('松下 将大', 'フルート'),
('長谷川 侑輝', 'フルート'),
('毎床 春弥', 'フルート'),
('濱田 友嘉', 'クラリネット'),
('高橋 葵', 'クラリネット'),
('杉本 大稀', 'クラリネット'),
('竹山 陽樹', 'クラリネット'),
('櫻井 宙', 'クラリネット'),
('松本 龍弥', 'サックス'),
('梅本 瞭', 'サックス'),
('内海 蓮', 'サックス'),
('太田 優成', 'トランペット'),
('山内 空', 'トランペット'),
('前田 一稀', 'トランペット'),
('森川 太陽', 'トランペット'),
('前田 一真', 'トランペット'),
('山口 世恩', 'トランペット'),
('奥仲 剛史', 'ホルン'),
('石村 創太', 'ホルン'),
('橋本 総司', 'ホルン'),
('市川 師道', 'ホルン'),
('八木 幸来', 'ホルン'),
('池町 昊紀', 'トロンボーン'),
('柳澤 恒史郎', 'トロンボーン'),
('余田 哲士', 'トロンボーン'),
('〆田 貫太朗', 'ユーフォニアム'),
('岡田 七星', 'ユーフォニアム'),
('森川 一葉', 'ユーフォニアム'),
('奥田 創揮', 'ユーフォニアム'),
('長谷 坂惇輝', 'ユーフォニアム'),
('北條 剣', 'ユーフォニアム'),
('野上 誠', 'ユーフォニアム'),
('今市 刀矢', 'チューバ'),
('田中 悠也', 'チューバ'),
('伊藤 勝太', 'チューバ'),
('平入 惠佑', 'パーカッション'),
('伊藤 直人', 'パーカッション'),
('山本 将士', 'パーカッション'),
('松下 大樹', 'パーカッション'),
('池口 颯', 'パーカッション'),
('水谷 直樹', 'パーカッション')
on conflict (id) do nothing;
