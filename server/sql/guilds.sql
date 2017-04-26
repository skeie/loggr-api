create table IF NOT EXISTS guilds (
    id serial primary key,
    name varchar(50) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now(),
    users integer[]
);
