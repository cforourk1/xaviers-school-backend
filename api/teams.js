import express from "express";
import { createTeam, getTeamById, getTeams, getTeamWithMutants, updateTeam, deleteTeam } from "#db/queries/teams";
import { createTeamMutant, deleteTeamMutant } from "#db/queries/teams_mutants";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

// get all teams - public
router.get("/", async (req, res) => {
  const teams = await getTeams();
  res.send(teams);
});

// router.param handles lookup and 404 for all /:id routes
router.param("id", async (req, res, next, id) => {
  const team = await getTeamById(id);
  if (!team) return res.status(404).send("Team not found.");
  req.team = team;
  next();
});

// get single team with mutants - public
router.get("/:id", async (req, res) => {
  const team = await getTeamWithMutants(req.team.id);
  res.send(team);
});

// create new team - stores req.user.id as created_by
router.post("/", requireUser, requireBody(["name", "base_of_operations", "description", "image_url"]), async (req, res) => {
  const { name, base_of_operations, description, image_url } = req.body;
  const team = await createTeam(name, base_of_operations, description, image_url, req.user.id);
  res.status(201).send(team);
});

// update team - only allowed if user is admin OR they created the team
router.put("/:id", requireUser, requireBody(["name", "base_of_operations", "description", "image_url"]), async (req, res) => {
  if (req.user.role !== 'admin' && req.team.created_by !== req.user.id) {
    return res.status(403).send("Forbidden.");
  }
  const { name, base_of_operations, description, image_url } = req.body;
  const team = await updateTeam(req.team.id, name, base_of_operations, description, image_url);
  res.send(team);
});

// delete team - only allowed if user is admin OR they created the team
router.delete("/:id", requireUser, async (req, res) => {
  if (req.user.role !== 'admin' && req.team.created_by !== req.user.id) {
    return res.status(403).send("Forbidden.");
  }
  await deleteTeam(req.team.id);
  res.sendStatus(204);
});

// add mutant to team - admin only
router.post("/:id/mutants", requireUser, requireBody(["mutantId"]), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send("Forbidden.");
  const { mutantId } = req.body;
  const teamMutant = await createTeamMutant(req.team.id, mutantId);
  res.status(201).send(teamMutant);
});

// remove mutant from team - admin only
router.delete("/:id/mutants/:mutantId", requireUser, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send("Forbidden.");
  await deleteTeamMutant(req.team.id, req.params.mutantId);
  res.sendStatus(204);
});