"use client";

import { useRouter } from "next/navigation";

export default function OrganizationSignInPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add organization authentication logic here later
    router.push("/organization");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
          Organization Sign In
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium" htmlFor="email">
              Organization Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-1.5 placeholder-gray-400 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Sign in as Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
