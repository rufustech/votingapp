"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import { urls } from "../constants";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function LandingPage() {
  const [pageants, setPageants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch(`${urls.url}/api/models`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch")))
      .then(setModels)
      .catch(() => setModels([]));
  }, []);

  useEffect(() => {
    const fetchPageants = async () => {
      try {
        const res = await fetch(`${urls.url}/api/pageants`);
        const data = await res.json();
        setPageants(data);
      } catch (error) {
        console.error("Failed to load pageants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageants();
  }, []);

  const ongoingPageants = pageants.filter((p) => p.status === "ongoing");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-2">
        <div className="grid lg:grid-cols-4 gap-2">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 relative rounded-2xl overflow-hidden"
            style={{ height: "fit-content" }}
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("/pagentCrown.jpg")',
                filter: "brightness(0.7)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8">
              <h1
                className={`${poppins.className}  text-gray-800 mb-6 drop-shadow-lg`}
              >
                <span className="bg-white/80 backdrop-blur-sm p-1 rounded text-lg md:text-3xl">
                  Premier Voting Platform
                </span>
              </h1>
              <div className="space-y-4">
                {/* Free Vote Card */}
                <div className=" rounded-lg p-4 shadow-sm">
                  <p className="text-gray-800 font-medium  flex items-center gap-2">
                    <span className="bg-white/80 backdrop-blur-sm p-2 rounded">
                      🎖️ One Free Vote Daily
                    </span>
                  </p>
                </div>

                {/* Vote Packages */}
                <div className="  rounded-lg p-4 shadow-sm">
                  <h3 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
                    <span className="bg-white/80 backdrop-blur-sm text-lg p-1 rounded">
                      🔥 Premium Votes{" "}
                    </span>
                  </h3>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🏆</span> Top Contestants
              </h2>
              <div className="space-y-2.5">
                {[...models]
                  .sort((a, b) => b.votes - a.votes)
                  .slice(0, 5)
                  .map((model, index) => (
                    <div
                      key={model._id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-medium ${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                              ? "text-gray-400"
                              : index === 2
                              ? "text-amber-600"
                              : "text-gray-400"
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-100 font-medium">
                          {model.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-300">
                        {model.votes}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold dark:text-white text-gray-600 my-2">
            Active Events
          </h1>
          <p className="text-lg text-gray-600 mb-3"></p>
        </motion.div>

        {/* Pageants Grid */}
        <div className="mb-8">
          {ongoingPageants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <div className="bg-white rounded-lg p-6 max-w-sm mx-auto border border-purple-100">
                <h3 className="text-gray-800 font-medium mb-2">
                  No Active Events
                </h3>
                <p className="text-gray-500 text-sm mb-3">Check back soon!</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingPageants.map((pageant, index) => (
                <motion.div
                  key={pageant._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/pageants/${pageant.pageantSlug}`}>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:scale-105 transition-transform duration-500 rounded-lg overflow-hidden border-1 border-gray-300 shadow-md hover:shadow-md">
                      <div className="h-1 bg-green-500" />
                      <div className="p-3 ">
                        <h2 className="text-gray-800 font-semibold mb-2 line-clamp-1">
                          {pageant.name}
                        </h2>
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                            ONGOING
                          </span>
                          <span className="text-gray-400 text-xs">
                            Ends:{" "}
                            {new Date(pageant.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <button className="w-full shadow hover:scale-95 bg-green-50 text-green-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-green-100 transition-colors">
                          View Contestants →
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gradient-to-r from-green-300 to-green-400 p-4 rounded-lg">
            <p className="text-gray-500 text-xs">Active Events</p>
            <h3 className="text-gray-500 text-xl font-bold">
              {ongoingPageants.length}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <p className="text-gray-500 text-xs">Contestants</p>
            <h3 className="text-purple-600 text-xl font-bold">
              {ongoingPageants.length * 10}+
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <p className="text-gray-500 text-xs">Total Votes</p>
            <h3 className="text-purple-600 text-xl font-bold">1,000+</h3>
          </div>
          <div className="text-center col-span-3 mt-4">
            <Link href="/events">
              <span className="text-green-700 dark:text-gray-900 dark:bg-gray-400 dark:shadow-white dark:shadow-md shadow-md p-2 text-md hover:text-green-900">
                View All Events →
              </span>
            </Link>
          </div>
        </div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-md p-6 text-center"
        >
          <h3 className="text-gray-600 text-lg font-medium mb-2">
            Want to Participate?
          </h3>
          <p className="text-purple-700 text-sm mb-4">
            Join our upcoming events and showcase your talent
          </p>
          <Link href="/contact">
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
              Register Now
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
