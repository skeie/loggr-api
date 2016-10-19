create table IF NOT EXISTS elements (
    id serial primary key,
    index smallint not null default 1,
    amount varchar(30) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now(),
    exercise_id serial REFERENCES exercises ON DELETE CASCADE
);
