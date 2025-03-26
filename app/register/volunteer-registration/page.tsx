"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const referralSources = [
  { value: "social-media", label: "Social Media" },
  { value: "friend", label: "Friend/Family" },
  { value: "website", label: "Website" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
] as const;

// Create a new validation schema
const volunteerFormSchema = z.object({
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
      required_error: "ZIP code is required",
    }).regex(/^\d{5}(-\d{4})?$/, {
      message: "Please enter a valid ZIP code.",
    }),
  }),
  aboutYourself: z.string().min(10, {
    message: "Please tell us about yourself (minimum 10 characters).",
  }),
  referralSource: z.enum(["social-media", "friend", "website", "event", "other"], {
    required_error: "Please select how you heard about us.",
  }),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

// Add this action to handle form submission
const submitVolunteerForm = async (data: VolunteerFormValues) => {
  "use server";
  
  try {
    // Add your form submission logic here
    // For example, saving to a database
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit form. Please try again." };
  }
};

export default function VolunteerRegistrationPage() {
  const router = useRouter();
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      aboutYourself: "",
      referralSource: "social-media",
    },
  });

  const onSubmit = async (data: VolunteerFormValues) => {
    try {
      const result = await submitVolunteerForm(data);
      
      if (result.success) {
        toast.success("Registration submitted successfully!");
        router.push("/volunteer/thank-you");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Volunteer Registration</h1>
            <p className="text-muted-foreground mt-2">Join our mission to help animals in need</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* About Yourself */}
              <FormField
                control={form.control}
                name="aboutYourself"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us About Yourself *</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* How did you hear about us */}
              <FormField
                control={form.control}
                name="referralSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {referralSources.map((source) => (
                          <FormItem
                            key={source.value}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={source.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {source.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Submit Application</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}