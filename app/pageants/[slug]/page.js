"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
 // your API base URL
import ModelsCard from "../../components/modelComponents/ModelsCard";
import { urls } from "../../constants";
import Link from "next/link";

export default function PageantModelsPage() {
  const { slug } = useParams();
  const [models, setModels] = useState([]);
  const [pageant, setPageant] = useState(null);

  useEffect(() => {
    if (!slug) return;

    // Fetch pageant info
    fetch(`${urls.url}/api/pageants`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.pageantSlug === slug);
        setPageant(found);
      });

    // Fetch models tied to this pageant
    fetch(`${urls.url}/api/models/pageant/${slug}`)
      .then((res) => res.json())
      .then(setModels);
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 mt-20 py-10 px-4">

<div className="bg-white border border-purple-500 rounded shadow-sm p-6 mb-8 max-w-2xl mx-auto text-center">
  <h1 className="text-3xl font-bold text-[#9c27b0]">{pageant?.name}</h1>
  <p className="text-gray-600 mt-2">{pageant?.description}</p>

  <Link
    href={`/leaderboard/${pageant?._id}`}
    className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
  >
    View Leaderboard
  </Link>
</div>


      <div className="max-w-7xl mx-auto">
  {models.length === 0 ? (
    <p className="text-center text-gray-500 py-12 text-lg">
      🚫 No contestants available at the moment.
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {models.map((model) => (
        <ModelsCard key={model._id} {...model} />
      ))}
    </div>
  )}
</div>

    </div>
  );
}
