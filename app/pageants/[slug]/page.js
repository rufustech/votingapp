"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModelsCard from "../../components/modelComponents/ModelsCard";
import { urls } from "../../constants";
import Link from "next/link";

export default function PageantModelsPage() {
  const { slug } = useParams();
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

        // 1. First fetch pageant details by slug
        const pageantResponse = await fetch(`${urls.url}/api/pageants/slug/${slug}`);
        if (!pageantResponse.ok) {
          throw new Error('Failed to fetch pageant details');
        }
        
        const pageantData = await pageantResponse.json();
        console.log("Pageant Data:", pageantData);
        setPageant(pageantData);

        // 2. Then fetch models using the pageant's ID
        const modelsResponse = await fetch(`${urls.url}/api/models/pageant/id/${pageantData._id}`);
        if (!modelsResponse.ok) {
          throw new Error('Failed to fetch models');
        }
        
        const modelsData = await modelsResponse.json();
        console.log("Models for pageant:", modelsData);
        setModels(modelsData);

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 mt-20 py-10 px-4">
      <div className="bg-white border border-purple-500 rounded shadow-sm p-6 mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-[#9c27b0]">{pageant?.name}</h1>
        <div className="text-gray-600 mt-2">
          <p>Status: <span className="font-semibold">{pageant?.status}</span></p>
          <p className="mt-1">
            {new Date(pageant?.startDate).toLocaleDateString()} - {new Date(pageant?.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Updated Link to use pageant ID instead of slug */}
        <Link
          href={`/leaderboard/${pageant?._id}`} // This will now use the ID
          className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          View Leaderboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        {models.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              🚫 No contestants available for or {pageant?.name}.
            </p>
            {pageant?.status === 'upcoming' && (
              <p className="text-gray-400 mt-2">
                Registration may not have started yet.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {models.map((model) => (
              <ModelsCard 
                key={model._id} 
                {...model} 
                pageantName={pageant?.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded opacity-75">
          <pre className="text-xs">
            {JSON.stringify(
              {
                pageantSlug: slug,
                pageantId: pageant?._id,
                pageantName: pageant?.name,
                modelCount: models?.length,
                status: pageant?.status
              },
              null,
              2
            )}
          </pre>
        </div>
      )} */}
    </div>
  );
}
