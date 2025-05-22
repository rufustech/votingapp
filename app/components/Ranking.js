'use client';

import React, { useEffect, useState } from 'react';
import VoteModal from '../components/Voting/VoteModal';
import { loadStripe } from "@stripe/stripe-js";
import { urls } from '../constants';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const MAX_VOTES_PER_DAY = 2;

const getVotesData = () => {
  if (typeof window === "undefined") return { date: "", votes: 0 };
  const today = new Date().toISOString().split("T")[0];
  const storedData = JSON.parse(localStorage.getItem("voteData")) || { date: today, votes: 0 };
  if (storedData.date !== today) {
    localStorage.setItem("voteData", JSON.stringify({ date: today, votes: 0 }));
    return { date: today, votes: 0 };
  }
  return storedData;
};

const getPaidVotes = () => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("paidVotes") || "0", 10);
};

const setPaidVotes = (votes) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("paidVotes", votes);
  }
};

function Ranking() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [votesLeft, setVotesLeft] = useState(MAX_VOTES_PER_DAY);
  const [paidVotes, setPaidVotesState] = useState(0);

  // Stripe Success Callback Handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const modelId = urlParams.get('modelId');
    const votes = urlParams.get('votes');

    if (paymentSuccess && modelId && votes) {
      fetch(`${urls.url}/api/models/${modelId}/add-votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes }),
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to update votes");
          return res.json();
        })
        .then(data => {
          console.log("✅ Votes updated via frontend", data);
          setModels(prev =>
            prev.map(m => m._id === modelId ? { ...m, votes: m.votes + parseInt(votes, 10) } : m)
          );
        })
        .catch(err => {
          console.error("❌ Error updating votes:", err.message);
        });

      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    fetch(`${urls.url}/api/models`)
      .then(res => res.json())
      .then(setModels)
      .catch(err => console.error("Error fetching models:", err));
  }, []);

  useEffect(() => {
    const voteData = getVotesData();
    const paid = getPaidVotes();
    setVotesLeft(MAX_VOTES_PER_DAY - voteData.votes);
    setPaidVotesState(paid);
  }, []);

  const sortedModels = [...models].sort((a, b) => b.votes - a.votes);

  const openModal = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const handleFreeVote = async () => {
    if (!selectedModel || votesLeft <= 0) {
      alert("You've reached your vote limit for today. Try again tomorrow.");
      return;
    }

    try {
      const res = await fetch(`${urls.url}/api/models/${selectedModel._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to vote.");
        return;
      }

      const voteData = getVotesData();
      voteData.votes += 1;
      localStorage.setItem("voteData", JSON.stringify(voteData));

      setVotesLeft(MAX_VOTES_PER_DAY - voteData.votes);
      setModels(prev =>
        prev.map(model =>
          model._id === selectedModel._id ? { ...model, votes: model.votes + 1 } : model
        )
      );
    } catch (err) {
      console.error("Error voting:", err);
    } finally {
      setShowModal(false);
    }
  };

  const handlePaidVote = async (amount, votes) => {
    if (!selectedModel) return;

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

       const response = await fetch(`https://votingapp-backend-mohg.onrender.com/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel._id,
          name: selectedModel.name,
          votes,
          amount,
          cancelUrl: 'https://votes.co.zw/cancel'
        }),
      });

      const data = await response.json();
      console.log("Checkout session:", data);
      if (!response.ok) throw new Error(data.error || "Failed to create session");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("❌ Stripe error:", err.message);
      alert("Payment failed: " + err.message);
    } finally {
      setShowModal(false);
    }
  };

  
  return (
    <div className="container mx-auto mt-20 max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Rankings List */}
      <div>
        <h2 className="text-2xl font-bold dark:text-blue-500 text-blue-600 mb-2">🏆 Leaderboard</h2>
        <h3 className="mb-4 text-gray-600 dark:text-white text-lg">Free Votes Remaining: {votesLeft}</h3>
        <ul className="space-y-4">
          {sortedModels.map((model, index) => (
            <li
              key={model._id}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4 border-l-4 border-yellow-400"
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-300 w-6">{index + 1}.</span>
                <img
                  src={model.images[0] || ""}
                  alt={model.name}
                  className="w-12 h-12 object-cover rounded-full border"
                />
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

export default Ranking;
