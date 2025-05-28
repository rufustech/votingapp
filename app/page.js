"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import LandingPage from "./components/LandingPage";
import { urls } from "./constants";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const votePackages = [
  { label: "$0.50 = 1 Vote", priceId: "price_5", votes: 10 },
  { label: "$5 = 10 Votes", priceId: "price_10", votes: 25 },
  { label: "See Pageants", priceId: "price_20", votes: 60 },
];

export default function Home() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch(`${urls.url}/api/models`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(setModels)
      .catch(() => setModels([]));
  }, []);

  const handleBuyVotes = async (priceId) => {
    try {
      const res = await fetch(`${urls.url}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      // Handle error silently
    }
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <main className="pt-24 px-4 pb-12">
        <div className="container mt-6 mx-auto max-w-7xl">
          <section className="grid lg:grid-cols-4 gap-6 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Welcome Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                <h1 className={`${poppins.className} text-3xl text-gray-800 dark:text-white mb-6`}>
                  Best Voting Platform in Zimbabwe
                </h1>

                <div className="space-y-6">
                  {/* Free Vote Info */}
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                    <p className="text-purple-700 dark:text-purple-300 font-medium">
                      🎖️ Vote for your favorite contestant (1 free vote daily)
                    </p>
                  </div>

                  {/* Vote Packages */}
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-300 font-medium mb-3">
                      🔥 Get Extra Votes
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {votePackages.map((pkg) => (
                        <button
                          key={pkg.priceId}
                          onClick={() => handleBuyVuyVotes(pkg.priceId)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {pkg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="hidden  lg:block">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4.5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏆</span> Top Contestants
                </h2>
                <div className="space-y-3">
                  {[...models]
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, 4)
                    .map((model, index) => (
                      <div
                        key={model._id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">
                            #{index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {model.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {model.votes}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Models Section */}
          <LandingPage />
        </div>
      </main>
    </div>
  );
}
