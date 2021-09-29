-- inserts a row into public.users
drop function if exists public.handle_new_user;
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- create bucket and policy
insert into storage.buckets (id, name)
values ('images', 'images');

drop policy "Users can insert" on storage.objects;
create policy "Users can insert" on storage.objects for
insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');
