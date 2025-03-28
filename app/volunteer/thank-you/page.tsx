"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/"); // Redirect home after 5 seconds
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card text-center p-10 rounded-2xl shadow-lg max-w-md w-full"
      >
        <motion.div
          initial={{ rotate: -30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Thank You!</h1>
        <p className="text-muted-foreground">
          Your volunteer application has been submitted successfully. We'll get in touch soon!
        </p>
        <p className="mt-4 text-sm text-muted-foreground">Redirecting to home...</p>
      </motion.div>
    </div>
  );
}