'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VoteModal from '../../components/Voting/VoteModal';
import { loadStripe } from "@stripe/stripe-js";
import { urls } from '../../constants';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const MAX_VOTES_PER_DAY = 1;

const getVotesData = () => {
  if (typeof window === "undefined") return { date: "", votes: 0 };
  const today = new Date().toISOString().split("T")[0];
  const stored = JSON.parse(localStorage.getItem("voteData")) || { date: today, votes: 0 };
  if (stored.date !== today) {
    localStorage.setItem("voteData", JSON.stringify({ date: today, votes: 0 }));
    return { date: today, votes: 0 };
  }
  return stored;
};

const getPaidVotes = () => typeof window !== "undefined" ? parseInt(localStorage.getItem("paidVotes") || "0", 10) : 0;
const setPaidVotes = (v) => typeof window !== "undefined" && localStorage.setItem("paidVotes", v);

export default function RankingByPageant() {
  const { pageantId } = useParams();
  const [models, setModels] = useState([]);
  const [pageantName, setPageantName] = useState("Loading...");
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [votesLeft, setVotesLeft] = useState(MAX_VOTES_PER_DAY);

  useEffect(() => {
    if (!pageantId) return;

    // Fetch pageant details
    fetch(`${urls.url}/api/pageants/${pageantId}`)
      .then((res) => res.json())
      .then((data) => setPageantName(data.name))
      .catch(() => setPageantName("Unknown Pageant"));

    // Fetch only models for the current pageant
    fetch(`${urls.url}/api/models?pageantId=${pageantId}`)
      .then((res) => res.json())
      .then(setModels)
      .catch((err) => console.error("Error fetching models:", err));

    // Get today's vote count
    const voteData = getVotesData();
    setVotesLeft(MAX_VOTES_PER_DAY - voteData.votes);
  }, [pageantId]);

  const sortedModels = [...models].sort((a, b) => b.votes - a.votes);

  const openModal = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

const handleFreeVote = async () => {
  try {
    const voteData = getVotesData();
    if (voteData.votes >= MAX_VOTES_PER_DAY) {
      alert("You've reached your vote limit for today.");
      return;
    }

    const res = await fetch(`${urls.url}/api/models/${_id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Vote failed");
    }

    voteData.votes += 1;
    localStorage.setItem("voteData", JSON.stringify(voteData));

    alert("Thanks for voting!");
    setOpenModal(false);
  } catch (err) {
    console.error("Vote error:", err.message);
    alert("Voting failed: " + err.message);
  }
};


  const handlePaidVote = async (amount, votes) => {
    try {
      const stripe = await stripePromise;
      const res = await fetch(`${urls.url}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel._id,
          name: selectedModel.name,
          votes,
          amount,
          cancelUrl: 'https://votes.co.zw/cancel',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create session");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("❌ Payment error:", err.message);
      alert("Payment failed: " + err.message);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="container mx-auto mt-20 max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold dark:text-blue-500 text-[#9c27b0] mb-2">🏆 {pageantName} Leaderboard</h2>
        <h3 className="mb-4 text-gray-600 dark:text-white text-lg">Free Votes Remaining: {votesLeft}</h3>

        {sortedModels.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No contestants yet for this competition.</p>
        ) : (
          <ul className="space-y-4">
            {sortedModels.map((model, index) => (
              <li key={model._id} className="flex items-center justify-between bg-white shadow rounded-lg p-4 border-l-4 border-yellow-400">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-300 w-6">{index + 1}.</span>
                  <img src={model.images[0] || ""} alt={model.name} className="w-12 h-12 object-cover rounded-full border" />
                  <div>
                    <p className="font-semibold text-gray-600">{model.name}</p>
                    <p className="text-sm text-gray-500">Votes: {model.votes}</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal(model)}
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
