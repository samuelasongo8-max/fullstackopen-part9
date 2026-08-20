const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2; 

if (bmi < 18.5) {
    return "Underweight";
} else if (bmi < 25) {
    return "Normal weight";
} else if (bmi <= 29.9) {
    return "Overweight";
} else {
    return "Obese";
}
};

declare const process: { argv: string[] };
const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

if (isNaN(height) || isNaN(weight)) {
 throw new Error("Please provide height and weight as numbers.");
}

console.log(calculateBmi(height, weight));

export default calculateBmi;