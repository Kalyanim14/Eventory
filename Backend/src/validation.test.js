import { requirementSchema } from "./validation.js";

const valid = {
  category: "performer",
  event: { name: "Riya and Arjun's Sangeet", type: "Wedding", startDate: "2027-01-12", endDate: "2027-01-12", location: "Hyderabad" },
  details: { performerType: "DJ", genre: "Bollywood", duration: 120, budget: 50000 }
};

test("accepts a valid category-specific requirement", () => {
  expect(requirementSchema.safeParse(valid).success).toBe(true);
});

test("rejects end dates before the start", () => {
  expect(requirementSchema.safeParse({ ...valid, event: { ...valid.event, endDate: "2027-01-01" } }).success).toBe(false);
});

test("rejects a performer payload with a negative budget", () => {
  expect(requirementSchema.safeParse({ ...valid, details: { ...valid.details, budget: -1 } }).success).toBe(false);
});
