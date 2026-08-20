interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

declare const process: {
  argv: string[];
};

export const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
): Result => {
  const periodLength = dailyExerciseHours.length;

  const trainingDays = dailyExerciseHours.filter(
    (hours) => hours > 0
  ).length;

  const totalHours = dailyExerciseHours.reduce(
    (sum, hours) => sum + hours,
    0
  );

  const average = totalHours / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "great job, you reached your target";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "bad, you should exercise more";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  throw new Error(
    "Please provide a target and at least one day of exercise hours."
  );
}

const target = Number(args[0]);

const dailyExerciseHours = args.slice(1).map(Number);

// Check that all arguments are valid numbers
if (
  isNaN(target) ||
  dailyExerciseHours.some((hours: number) => isNaN(hours))
) {
  throw new Error("All arguments must be numbers.");
}

// Calculate and print the result
console.log(
  calculateExercises(dailyExerciseHours, target)
);