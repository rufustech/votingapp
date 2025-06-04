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
 <div className="bg-gray-50 py-1">
  <div className="max-w-5xl mx-auto px-4">
    {/* Header */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-gray-600 mb-2">Active Events</h1>
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
            <h3 className="text-gray-800 font-medium mb-2">No Active Events</h3>
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
                        Ends: {new Date(pageant.endDate).toLocaleDateString()}
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
        <h3 className="text-gray-500 text-xl font-bold">{ongoingPageants.length}</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-purple-100">
        <p className="text-gray-500 text-xs">Contestants</p>
        <h3 className="text-purple-600 text-xl font-bold">{ongoingPageants.length * 10}+</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-purple-100">
        <p className="text-gray-500 text-xs">Total Votes</p>
        <h3 className="text-purple-600 text-xl font-bold">1,000+</h3>
      </div>
      <div className="text-center col-span-3 mt-4">

       <Link href="/events">
              <span className="text-green-700 shadow-md p-2 text-md hover:text-green-900">
                View All Events →
              </span>
            </Link>
      </div>

    </div>

    {/* Promotional Banner */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-6 text-center"
    >
      <h3 className="text-white font-medium mb-2">Want to Participate?</h3>
      <p className="text-purple-100 text-sm mb-4">
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
