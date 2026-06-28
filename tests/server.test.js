import app from "#app";
import db from "#db/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";

// regular user token — can create things but not edit seeded data
let token;
// admin token — ProfessorX, can edit and delete anything
let adminToken;
let lastTeam;
let lastMutant;

beforeAll(async () => {
  await db.connect();
  await db.query("BEGIN");

  const { rows: [team] } = await db.query("SELECT * FROM teams ORDER BY name DESC LIMIT 1");
  lastTeam = team;

  const { rows: [mutant] } = await db.query("SELECT * FROM mutants ORDER BY name DESC LIMIT 1");
  lastMutant = mutant;

  // log in as ProfessorX (seeded admin) to get admin token
  const adminLogin = await request(app).post("/users/login").send({
    username: "ProfessorX",
    password: "MarkWishesHeWereProfX",
  });
  adminToken = adminLogin.text;
});

afterAll(async () => {
  await db.query("ROLLBACK");
  await db.end();
});

// ══════════════════
// USERS
// ══════════════════
describe("users", () => {
  describe("POST /users/register", () => {
    it("creates a new user and sends back a token", async () => {
      const response = await request(app).post("/users/register").send({
        username: "testmutant99",
        password: "password",
      });
      expect(response.status).toBe(201);
      expect(response.text).toMatch(/\w+\.\w+\.\w+/);
    });

    it("hashes the password of the created user", async () => {
      const { rows: [user] } = await db.query(
        "SELECT password FROM users WHERE username = 'testmutant99'"
      );
      expect(user.password).not.toBe("password");
    });

    it("sends 400 if request body is missing required fields", async () => {
      const response = await request(app).post("/users/register").send({});
      expect(response.status).toBe(400);
    });
  });

  describe("POST /users/login", () => {
    it("sends a token if correct credentials are provided", async () => {
      const response = await request(app).post("/users/login").send({
        username: "testmutant99",
        password: "password",
      });
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/\w+\.\w+\.\w+/);
      // store regular user token for use in later tests
      token = response.text;
    });

    it("sends 401 if incorrect credentials are provided", async () => {
      const response = await request(app).post("/users/login").send({
        username: "testmutant99",
        password: "wrongpassword",
      });
      expect(response.status).toBe(401);
    });

    it("sends 400 if request body is missing required fields", async () => {
      const response = await request(app).post("/users/login").send({});
      expect(response.status).toBe(400);
    });
  });

  describe("GET /users/me", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).get("/users/me");
      expect(response.status).toBe(401);
    });

    it("sends the current user object when logged in", async () => {
      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("username", "testmutant99");
    });

    it("includes the role field", async () => {
      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("role");
    });
  });
});

// ══════════════════
// TEAMS
// ══════════════════
describe("teams", () => {
  test("GET /teams sends array of all teams", async () => {
    const { rows: teams } = await db.query("SELECT * FROM teams");
    const response = await request(app).get("/teams");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(teams.length);
  });

  describe("GET /teams/:id", () => {
    it("sends 404 if team does not exist", async () => {
      const response = await request(app).get("/teams/00000000-0000-0000-0000-000000000000");
      expect(response.status).toBe(404);
    });

    it("sends the team with its mutants", async () => {
      const response = await request(app).get("/teams/" + lastTeam.id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", lastTeam.id);
      expect(response.body).toHaveProperty("mutants");
    });
  });

  describe("POST /teams", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).post("/teams").send({
        name: "New Team",
        base_of_operations: "Somewhere",
        description: "A new team",
        image_url: "/images/test.jpg",
      });
      expect(response.status).toBe(401);
    });

    it("sends 400 if request body is missing required fields", async () => {
      const response = await request(app)
        .post("/teams")
        .send({})
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
    });

    it("creates a new team", async () => {
      const response = await request(app)
        .post("/teams")
        .send({
          name: "New Mutant Team",
          base_of_operations: "Test Location",
          description: "A brand new test team",
          image_url: "/images/test.jpg",
        })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("New Mutant Team");
    });
  });

  describe("PUT /teams/:id", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).put("/teams/" + lastTeam.id).send({
        name: "Updated",
        base_of_operations: "Updated",
        description: "Updated",
        image_url: "/images/test.jpg",
      });
      expect(response.status).toBe(401);
    });

    it("sends 403 if regular user tries to edit a seeded team", async () => {
      const response = await request(app)
        .put("/teams/" + lastTeam.id)
        .send({
          name: "Hacked",
          base_of_operations: "Hacked",
          description: "Hacked",
          image_url: "/images/test.jpg",
        })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("updates the team as admin", async () => {
      const response = await request(app)
        .put("/teams/" + lastTeam.id)
        .send({
          name: "Updated Team Name",
          base_of_operations: "Updated Location",
          description: "Updated description",
          image_url: "/images/updated.jpg",
        })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Team Name");
    });
  });

  describe("DELETE /teams/:id", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).delete("/teams/" + lastTeam.id);
      expect(response.status).toBe(401);
    });

    it("deletes the team as admin", async () => {
      const { rows: [newTeam] } = await db.query(
        "INSERT INTO teams (name, base_of_operations, description, image_url) VALUES ('Temp Team', 'Temp', 'Temp', '/images/temp.jpg') RETURNING *"
      );
      const response = await request(app)
        .delete("/teams/" + newTeam.id)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(204);
    });
  });
});

// ══════════════════
// MUTANTS
// ══════════════════
describe("mutants", () => {
  test("GET /mutants sends array of all mutants", async () => {
    const { rows: mutants } = await db.query("SELECT * FROM mutants");
    const response = await request(app).get("/mutants");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(mutants.length);
  });

  describe("GET /mutants/:id", () => {
    it("sends 404 if mutant does not exist", async () => {
      const response = await request(app).get("/mutants/00000000-0000-0000-0000-000000000000");
      expect(response.status).toBe(404);
    });

    it("sends the specific mutant", async () => {
      const response = await request(app).get("/mutants/" + lastMutant.id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", lastMutant.id);
    });
  });

  describe("POST /mutants", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).post("/mutants").send({
        name: "Test Mutant",
        alias: "Tester",
        status: "active",
        power_description: "Testing powers",
        biography: "A test mutant",
        image_url: "/images/test.jpg",
      });
      expect(response.status).toBe(401);
    });

    it("sends 400 if request body is missing required fields", async () => {
      const response = await request(app)
        .post("/mutants")
        .send({})
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
    });

    it("creates a new mutant", async () => {
      const response = await request(app)
        .post("/mutants")
        .send({
          name: "Test Mutant",
          alias: "Tester",
          status: "active",
          power_description: "Testing powers",
          biography: "A test mutant for testing purposes",
          image_url: "/images/test.jpg",
        })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.alias).toBe("Tester");
      // created_by should be set to the logged in user
      expect(response.body).toHaveProperty("created_by");
    });
  });

  describe("PUT /mutants/:id", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).put("/mutants/" + lastMutant.id).send({
        name: "Updated",
        alias: "Updated",
        status: "active",
        power_description: "Updated",
        biography: "Updated",
        image_url: "/images/test.jpg",
      });
      expect(response.status).toBe(401);
    });

    it("sends 403 if regular user tries to edit a seeded mutant", async () => {
      const response = await request(app)
        .put("/mutants/" + lastMutant.id)
        .send({
          name: "Hacked",
          alias: "Hacked",
          status: "active",
          power_description: "Hacked",
          biography: "Hacked",
          image_url: "/images/test.jpg",
        })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("updates the mutant as admin", async () => {
      const response = await request(app)
        .put("/mutants/" + lastMutant.id)
        .send({
          name: "Updated Mutant",
          alias: "Updated Alias",
          status: "active",
          power_description: "Updated powers",
          biography: "Updated biography",
          image_url: "/images/updated.jpg",
        })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.alias).toBe("Updated Alias");
    });
  });

  describe("DELETE /mutants/:id", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app).delete("/mutants/" + lastMutant.id);
      expect(response.status).toBe(401);
    });

    it("deletes the mutant as admin", async () => {
      const { rows: [newMutant] } = await db.query(
        "INSERT INTO mutants (name, alias, status, power_description, biography, image_url) VALUES ('Temp', 'Temp', 'active', 'Temp', 'Temp', '/images/temp.jpg') RETURNING *"
      );
      const response = await request(app)
        .delete("/mutants/" + newMutant.id)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(204);
    });
  });
});

// ══════════════════
// TEAMS_MUTANTS
// ══════════════════
describe("teams/:id/mutants", () => {
  describe("POST /teams/:id/mutants", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app)
        .post("/teams/" + lastTeam.id + "/mutants")
        .send({ mutantId: lastMutant.id });
      expect(response.status).toBe(401);
    });

    it("sends 403 if regular user tries to add mutant to team", async () => {
      const response = await request(app)
        .post("/teams/" + lastTeam.id + "/mutants")
        .send({ mutantId: lastMutant.id })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("adds a mutant to a team as admin", async () => {
      const { rows: [newMutant] } = await db.query(
        "INSERT INTO mutants (name, alias, status, power_description, biography, image_url) VALUES ('Junction Test', 'JT', 'active', 'Testing', 'Testing junction', '/images/test.jpg') RETURNING *"
      );
      const response = await request(app)
        .post("/teams/" + lastTeam.id + "/mutants")
        .send({ mutantId: newMutant.id })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("team_id", lastTeam.id);
      expect(response.body).toHaveProperty("mutant_id", newMutant.id);
    });
  });

  describe("DELETE /teams/:id/mutants/:mutantId", () => {
    it("sends 401 if user is not logged in", async () => {
      const response = await request(app)
        .delete("/teams/" + lastTeam.id + "/mutants/" + lastMutant.id);
      expect(response.status).toBe(401);
    });
  });
});
