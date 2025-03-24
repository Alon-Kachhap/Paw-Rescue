"use client";
import React from 'react';

const DonatePage: React.FC = () => {
  const handleDonate = (event: React.FormEvent) => {
    event.preventDefault();
    alert('Thank you for your donation!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div
        className="bg-card text-card-foreground shadow-lg rounded-lg p-8 w-full max-w-md border"
        style={{ borderRadius: 'var(--radius)' }}
      >
        <h1 className="text-2xl font-bold text-center mb-4">Donate to Our Cause</h1>
        <p className="text-muted-foreground text-center mb-6">
          Your support helps us make a difference. Every contribution counts!
        </p>
        <form onSubmit={handleDonate} className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Donation Amount:
            </label>
            <input
            //   type="number"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-muted transition duration-200"
            style={{ borderRadius: 'var(--radius)' }}
          >
            Donate
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonatePage;