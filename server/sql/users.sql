create table IF NOT EXISTS users (
    id serial primary key,
    name varchar(50) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now()
);


insert into users (name) values ('DaddyMcSwagga');

insert into users (name) values ('Bendik');

