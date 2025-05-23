"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { urls } from "../constants";

export default function LandingPage() {
  const [pageants, setPageants] = useState([]);

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

  return (
    <div className=" bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-[#9c27b0] mb-8">
        Select a Pageant to Vote
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center max-w-7xl mx-auto ">
{pageants.slice(0, 8).map((pageant) => (
  <Link href={`/pageants/${pageant.pageantSlug}`} key={pageant._id}>
    <div className="bg-white shadow rounded-lg p-2 border-l-3 border-yellow-400 h-20  hover:shadow-xl transition duration-300 cursor-pointer max-w-xs mx-auto">
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{pageant.name}</h2>
        <p
          className={`mt-1 text-sm font-medium ${
            pageant.status === "ongoing"
              ? "text-green-600"
              : pageant.status === "upcoming"
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          {pageant.status?.toUpperCase() || "UNKNOWN"}
        </p>
      </div>
    </div>
  </Link>
))}

      </div>
    </div>
  );
}
