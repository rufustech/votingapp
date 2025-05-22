"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import ModelMore from "./components/ModelMore";
import { urls } from "./constants";


const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function Home() {
  const [models, setModels] = useState([]);
  const [votePackages, setVotePackages] = useState([
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* <Header /> */}
{/* <Hero /> */}
      <main className="pt-16 px-4">
  <div className="container mx-auto lg:px-20">
    {/* HERO SECTION */}
    <section className="container mx-auto mt-16 px-4">
  <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
    {/* HERO LEFT - 3/4 */}
    <div
  className="relative bg-cover bg-center border-l-1 dark:border-white border-[#9c27b0] rounded-l-xl py-4 md:py-0 overflow-hidden shadow-md flex-1"
  style={{ backgroundImage: 'url("/.jpg")' }}
>
<div className="absolute inset-0  bg-opacity-100" />

<div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 md:px-12 max-w-2xl">
  <h1 className={`${poppins.className} text-[#9c27b0] text-3xl sm:text-5xl md:text-5xl dark:text-white  uppercase `}>
    Miss Zimbabwe 2025!
  </h1>

  <p className="mt-4 sm:mt-6 text-gray-600 dark:text-gray-100 text-base ">
    Celebrating the elegance, intelligence, and cultural pride of Zimbabwean women.
    The contestant with the most votes wins the prestigious People&apos;s Choice Award.
  </p>

  <div className="mt-6 space-y-5">
    <p className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium text-md shadow-sm border border-[#9c27b0] w-fit">
      🎖️ Vote for your favorite model (1 free vote/day)
    </p>

    <div>
      <p className="text-gray-700 dark:text-white font-semibold mb-2">🔥 Boost with Extra Votes:</p>
      <div className="flex gap-3 flex-wrap">
        {votePackages.map((pkg) => (
          <button
            key={pkg.priceId}
            onClick={() => handleBuyVotes(pkg.priceId)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 shadow-md"
          >
            {pkg.label}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>

    </div>

    {/* RIGHT SIDE - Top Contestants & Pageants */}
    <div className="flex flex-col lg:w-1/4 gap-6">
      {/* Leaderboard */}
      <div className="bg-white dark:bg-gray-800 dark:shadow-white p-4 rounded-lg dark:shadow-sm shadow-md flex-1">
        <h2 className="text-2xl font-bold mb-4 text-[#9c27b0]">🔥 Leaderboard</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {[...models]
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 6)
            .map((model) => (
              <li
                key={model._id}
                className="py-2 flex justify-between text-sm"
              >
                <span className="font-medium">{model.name}</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Votes: {model.votes}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Current Pageants */}
      <div className="bg-white dark:bg-gray-800 dark:shadow-white dark:shadow-sm p-4 rounded-lg shadow-md flex-1">
        <h2 className="text-xl font-bold mb-4 text-[#9c27b0]">🎉 Current Pageants</h2>
        <ul className="space-y-2">
          <li className="border p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
            Miss Zimbo
          </li>
          <li className="border p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
            Miss Universe Zimbabwe
          </li>
          <li className="border p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
            Miss Teen Zim
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>



    {/* MODELS SECTION */}
    <section className="my-12">
      {/* <Models models={models} /> */}

      <ModelMore models={models} />  

    </section>
  </div>
</main>

    </div>
  );
}
