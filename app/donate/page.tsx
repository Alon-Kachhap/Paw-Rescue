"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DonatePage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const scrollToContent = () => {
    document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax */}
      <section className="relative h-[610px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/donate-hero.jpg')",
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-white mb-8"
          >
            Donate
          </motion.h1>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={scrollToContent}
            className="mt-12 p-4 rounded-full bg-primary/80 hover:bg-primary text-white transition-colors animate-bounce"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="start" className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Donations save lives!</h2>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Paw Rescue depends solely on donations for the general functioning and upkeep of the facilities. 
              Running our facilities costs approximately INR 12 Lakh (USD 15,000) per month and every donation makes a difference.
            </p>
            <p>
              As we are registered under the Indian Trust Act, and granted certification as a charity organization 
              under section 12A(a) of the Income Tax Act, 1961, all donations are tax exempted under section 80G 
              of the Income Tax Act.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">Donation Options</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Online Payment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <Image
                  src="/images/payment-online.jpg"
                  alt="Online Payment"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 rounded-br">
                  Indian ₹
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Online Payment</h3>
                <p className="text-muted-foreground mb-4">
                  Donate securely using credit/debit cards, UPI, or net banking
                </p>
                <Link 
                  href="/donate/online"
                  className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Donate Now
                </Link>
              </div>
            </motion.div>

            {/* Similar cards for other donation options */}
            {/* Add Bank Transfer, Cheque/DD, and International Donation cards */}
          </div>
        </div>
      </section>

      {/* Donation Information Tables */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Donation Information</h2>
          
          {/* Monthly Expenses Table */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-left">Purpose</th>
                    <th className="p-4 text-right">Amount (INR)</th>
                    <th className="p-4 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add table rows with expense data */}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Additional tables for utilization and asset donations */}
        </div>
      </section>
    </div>
  );
}