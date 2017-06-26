create table IF NOT EXISTS challenge (
    id serial primary key,
    created timestamptz not null default now(),
    updated timestamptz not null default now(),
    challenged_user_id serial REFERENCES users ON DELETE CASCADE,
    user_sent_challenge_id serial REFERENCES users ON DELETE CASCADE,
    title varchar(1000) default ''
);
