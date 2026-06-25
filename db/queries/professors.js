import db from "#db/client";

// create professor
export async function createProfessor(name, contactEmail, biography, imageUrl, departmentId) {
  const sql = `
  INSERT INTO professors (name, contact_email, biography, image_url, department_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
  `;
  const { rows: [professor] } = await db.query(sql, [name, contactEmail, biography, imageUrl, departmentId]);
  return professor;
}

// get all professors
export async function getProfessors() {
  const sql = `
  SELECT *
  FROM professors
  `;
  const { rows: professors } = await db.query(sql);
  return professors;
}

// get professor by id with their department
export async function getProfessorById(id) {
  const sql = `
  SELECT professors.*, departments.name AS department_name
  FROM professors
  JOIN departments ON professors.department_id = departments.id
  WHERE professors.id = $1
  `;
  const { rows: [professor] } = await db.query(sql, [id]);
  return professor;
}