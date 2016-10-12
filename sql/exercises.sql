create table IF NOT EXISTS exercises (
    id serial primary key,
    name varchar(50) not null default '',
    body varchar(1000) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now(),
    user_id serial REFERENCES user ON DELETE CASCADE
);
