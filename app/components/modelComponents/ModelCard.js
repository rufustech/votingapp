import React from "react";

function ModelCard({ name, votes, pageantId, onVote }) {
    return (
        <div className="lg:w-72 border rounded-xl bg-white border-blue-200 shadow-gray-400 shadow-lg dark:bg-orange-400 dark:border-gray-400">
            <div className="overflow-hidden h-60 w-full rounded-t-xl">
                <img
                    className="w-full h-full rounded-xl object-cover scale-[0.95] origin-center transition-transform duration-300"
                    src="https://www.missintercontinental.de/wp-content/uploads/2022/08/miss-intercontinental-2022-zimbabwe-yollanda-elizabeth-chimbarami-sedcard-600x900.jpg"
                    alt={name}
                />
            </div>
            <div className="p-3">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <span>Votes:</span> {votes}
                </h5>
                <h4 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {name}
                </h4>
                <button
                    onClick={onVote}
                    className="inline-flex items-center w-28 p-1 py-2 mb-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    FREE VOTE
                    <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">{" "}</span>
                <button
                    onClick={onVote}
                    className="inline-flex items-center w-28 p-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    PAID VOTE
                    <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </button>
                <p>{pageantId}</p>
            </div>
        </div>
    );
}

export default ModelCard;
