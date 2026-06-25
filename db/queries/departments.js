import db from "#db/client";

// create department
export async function createDepartment(name, contactEmail, description, imageUrl) {
  const sql = `
  INSERT INTO departments (name, contact_email, description, image_url)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const { rows: [department] } = await db.query(sql, [name, contactEmail, description, imageUrl]);
  return department;
}

// get all departments
export async function getDepartments() {
  const sql = `
  SELECT *
  FROM departments
  `;
  const { rows: departments } = await db.query(sql);
  return departments;
}

// get department by id
export async function getDepartmentById(id) {
  const sql = `
  SELECT *
  FROM departments
  WHERE id = $1
  `;
  const { rows: [department] } = await db.query(sql, [id]);
  return department;
}

// get department with all its professors
export async function getDepartmentWithProfessors(id) {
  const sql = `
  SELECT departments.*, json_agg(professors) AS professors
  FROM departments
  LEFT JOIN professors ON professors.department_id = departments.id
  WHERE departments.id = $1
  GROUP BY departments.id
  `;
  const { rows: [department] } = await db.query(sql, [id]);
  return department;
}