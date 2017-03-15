create table IF NOT EXISTS users (
    id serial primary key,
    name varchar(50) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now()
);

ALTER TABLE users ADD COLUMN image varchar(1000) default '';
ALTER TABLE users ADD COLUMN email varchar(100) default '';

insert into (name) values ("test 1");
