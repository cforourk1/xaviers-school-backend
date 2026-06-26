import db from "#db/client";

// adds a mutant to a team via junction table
export async function createTeamMutant(teamId, mutantId) {
  const sql = `
  INSERT INTO teams_mutants (team_id, mutant_id)
  VALUES ($1, $2)
  RETURNING *
  `;
  const { rows: [teamMutant] } = await db.query(sql, [teamId, mutantId]);
  return teamMutant;
}