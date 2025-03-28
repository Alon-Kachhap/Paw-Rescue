"use client";

import { useState } from "react";
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
import { volunteerFormSchema } from "./schemas";
import { Loader2 } from "lucide-react";

const referralSources = [
  { value: "social-media", label: "Social Media" },
  { value: "friend", label: "Friend/Family" },
  { value: "website", label: "Website" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
] as const;

const normalizeReferral = (input: string) => {
  return input.replace("-", "_") as
    | "social_media"
    | "friend"
    | "website"
    | "event"
    | "other";
};

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export default function VolunteerRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
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
    setLoading(true);
    try {
      const response = await fetch("/api/volunteer-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          zip: data.address.zip,
          aboutYourself: data.aboutYourself,
          referral: normalizeReferral(data.referralSource),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Something went wrong");
      } else {
        toast.success("Registration submitted successfully!");
        router.push("/volunteer/thank-you");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Volunteer Registration
            </h1>
            <p className="text-muted-foreground mt-2">
              Join our mission to help animals in need
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl><Input type="tel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <FormField control={form.control} name="address.street" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="address.city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="address.state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="address.zip" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code *</FormLabel>
                      <FormControl><Input placeholder="Enter 6-digit PIN code" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="aboutYourself" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell us About Yourself *</FormLabel>
                  <FormControl><Textarea rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="referralSource" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How did you hear about us? *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                      {referralSources.map((source) => (
                        <div key={source.value} className="flex items-center space-x-2">
                          <RadioGroupItem id={source.value} value={source.value} />
                          <FormLabel htmlFor={source.value} className="font-normal cursor-pointer">
                            {source.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}