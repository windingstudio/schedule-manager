-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on admin_profiles for insert
  with check ( auth.uid() = id );

-- Allow users to read their own profile
create policy "Users can read own profile"
  on admin_profiles for select
  using ( auth.uid() = id );

-- Allow owners to read all profiles (for approval)
create policy "Owners can read all profiles"
  on admin_profiles for select
  using ( 
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- Allow owners to update profiles (approval)
create policy "Owners can update profiles"
  on admin_profiles for update
  using ( 
    exists (
      select 1 from admin_profiles
      where id = auth.uid() and role = 'owner'
    )
  );
