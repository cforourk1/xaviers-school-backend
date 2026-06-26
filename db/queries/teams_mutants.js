// remove mutant from team
export async function deleteTeamMutant(teamId, mutantId) {
  const sql = `
  DELETE FROM teams_mutants
  WHERE team_id = $1 AND mutant_id = $2
  RETURNING *
  `;
  const { rows: [teamMutant] } = await db.query(sql, [teamId, mutantId]);
  return teamMutant;
}