import express from "express";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";
const router = express.Router();
export default router;

// register a new user
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  },
);

// post body requiremments and error handling for username and pass
router.post("/login", requireBody(["username", "password"]), async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsernameAndPassword(username, password);
  if (!user) return res.status(401).send("Invalid username or password.");
  const token = createToken({ id: user.id });
  res.send(token);
});


// get the currently logged in user - requires token
router.get("/me", requireUser, async (req, res) => {
  res.send(req.user);
});