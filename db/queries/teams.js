import db from "#db/client";

// create team
export async function createTeam(name, baseOfOperations, description, imageUrl) {
  const sql = `
  INSERT INTO teams (name, base_of_operations, description, image_url)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const { rows: [team] } = await db.query(sql, [name, baseOfOperations, description, imageUrl]);
  return team;
}

// get all teams
export async function getTeams() {
  const sql = `
  SELECT *
  FROM teams
  `;
  const { rows: teams } = await db.query(sql);
  return teams;
}

// get team by id
export async function getTeamById(id) {
  const sql = `
  SELECT *
  FROM teams
  WHERE id = $1
  `;
  const { rows: [team] } = await db.query(sql, [id]);
  return team;
}

// get team with all its mutants
export async function getTeamWithMutants(id) {
  const sql = `
  SELECT teams.*, json_agg(mutants) AS mutants
  FROM teams
  LEFT JOIN mutants ON mutants.team_id = teams.id
  WHERE teams.id = $1
  GROUP BY teams.id
  `;
  const { rows: [team] } = await db.query(sql, [id]);
  return team;
}

