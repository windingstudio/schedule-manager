-- ==========================================
-- 1. RLSポリシーのリセットと再設定
-- ==========================================

-- 既存のポリシーを削除（エラー回避のため）
drop policy if exists "Users can insert their own profile" on admin_profiles;
drop policy if exists "Users can read own profile" on admin_profiles;
drop policy if exists "Owners can read all profiles" on admin_profiles;
drop policy if exists "Owners can update profiles" on admin_profiles;

-- RLSが有効であることを確認
alter table admin_profiles enable row level security;

-- 【重要】自分が自分のプロフィールを見る権限
create policy "Users can read own profile"
  on admin_profiles for select
  using ( auth.uid() = id );

-- 自分がプロフィールを作成する権限
create policy "Users can insert their own profile"
  on admin_profiles for insert
  with check ( auth.uid() = id );

-- オーナーは全員分見れる権限
create policy "Owners can read all profiles"
  on admin_profiles for select
  using ( 
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- オーナーは更新できる権限
create policy "Owners can update profiles"
  on admin_profiles for update
  using ( 
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- ==========================================
-- 2. ユーザーデータの強制修復 (UPSERT)
-- ==========================================
-- auth.usersテーブルにある情報を元に、admin_profilesを確実に作成・更新します
-- 競合(conflict)した場合は、承認済みオーナーとして上書きします

insert into admin_profiles (id, email, is_approved, role)
select id, email, true, 'owner'
from auth.users
-- 最新のユーザー1件のみを対象（複数アカウントがある場合の安全策）
order by created_at desc limit 1
on conflict (id) do update
set is_approved = true, role = 'owner';
