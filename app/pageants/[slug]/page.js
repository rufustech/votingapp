"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ModelsCard from "../../components/modelComponents/ModelsCard";
import { urls } from "../../constants";
import Link from "next/link";

export default function PageantModelsPage() {
  // Keep all your existing state and functions
  const { slug } = useParams();
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [pageant, setPageant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep your existing useEffect and fetch logic
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const pageantResponse = await fetch(`${urls.url}/api/pageants/slug/${slug}`);
        if (!pageantResponse.ok) throw new Error('Failed to fetch pageant details');
        const pageantData = await pageantResponse.json();
        setPageant(pageantData);

        const modelsResponse = await fetch(`${urls.url}/api/models/pageant/id/${pageantData._id}`);
        if (!modelsResponse.ok) throw new Error('Failed to fetch models');
        const modelsData = await modelsResponse.json();
        setModels(modelsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Loading contestants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-16">
      <div className="max-w-6xl mx-auto mt-20 px-4">
        
        {/* Header Section */}
        <div className="relative mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button
              onClick={() => router.back()}
              className="p-1 flex w-20 shadow-lg bg-gradient-to-r from-purple-300 to-purple-400 hover:bg-gray-400 hover:text-white rounded-full transition-colors"
              title="Go back"
            > 
              <svg className="w-5 h-6 hover:text-white text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> 
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-semibold text-purple-700">
              {pageant?.name || 'Pageant Details'}
            </h1>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                pageant?.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                pageant?.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {pageant?.status?.toUpperCase()}
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Contestants</p>
              <p className="text-lg font-semibold text-purple-600">{models.length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="text-sm text-gray-600">
                {new Date(pageant?.startDate).toLocaleDateString()}
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <Link
              href={`/leaderboard/${pageant?._id}`}
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
            >
              <span>View Leaderboard</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Models Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-8"
        >
          {models.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-600">No contestants available yet</p>
              {pageant?.status === 'upcoming' && (
                <p className="text-sm text-gray-400 mt-1">Registration opens soon</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 mx-3 md:mx-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {models.map((model, index) => (
                <motion.div
                  key={model._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ModelsCard {...model} pageantName={pageant?.name} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
