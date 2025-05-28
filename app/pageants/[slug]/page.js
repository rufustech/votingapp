"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ModelsCard from "../../components/modelComponents/ModelsCard";
import { urls } from "../../constants";
import Link from "next/link";

export default function PageantModelsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [pageant, setPageant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pageantResponse = await fetch(`${urls.url}/api/pageants/slug/${slug}`);
        if (!pageantResponse.ok) {
          throw new Error('Failed to fetch pageant details');
        }
        
        const pageantData = await pageantResponse.json();
        setPageant(pageantData);

        const modelsResponse = await fetch(`${urls.url}/api/models/pageant/id/${pageantData._id}`);
        if (!modelsResponse.ok) {
          throw new Error('Failed to fetch models');
        }
        
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
      <div className="min-h-screen bg-gray-50 mt-20 flex iteitems-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </motion.div>

        {/* Pageant Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-purple-500 rounded-lg shadow-sm p-8 mb-12 max-w-2xl mx-auto text-center"
        >
          <h1 className="text-3xl font-bold text-[#9c27b0] mb-4">{pageant?.name}</h1>
          <div className="text-gray-600 space-y-2">
            <p className="flex items-center justify-center gap-2">
              Status: 
              <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                pageant?.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                pageant?.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {pageant?.status?.toUpperCase()}
              </span>
            </p>
            <p className="text-sm">
              {new Date(pageant?.startDate).toLocaleDateString()} - {new Date(pageant?.endDate).toLocaleDateString()}
            </p>
          </div>

          <Link
            href={`/leaderboard/${pageant?._id}`}
            className="inline-block mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            View Leaderboard
          </Link>
        </motion.div>

        {/* Models Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {models.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <p className="text-gray-500 text-lg">
                🚫 No contestants available for {pageant?.name}
              </p>
              {pageant?.status === 'upcoming' && (
                <p className="text-gray-400 mt-2">
                  Registration may not have started yet.
                </p>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={model._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModelsCard 
                    {...model} 
                    pageantName={pageant?.name}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
