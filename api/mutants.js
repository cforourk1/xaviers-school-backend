import express from "express";
import { getMutants, getMutantById, createMutant, updateMutant, deleteMutant, getTeamsByMutantId } from "#db/queries/mutants";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

// get all mutants
router.get("/", async (req, res) => {
  const mutants = await getMutants();
  res.send(mutants);
});

// router.param handles lookup and 404 for all /:id routes
router.param("id", async (req, res, next, id) => {
  const mutant = await getMutantById(id);
  if (!mutant) return res.status(404).send("Mutant not found.");
  req.mutant = mutant;
  next();
});

// get single mutant with team info
router.get("/:id", (req, res) => {
  res.send(req.mutant);
});

// create new mutant
router.post("/", requireUser, requireBody(["name", "alias", "status", "power_description", "biography", "image_url"]), async (req, res) => {
  const { name, alias, status, power_description, biography, image_url } = req.body;
  const mutant = await createMutant(name, alias, status, power_description, biography, image_url);
  res.status(201).send(mutant);
});

/*
put /:id - updates an existing mutant and requires login
requireBody checks that all the required fields are in the request.
destructure those fields out of req.body
call updateMutant function to run the SQL update in the db
send the updated mutant back as the response.
*/
router.put("/:id", requireUser, requireBody(["name", "alias", "status", "power_description", "biography", "image_url"]), async (req, res) => {
  const { name, alias, status, power_description, biography, image_url } = req.body;
  const mutant = await updateMutant(req.mutant.id, name, alias, status, power_description, biography, image_url);
  res.send(mutant);
});


// get all teams a mutant belongs to

router.get("/:id/teams" , async (req, res) => {
  const teams = await getTeamsByMutantId(req.mutant.id);
  res.send(teams);
});





/* delete a mutant - requires user login
*/
router.delete("/:id", requireUser, async (req, res) => {
  await deleteMutant(req.mutant.id);
  res.sendStatus(204);
});