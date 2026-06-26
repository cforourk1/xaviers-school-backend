import express from "express";
import { getDepartmentsByProfessorId } from "#db/queries/teams";
import { getProfessors, getProfessorById } from "#db/queries/mutants";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

//get Professors
router.get("/", async (req, res) => {
  const professors = await getProfessors();
  res.send(Professors);
});


//get Professor by its id number
router.param("id", async (req, res, next, id) => {
  const professor = await getProfessorById(id);
  if (!professor) return res.status(404).send("Professor not found.");
  req.professor = professor;
  next();
});

//get Departments associated with that Professor id
router.get("/:id", (req, res) => {
  res.send(req.professor);
});

router.get("/:id/Departments", requireUser, async (req, res) => {
  const departments = await getDepartmentsByProfessorId(req.Professor.id, req.user.id);
  res.send(departments);
});
