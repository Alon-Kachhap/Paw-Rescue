import * as z from "zod";

export const organizationFormSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  orgType: z.string().min(1, "Please select an organization type"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  website: z.string().url().optional().or(z.literal("")),
  mission: z.string().min(10, "Mission statement must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
  }),
  document: z.any().optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;