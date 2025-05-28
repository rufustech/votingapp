'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VoteModal from '../../components/Voting/VoteModal';
import { loadStripe } from '@stripe/stripe-js';
import { urls } from '../../constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const MAX_VOTES_PER_DAY = 1;

const getVotesData = () => {
  if (typeof window === 'undefined') return { date: '', votes: 0 };
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('voteData')) || { date: today, votes: 0 };
  if (stored.date !== today) {
    localStorage.setItem('voteData', JSON.stringify({ date: today, votes: 0 }));
    return { date: today, votes: 0 };
  }
  return stored;
};

export default function RankingByPageant() {
  const { pageantId } = useParams(); // Changed from id to pageantId to match route
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageant, setPageant] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [votesLeft, setVotesLeft] = useState(MAX_VOTES_PER_DAY);
  const router = useRouter();

  
  const handleFreeVote = async () => {
    if (!selectedModel) return;

    try {
      const voteData = getVotesData();
      if (voteData.votes >= MAX_VOTES_PER_DAY) {
        throw new Error('Daily vote limit reached');
      }

      const response = await fetch(`${urls.url}/api/models/${selectedModel._id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Vote failed');
      }

      // Update local storage and state
      voteData.votes += 1;
      localStorage.setItem('voteData', JSON.stringify(voteData));
      setVotesLeft(MAX_VOTES_PER_DAY - voteData.votes);

      // Update models list and resort
      setModels(prevModels => 
        prevModels.map(model => 
          model._id === selectedModel._id 
            ? { ...model, votes: model.votes + 1 }
            : model
        ).sort((a, b) => b.votes - a.votes)
      );

      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePaidVote = async (amount, votes) => {
    if (!selectedModel) return;

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      const response = await fetch(`${urls.url}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel._id,
          name: selectedModel.name,
          votes,
          amount,
          cancelUrl: window.location.href
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create session");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed: " + err.message);
    } finally {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data for pageant:', pageantId);

        // Fetch models first
        const modelsResponse = await fetch(`${urls.url}/api/models/pageant/id/${pageantId}`);
        if (!modelsResponse.ok) {
          throw new Error('Failed to fetch models');
        }
        const modelsData = await modelsResponse.json();
        console.log('Models fetched:', modelsData);
        setModels(modelsData.sort((a, b) => b.votes - a.votes));

        // Fetch pageant details
        const pageantResponse = await fetch(`${urls.url}/api/pageants/${pageantId}`);
        if (!pageantResponse.ok) {
          throw new Error('Failed to fetch pageant details');
        }
        const pageantData = await pageantResponse.json();
        console.log('Pageant fetched:', pageantData);
        setPageant(pageantData);

        // Set initial votes left
        const voteData = getVotesData();
        setVotesLeft(MAX_VOTES_PER_DAY - voteData.votes);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (pageantId) {
      fetchData();
    }
  }, [pageantId]);

  // Log state changes
  useEffect(() => {
    console.log('Current state:', {
      loading,
      error,
      modelsCount: models.length,
      pageant,
      votesLeft
    });
  }, [loading, error, models, pageant, votesLeft]);

  if (loading) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading pageant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
   <div className="container mx-auto mt-20 max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pageant
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-[#9c27b0] mb-2">
        🏆 {pageant?.name || 'Pageant'} Leaderboard
      </h2>
        <h3 className="mb-4 text-gray-600 text-lg">Free Votes Remaining: {votesLeft}</h3>

        {models.length === 0 ? (
          <p className="text-gray-500">No contestants yet for this competition.</p>
        ) : (
          <ul className="space-y-4">
            {models.map((model, index) => (
              <li
                key={model._id}
                className="flex items-center justify-between bg-white shadow rounded-lg p-4 border-l-4 border-yellow-400"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-300 w-6">{index + 1}.</span>
                  <img
                    src={model.images?.[0] || ''}
                    alt={model.name}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                  <div>
                    <p className="font-semibold text-gray-600">{model.name}</p>
                    <p className="text-sm text-gray-500">Votes: {model.votes}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
                >
                  VOTE
                </button>
              </li>
            ))}
          </ul>
        )}

        {showModal && selectedModel && (
          <VoteModal
            open={showModal}
            handleClose={() => setShowModal(false)}
            onFreeVote={handleFreeVote}
            onPaidVote={handlePaidVote}
          />
        )}
      </div>

  {/* Ad Space */}
      <div className="bg-gray-50 rounded-lg p-6 shadow-md border border-dashed border-gray-300 h-full flex flex-col space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">📢 Sponsor This Space</h3>
          <p className="text-sm text-gray-500">
            Reach thousands of viewers by advertising your brand here.
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-full h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
            FashionWorld – Style Redefined
          </div>
          <div className="w-full h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
            FreshFarm Organics – Eat Clean, Live Well
          </div>
          <div className="w-full h-32 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
            GlamUp Cosmetics – Be Your Best You
          </div>
        </div>

        <div className="text-center">
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded">
            Contact Us to Advertise
          </button>
        </div>
      </div>
    </div>
  );
}
