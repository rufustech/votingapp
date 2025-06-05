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
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch")))
      .then(setModels)
      .catch(() => setModels([]));
  }, []);

  const handleBuyVotes = async (priceId) => {
    try {
      const res = await fetch(
        `${urls.url}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        }
      );
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      // Handle error silently
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:bg-black">
      <main className="pt-24 px-4 pb-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          {/* Landing Page Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2"
          >
            <LandingPage />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
