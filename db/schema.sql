DROP TABLE IF EXISTS teams_mutants CASCADE;
DROP TABLE IF EXISTS mutants CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'user'
);

CREATE TABLE teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  base_of_operations text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL
);

CREATE TABLE mutants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  alias text NOT NULL,
  status text NOT NULL,
  power_description text NOT NULL,
  biography text NOT NULL,
  image_url text NOT NULL
);

CREATE TABLE teams_mutants (
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  mutant_id uuid NOT NULL REFERENCES mutants(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, mutant_id)
);