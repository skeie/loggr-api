create table IF NOT EXISTS images (
    id serial primary key,
    sender_user_id serial REFERENCES users ON DELETE CASCADE,
    receiver_user_id serial REFERENCES users ON DELETE CASCADE,
    has_seen boolean default false,
    url varchar(200) not null default '',
    created timestamptz not null default now()
);
