import db from "#db/client";

// create mutant
export async function createMutant(name, alias, status, powerDescription, biography,  imageUrl) {
  const sql = `
  INSERT INTO mutants (name, alias, status, power_description, biography, image_url)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
  `;
  const { rows: [mutant] } = await db.query(sql, [name, alias, status, powerDescription, biography, imageUrl]);
  return mutant;
}

// get all mutants
export async function getMutants() {
  const sql = `
  SELECT *
  FROM mutants
  `;
  const { rows: mutants } = await db.query(sql);
  return mutants;
}

// get mutant by id with their team
export async function getMutantById(id) {
  const sql = `
  SELECT mutants.*, teams.name AS team_name
  FROM mutants
  JOIN teams ON mutants.team_id = teams.id
  WHERE mutants.id = $1
  `;
  const { rows: [mutant] } = await db.query(sql, [id]);
  return mutant;
}

// update mutant
export async function updateMutant(id, name, alias, status, powerDescription, biography, imageUrl) {
  const sql = `
  UPDATE mutants
  SET name = $1, alias = $2, status = $3, power_description = $4, biography = $5, image_url = $6
  WHERE id = $7
  RETURNING *
  `;
  const { rows: [mutant] } = await db.query(sql, [name, alias, status, powerDescription, biography, imageUrl, id]);
  return mutant;
}

// delete mutant
export async function deleteMutant(id) {
  const sql = `
  DELETE FROM mutants
  WHERE id = $1
  RETURNING *
  `;
  const { rows: [mutant] } = await db.query(sql, [id]);
  return mutant;
}