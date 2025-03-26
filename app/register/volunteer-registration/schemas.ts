import * as z from "zod";

export const volunteerFormSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
  }).min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string({
    required_error: "Last name is required",
  }).min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string({
    required_error: "Email is required",
  }).email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string({
    required_error: "Phone number is required",
  }).regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number.",
  }),
  address: z.object({
    street: z.string({
      required_error: "Street address is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),
    state: z.string({
      required_error: "State is required",
    }),
    zip: z.string({
      required_error: "PIN code is required",
    }).regex(/^[1-9][0-9]{5}$/, {
      message: "Please enter a valid 6-digit PIN code",
    }),
  }),
  aboutYourself: z.string().min(10, {
    message: "Please tell us about yourself (minimum 10 characters).",
  }),
  referralSource: z.enum(["social-media", "friend", "website", "event", "other"], {
    required_error: "Please select how you heard about us",
  }),
});