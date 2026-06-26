import db from "#db/client";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.end();
});

// ══════════════════
// SCHEMA TESTS
// ══════════════════
describe("Database schema", () => {

  test("users table is created with correct columns and constraints", async () => {
    const columns = await getColumns("users");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "username", data_type: "text", is_nullable: "NO" },
        { column_name: "password", data_type: "text", is_nullable: "NO" },
      ])
    );

    const isUsernameUnique = await isColumnConstrained("users", "username", "unique");
    expect(isUsernameUnique).toBe(true);
  });

  test("teams table is created with correct columns", async () => {
    const columns = await getColumns("teams");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "name", data_type: "text", is_nullable: "NO" },
        { column_name: "base_of_operations", data_type: "text", is_nullable: "NO" },
        { column_name: "description", data_type: "text", is_nullable: "NO" },
        { column_name: "image_url", data_type: "text", is_nullable: "NO" },
      ])
    );
  });

  test("mutants table is created with correct columns", async () => {
    const columns = await getColumns("mutants");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "name", data_type: "text", is_nullable: "NO" },
        { column_name: "alias", data_type: "text", is_nullable: "NO" },
        { column_name: "status", data_type: "text", is_nullable: "NO" },
        { column_name: "power_description", data_type: "text", is_nullable: "NO" },
        { column_name: "biography", data_type: "text", is_nullable: "NO" },
        { column_name: "image_url", data_type: "text", is_nullable: "NO" },
      ])
    );
  });

  test("teams_mutants table is created with correct columns and constraints", async () => {
    const columns = await getColumns("teams_mutants");
    expect(columns).toEqual(
      expect.arrayContaining([
        { column_name: "team_id", data_type: "uuid", is_nullable: "NO" },
        { column_name: "mutant_id", data_type: "uuid", is_nullable: "NO" },
      ])
    );

    const isTeamIdForeignKey = await isColumnConstrained("teams_mutants", "team_id", "foreign key");
    expect(isTeamIdForeignKey).toBe(true);

    const isMutantIdForeignKey = await isColumnConstrained("teams_mutants", "mutant_id", "foreign key");
    expect(isMutantIdForeignKey).toBe(true);

    const isTeamIdPrimaryKey = await isColumnConstrained("teams_mutants", "team_id", "primary key");
    const isMutantIdPrimaryKey = await isColumnConstrained("teams_mutants", "mutant_id", "primary key");
    expect(isTeamIdPrimaryKey && isMutantIdPrimaryKey).toBe(true);
  });
});

// ══════════════════
// SEED TESTS
// ══════════════════
describe("Database is seeded with", () => {
  test("at least 1 user", async () => {
    const { rows: [user] } = await db.query("SELECT * FROM users");
    expect(user).toBeDefined();
  });

  test("at least 3 teams", async () => {
    const { rowCount } = await db.query("SELECT * FROM teams");
    expect(rowCount).toBeGreaterThanOrEqual(3);
  });

  test("at least 5 mutants", async () => {
    const { rowCount } = await db.query("SELECT * FROM mutants");
    expect(rowCount).toBeGreaterThanOrEqual(5);
  });

  test("at least 1 mutant assigned to a team", async () => {
    const { rowCount } = await db.query("SELECT * FROM teams_mutants");
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  test("at least 1 mutant on multiple teams", async () => {
    const { rows } = await db.query(`
      SELECT mutant_id, COUNT(*) as team_count
      FROM teams_mutants
      GROUP BY mutant_id
      HAVING COUNT(*) > 1
    `);
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });
});

// ══════════════════
// HELPER FUNCTIONS
// ══════════════════
async function getColumns(table) {
  const sql = `
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = $1
  `;
  const { rows } = await db.query(sql, [table]);
  return rows;
}

async function isColumnConstrained(table, column, constraint) {
  const sql = `
  SELECT *
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON kcu.constraint_name = tc.constraint_name
  WHERE
    tc.table_name = $1
    AND kcu.column_name = $2
    AND tc.constraint_type ilike $3
  `;
  const { rowCount } = await db.query(sql, [table, column, constraint]);
  return rowCount > 0;
}
