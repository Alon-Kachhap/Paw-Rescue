import * as z from "zod";

export const volunteerFormSchema = z.object({
  // Move the schema here from the page file
});

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;