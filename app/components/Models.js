"use client"
import React, { useEffect, useState } from "react";
import ModelCard from "./modelComponents/ModelCard";

const MAX_VOTES_PER_DAY = 1;

// Helper function to reset votes if it's a new day
const getVotesData = () => {
    const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)
    const storedData = JSON.parse(localStorage.getItem("voteData")) || { date: today, votes: 0 };

    if (storedData.date !== today) {
        localStorage.setItem("voteData", JSON.stringify({ date: today, votes: 0 }));
        return { date: today, votes: 0 };
    }

    return storedData;
};

const getPaidVotes = () => {
    return parseInt(localStorage.getItem("paidVotes") || "0", 10);
};

const setPaidVotes = (votes) => {
    localStorage.setItem("paidVotes", votes);
};


function Models() {
    const [models, setModels] = useState([]);
    const [votesLeft, setVotesLeft] = useState(MAX_VOTES_PER_DAY - getVotesData().votes);
    const [paidVotes, setPaidVotesState] = useState(getPaidVotes());


    // Fetch models from the backend
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/models");

                if (!response.ok) {
                    throw new Error("Failed to fetch models");
                }
                const data = await response.json();
                console.log(data);
                
                setModels(data);
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };
        fetchModels();
    }, []);

    // Function to handle vote
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

            // Update local votes count
            const newVotesData = getVotesData();
            newVotesData.votes += 1;
            localStorage.setItem("voteData", JSON.stringify(newVotesData));

            // Update UI
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
        <div className="p-2">
            <h2 className="text-center text-lg font-semibold mb-4">Votes Left: {votesLeft}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-4">
                {models.length > 0 ? (
                    models.map((model) => (
                        <ModelCard
                            key={model._id}
                            name={model.name}
                            bio={model.bio}
                            votes={model.votes}
                            pageantId={model.pageantId?.name}
                            onVote={() => handleVote(model._id)}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full">No models found.</p>
                )}
            </div>
        </div>
    );
}

export default Models;
