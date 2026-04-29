type BreInput = {
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: string;
};

type BreResult = {
  passed: boolean;
  reasons: string[];
};

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const calculateAge = (dob: string): number => {
  const birth = new Date(dob);
  const today = new Date();

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const monthDiff =
    today.getMonth() -
    birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 &&
      today.getDate() <
        birth.getDate())
  ) {
    age--;
  }

  return age;
};

export const runBRE = (
  input: BreInput
): BreResult => {
  const reasons: string[] = [];

  const pan = input.pan.trim().toUpperCase();

  if (!PAN_REGEX.test(pan)) {
    reasons.push(
      "Invalid PAN format"
    );
  }

  const age = calculateAge(input.dob);

  if (Number.isNaN(age)) {
    reasons.push(
      "Valid date of birth is required"
    );
  } else if (age < 23 || age > 50) {
    reasons.push(
      "Age must be between 23 and 50"
    );
  }

  if (input.monthlySalary < 25000) {
    reasons.push(
      "Monthly salary must be at least ₹25,000"
    );
  }

  if (
    input.employmentMode ===
    "UNEMPLOYED"
  ) {
    reasons.push(
      "Unemployed applicants are not eligible"
    );
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
};
