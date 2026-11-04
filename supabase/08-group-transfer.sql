-- ============================================================
-- キャラシ工房：グループの代表をほかのメンバーにゆずる
-- Supabase の「SQL Editor」にこのファイルの中身を全部貼り付けて「Run」を押してください。
-- 何度実行しても大丈夫です。（02・03 のグループ用SQLを実行したあとに実行してください）
-- ============================================================

-- 代表者だけが、そのグループに「参加中」のメンバーへ代表をゆずれる。
-- ゆずった人は参加者としてグループに残る。
create or replace function public.transfer_group(gid text, new_owner uuid) returns void
language plpgsql security definer set search_path = public as $$
declare cur uuid;
begin
  select owner into cur from public.groups where id = gid for update;
  if cur is null then raise exception 'グループが見つかりません。'; end if;
  if cur <> auth.uid() then raise exception '代表をゆずれるのは、いまの代表者だけです。'; end if;
  if new_owner is null or new_owner = cur then raise exception 'ゆずる相手を選んでください。'; end if;
  if not exists (select 1 from public.group_members m where m.group_id = gid and m.user_id = new_owner and m.status = 'joined') then
    raise exception '代表をゆずれるのは、このグループに参加中のメンバーだけです。';
  end if;
  -- いまの代表者は参加者として残す（参加の記録がなければ作る）
  insert into public.group_members (group_id, user_id, status, role)
    values (gid, cur, 'joined', 'pl')
    on conflict (group_id, user_id) do update set status = 'joined';
  update public.groups set owner = new_owner, updated_at = now() where id = gid;
end;
$$;
revoke all on function public.transfer_group(text, uuid) from public;
grant execute on function public.transfer_group(text, uuid) to authenticated;
