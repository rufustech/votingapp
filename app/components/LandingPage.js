"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { urls } from "../constants";

export default function LandingPage() {
  const [pageants, setPageants] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-gray-50 min-h-screen py-4 px-4">
      <div className="max-w-7xl mx-auto">
       
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-800 mb-2"
            >
              Active Events to Vote
            </motion.h1>
            <p className="text-gray-600 mb-4">
              Support your favorite contestants in these ongoing competitions
            </p>
            <Link href="/events">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition transform hover:scale-105">
                View All Events
              </button>
            </Link>
          </div>

          {/* Ongoing Pageants Grid */}
          {ongoingPageants.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-sm border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Active Pageants
                </h3>
                <p className="text-gray-500 mb-4">
                  Check back soon for upcoming competitions!
                </p>
                <Link href="/events">
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    View All Events →
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {ongoingPageants.map((pageant, index) => (
                <motion.div
                  key={pageant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/pageants/${pageant.pageantSlug}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100">
                      {/* Status Banner */}
                      <div className="h-2 bg-green-500" />
                      
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                          {pageant.name}
                        </h2>
                        
                        <div className="flex items-center justify-between">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            ONGOING
                          </span>
                          
                          <div className="flex items-center text-gray-500 text-sm">
                            <span>Ends: {new Date(pageant.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <button className="mt-4 w-full bg-purple-50 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium">
                          View Contestants →
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

           {/* Stats Overview */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-sm text-white">
              <p className="text-purple-100">Active Competitions</p>
              <h3 className="text-3xl font-bold">{ongoingPageants.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <p className="text-sm text-gray-500">Total Contestants</p>
              <h3 className="text-2xl font-bold text-purple-600">
                {/* You can add actual contestant count here */}
                {ongoingPageants.length * 10}+
              </h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <p className="text-sm text-gray-500">Total Votes Cast</p>
              <h3 className="text-2xl font-bold text-purple-600">1,000+</h3>
            </div>
          </motion.div>
        </div>


          {/* Promotional Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Want to Participate?</h3>
              <p className="text-purple-100 mb-6">
                Join our upcoming beauty pageants and showcase your talent to the world.
              </p>
              <Link href="/contact">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Register Now
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
