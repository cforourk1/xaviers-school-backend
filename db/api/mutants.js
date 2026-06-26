import express from "express";
import { getMutants, getMutantById } from "#db/queries/mutants";

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
