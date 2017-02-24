create table IF NOT EXISTS highscore (
    id serial primary key,
    created timestamptz not null default now(),
    updated timestamptz not null default now(),
    user_id serial REFERENCES users ON DELETE CASCADE,
    highscore bigserial not null default 0
);
