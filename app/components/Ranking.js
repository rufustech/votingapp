import React, { useEffect, useState } from 'react';
import VoteModal from '../components/Voting/VoteModal';

const MAX_VOTES_PER_DAY = 8;

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

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/models");
        if (!response.ok) throw new Error("Failed to fetch models");
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const voteData = getVotesData();
      const paid = getPaidVotes();
      setVotesLeft(MAX_VOTES_PER_DAY - voteData.votes);
      setPaidVotesState(paid);
    }
  }, []);

  const sortedModels = [...models].sort((a, b) => b.votes - a.votes);

  const openModal = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const handleVote = async (modelId) => {
    if (votesLeft <= 0) {
      alert("You've reached your vote limit for today. Try again tomorrow.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/models/${modelId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to vote.");
        return;
      }

      const newVotesData = getVotesData();
      newVotesData.votes += 1;
      localStorage.setItem("voteData", JSON.stringify(newVotesData));

      setVotesLeft(MAX_VOTES_PER_DAY - newVotesData.votes);
      setModels((prevModels) =>
        prevModels.map((model) =>
          model._id === modelId ? { ...model, votes: model.votes + 1 } : model
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="container mx-auto mt-20 max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Rankings List */}
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-2">🏆 Leaderboard</h2>
        <h3 className="mb-4 text-gray-600 text-lg">Free Votes Remaining: {votesLeft}</h3>
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
            onFreeVote={() => {
              alert(`You voted for ${selectedModel?.name} (free)!`);
              setShowModal(false);
            }}
            onPaidVote={() => {
              alert(`Redirecting to Stripe for ${selectedModel?.name}...`);
              setShowModal(false);
            }}
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
