"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { urls } from "../constants";
import { motion } from "framer-motion"; // Install framer-motion for animations

export default function Events() {
  const [pageants, setPageants] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchPageants = async () => {
      try {
        const res = await fetch(`${urls.url}/api/pageants`);
        const data = await res.json();
        setPageants(data);
      } catch (error) {
        console.error("Failed to load pageants:", error);
      }
    };

    fetchPageants();
  }, []);

  const filteredPageants = selectedStatus === "all" 
    ? pageants 
    : pageants.filter(pageant => pageant.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-20 px-4">
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <p className="text-sm text-gray-500">Total Pageants</p>
            <h3 className="text-2xl font-bold text-purple-600">{pageants.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <p className="text-sm text-gray-500">Ongoing Events</p>
            <h3 className="text-2xl font-bold text-green-600">
              {pageants.filter(p => p.status === "ongoing").length}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {pageants.filter(p => p.status === "upcoming").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-600 mb-4 md:mb-0">
            Events to Vote
          </h1>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {["all", "ongoing", "upcoming", "past"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${selectedStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pageants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPageants.map((pageant, index) => (
            <motion.div
              key={pageant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/pageants/${pageant.pageantSlug}`}>
                <div className="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all duration-300 border border-gray-100">
                  {/* Status Banner */}
                  <div
                    className={`w-full h-2 ${
                      pageant.status === "ongoing"
                        ? "bg-green-500"
                        : pageant.status === "upcoming"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  />
                  
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2 truncate">
                      {pageant.name}
                    </h2>
                    
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pageant.status === "ongoing"
                            ? "bg-green-100 text-green-700"
                            : pageant.status === "upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pageant.status?.toUpperCase()}
                      </span>
                      
                      <span className="text-sm text-gray-500">
                        {new Date(pageant.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Promotional Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Want to host your own pageant?</h3>
              <p className="text-purple-100">Get in touch with us to learn more about hosting opportunities.</p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-2 bg-white text-purple-600 rounded-md font-medium hover:bg-purple-50 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
