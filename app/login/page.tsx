"use client";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [loginType, setLoginType] = useState<"volunteer" | "organization">("volunteer");

  const handleLoginTypeChange = (type: "volunteer" | "organization") => {
    setLoginType(type);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginType === "volunteer") {
      alert("Redirecting to Volunteer Dashboard...");
      // Add redirection logic here (e.g., router.push("/volunteer/dashboard"))
    } else if (loginType === "organization") {
      alert("Redirecting to Organization Dashboard...");
      // Add redirection logic here (e.g., router.push("/organization/dashboard"))
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleLoginTypeChange("volunteer")}
          className={`px-4 py-2 rounded-md mr-4 ${
            loginType === "volunteer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Volunteer Login
        </button>
        <button
          onClick={() => handleLoginTypeChange("organization")}
          className={`px-4 py-2 rounded-md ${
            loginType === "organization" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Organization Login
        </button>
      </div>

      <div className="text-center mb-6">
        {loginType === "volunteer" ? (
          <p className="text-muted-foreground">
            Welcome, Volunteer! Join us in making a difference by contributing your time and skills to our cause.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Welcome, Organization! Manage your events, resources, and connect with volunteers to achieve your goals.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-muted transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
