"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import ModelMore from "./components/ModelMore";
import { urls } from "./constants";
import LandingPage from "./components/LandingPage";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function Home() {
  const [models, setModels] = useState([]);
  const [votePackages] = useState([
    { label: "$0.50 = 1 Vote", priceId: "price_5", votes: 10 },
    { label: "$5 = 10 Votes", priceId: "price_10", votes: 25 },
    { label: "See Pageants", priceId: "price_20", votes: 60 },
  ]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${urls.url}/api/models`);
        if (!response.ok) throw new Error("Failed to fetch models");
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  const handleBuyVotes = async (priceId) => {
    try {
      const res = await fetch(`${urls.url}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!data?.url) {
        console.error("Stripe checkout session creation failed:", data);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="pt-40 px-4">
        <div className="container mx-auto lg:px-20">
          {/* HERO SECTION */}
          <section className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left - Hero */}
            <div
              className="relative flex-1 rounded-lg shadow-md border border-purple-500 bg-cover bg-center overflow-hidden"
              style={{ backgroundRepeat: "no-repeat", backgroundImage: 'url("/pagentCrown.jpg")' }}
            >
              <div className="absolute inset-0  bg-opacity-0 z-0" />
              <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
                <h1 className={`${poppins.className} text-3xl sm:text-4xl font-bold text-white uppercase`}>
                  Welcome! Cast your Votes
                </h1>

                <p className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium text-sm w-fit shadow border border-purple-400">
                  🎖️ Vote for your favorite contestant (1 free vote/day)
                </p>

                <div className="mt-6">
                  <p className="text-white font-semibold mb-2">🔥 Boost with Extra Votes:</p>
                  <div className="flex flex-wrap gap-3">
                    {votePackages.map((pkg) => (
                      <button
                        key={pkg.priceId}
                        onClick={() => handleBuyVotes(pkg.priceId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
                      >
                        {pkg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Leaderboard */}
            <div className="lg:w-1/4 hidden md:block">
              <div className="bg-white dark:bg-gray-800 border border-purple-500 rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-bold text-purple-700 mb-4">🔥 Leaderboard</h2>
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {[...models]
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, 7)
                    .map((model) => (
                      <li
                        key={model._id}
                        className="py-2 flex justify-between text-sm"
                      >
                        <span className="font-medium">{model.name}</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {model.votes} votes
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </section>

          {/* MODELS SECTION */}
          <section className="my-16">
            <LandingPage />
          </section>
        </div>
      </main>
    </div>
  );
}
