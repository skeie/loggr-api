create table IF NOT EXISTS users (
    id serial primary key,
    name varchar(50) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now(),
    image varchar(1000) default '',
    email varchar(100) default '',
    push_id varchar(100) default '',
    weekly_training smallint default 0,
    streak smallint not null default 0
);

insert into users (name, image) values ('Morten', 'https://scontent.xx.fbcdn.net/v/t1.0-1/c247.37.466.466/s50x50/481116_10150942288436755_577856798_n.jpg?oh=ded905be3cc592cef2b153a4c1036846&oe=5993E57D');
insert into users (name, image) values ('Bendik', 'https://scontent.xx.fbcdn.net/v/t1.0-1/c247.37.466.466/s50x50/481116_10150942288436755_577856798_n.jpg?oh=ded905be3cc592cef2b153a4c1036846&oe=5993E57D');

alter table users add column push_id varchar(100) default ''
alter table users add column push_token varchar(100) default ''
alter table users add column weekly_training smallint default 0;