import express from "express";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();

app.use(express.json());

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (
    !req.query.height ||
    !req.query.weight ||
    isNaN(height) ||
    isNaN(weight)
  ) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  return res.send({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const { daily_exercises, target }: any = req.body;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).send({
      error: "parameters missing",
    });
  }

  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.length === 0 ||
    daily_exercises.some((value) => isNaN(Number(value))) ||
    isNaN(Number(target))
  ) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  const result = calculateExercises(
    daily_exercises.map((value) => Number(value)),
    Number(target)
  );

  return res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});