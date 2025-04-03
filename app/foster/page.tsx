import { redirect } from "next/navigation";

export default function FosterPage() {
  redirect("/animals");
  // This line will never be reached
  return null;
}