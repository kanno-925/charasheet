-- キャラシ工房：グループの代表をゆずる（SQL Editor に全部貼り付けて Run。何度実行しても大丈夫）
-- エラーの言葉は短い英語の記号にして、アプリ側で日本語に直して表示する（コピーで文字化け・途中切れしにくくするため）
create or replace function public.transfer_group(gid text, new_owner uuid) returns void
language plpgsql security definer set search_path = public as $f$
declare cur uuid;
begin
  select owner into cur from groups where id = gid for update;
  if cur is null then raise exception 'not_found'; end if;
  if cur <> auth.uid() then raise exception 'not_owner'; end if;
  if new_owner is null or new_owner = cur then raise exception 'bad_target'; end if;
  if not exists (select 1 from group_members where group_id = gid and user_id = new_owner and status = 'joined') then raise exception 'not_member'; end if;
  insert into group_members (group_id, user_id, status, role) values (gid, cur, 'joined', 'pl') on conflict (group_id, user_id) do update set status = 'joined';
  update groups set owner = new_owner, updated_at = now() where id = gid;
end $f$;
revoke all on function public.transfer_group(text, uuid) from public;
grant execute on function public.transfer_group(text, uuid) to authenticated;
