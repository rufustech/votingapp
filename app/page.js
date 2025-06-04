"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import LandingPage from "./components/LandingPage";
import { urls } from "./constants";
import { motion } from "framer-motion";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const votePackages = [
  { label: "Transparent", priceId: "price_5", votes: 10 },
  { label: "Fair", priceId: "price_10", votes: 25 },
  { label: "Fun", priceId: "price_20", votes: 60 },
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="pt-32 px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 relative rounded-2xl overflow-hidden"
              style={{ height: 'fit-content' }}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url("/pagentCrown.jpg")',
                  filter: 'brightness(0.7)'
                }}
              />
              
              {/* Content */}
              <div className="relative z-10 p-6 md:p-8">
                <h1 className={`${poppins.className}  text-3xl text-gray-800 mb-6 drop-shadow-lg`}>
                 <span className="bg-white/80 backdrop-blur-sm p-1 rounded">Premier Voting Platform</span> 
                </h1>

                <div className="space-y-4">
                  {/* Free Vote Card */}
                  <div className=" rounded-lg p-4 shadow-sm">
                    <p className="text-gray-800 font-medium flex items-center gap-2">
                      <span className="bg-white/80 backdrop-blur-sm p-2 rounded">🎖️ One Free Vote Daily</span>
                    </p>
                  </div>

                  {/* Vote Packages */}
                  <div className="  rounded-lg p-4 shadow-sm">
                    <h3 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
                     <span className="bg-white/80 backdrop-blur-sm p-2 rounded">🔥 Premium Votes - Boost your favorite contestants</span> 
                    </h3>
                    {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {votePackages.map((pkg) => (
                        <button
                          key={pkg.priceId}
                          onClick={() => handleBuyVotes(pkg.priceId)}
                          className="bg-purple-100 hover:bg-purple-700 text-black px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg"
                        >
                          {pkg.label}
                        </button>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏆</span> Top Contestants
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
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-amber-600' :
                            'text-gray-400'
                          }`}>
                            #{index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {model.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {model.votes}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Landing Page Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <LandingPage />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
