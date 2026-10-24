import { z } from "zod";

const money = z.coerce.number().finite().positive().max(100_000_000);
const text = (min, max) => z.string().trim().min(min).max(max);
const optional = (max) => z.string().trim().max(max).optional().default("");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const organizer = z.object({
  kind: z.enum(["individual", "organization"]),
  name: text(2, 100),
  organizationName: optional(150),
}).superRefine((value, context) => {
  if (value.kind === "organization" && !value.organizationName) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["organizationName"], message: "Organisation name is required" });
  }
});

const event = z.object({
  name: optional(100),
  type: text(1, 50),
  typeOther: optional(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  country: text(2, 100),
  state: optional(100),
  location: optional(100),
  pincode: text(3, 20),
  venue: optional(150),
}).superRefine((value, context) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (value.startDate < today) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["startDate"], message: "Event date cannot be in the past" });
  }
  if (value.endDate < value.startDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["endDate"], message: "End date must be on or after start date" });
  }
});

const base = z.object({ notes: optional(2_000) });
const planner = base.extend({
  budgetMin: money,
  budgetMax: money,
  guests: z.coerce.number().int().positive().max(1_000_000),
  services: z.array(text(1, 50)).min(1).max(30),
  style: optional(100),
  experience: z.enum(["any", "2+ yrs", "5+ yrs"]).optional(),
  deadline: z.coerce.date().optional(),
}).refine((value) => value.budgetMax >= value.budgetMin, { path: ["budgetMax"], message: "Maximum budget must be greater than minimum budget" });

const performer = base.extend({
  performerType: text(1, 50),
  performerTypeOther: optional(100),
  genre: text(1, 100),
  duration: time,
  budget: money,
  audience: z.coerce.number().int().positive().max(1_000_000).optional(),
  equipment: z.enum(["yes", "no"]).optional(),
  language: optional(50),
  languageOther: optional(50),
  stageRequirements: optional(1_000),
});

const crew = base.extend({
  roles: z.array(text(1, 50)).min(1).max(30),
  crewCount: z.coerce.number().int().positive().max(10_000),
  dayBudget: money,
  shiftStart: time.optional().or(z.literal("")),
  shiftEnd: time.optional().or(z.literal("")),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"]).optional(),
  transport: z.enum(["yes", "no"]).optional(),
  meals: z.enum(["yes", "no"]).optional(),
});

const requirement = (category, details) => z.object({ category: z.literal(category), organizer, event, details });

export const requirementSchema = z.discriminatedUnion("category", [
  requirement("planner", planner),
  requirement("performer", performer),
  requirement("crew", crew),
]);
