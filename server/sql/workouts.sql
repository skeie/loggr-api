create table IF NOT EXISTS workouts (
id SERIAL PRIMARY KEY,
exercises integer[],
users integer[],
is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE workouts
  ADD COLUMN "is_active" BOOLEAN DEFAULT FALSE;