import express from "express";
import { createTeam, getTeamById, getTeams, getTeamWithMutants } from "#db/queries/teams";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

// get all teams - public
router.get("/", async (req, res) => {
  const teams = await getTeams();
  res.send(teams);
});

// get team by id with mutants - public
router.param("id", async (req, res, next, id) => {
  const team = await getTeamById(id);
  if (!team) return res.status(404).send("Team not found.");
  req.team = team;
  next();
});

router.get("/:id", async (req, res) => {
  const team = await getTeamWithMutants(req.team.id);
  res.send(team);
});

// protected admin routes below
router.post("/", requireUser, requireBody(["name", "base_of_operations", "description", "image_url"]), async (req, res) => {
  const { name, base_of_operations, description, image_url } = req.body;
  const team = await createTeam(name, base_of_operations, description, image_url);
  res.status(201).send(team);
});