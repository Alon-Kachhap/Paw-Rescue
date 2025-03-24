"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here later
    router.push("/volunteer");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          className="lucide lucide-paw-print h-6 w-6">
          <circle cx="11" cy="4" r="2">
          </circle><circle cx="18" cy="8" r="2">
          </circle><circle cx="20" cy="16" r="2">
          </circle>
          <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z">
          </path></svg>
          <h2>Paw Rescue</h2>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium" htmlFor="email">
              Email address
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
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
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
