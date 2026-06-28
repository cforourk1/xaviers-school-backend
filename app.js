import morgan from "morgan";
import express from "express";
import cors from "cors";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import teamsRouter from "#api/teams";
import mutantsRouter from "#api/mutants";


const app = express();
export default app;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: /localhost/ }));
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/teams", teamsRouter);
app.use("/mutants", mutantsRouter);
app.use("/images", express.static("public/images"));

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});


