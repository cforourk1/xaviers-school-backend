DROP TABLE IF EXISTS mutants CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL
);

CREATE TABLE teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  base_of_operations text NOT NULL,
  image_url text NOT NULL
);

CREATE TABLE mutants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  alias text NOT NULL,
  biography text NOT NULL,
  power_description text NOT NULL,
  image_url text NOT NULL,
  status text NOT NULL,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE
);