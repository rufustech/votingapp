import React from "react";

function ModelCard() {
  return (
    <div className="lg:w-80 bg-white border border-gray-200 shadow-sm dark:bg-orange-400 dark:border-gray-700">
      <div className="">
        <img
          className="h-96 w-full object-cover"
          src="https://www.missintercontinental.de/wp-content/uploads/2022/08/miss-intercontinental-2022-zimbabwe-yollanda-elizabeth-chimbarami-sedcard-600x900.jpg"
          alt="Yollanda Chimbarami"
        />
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            1, 001
          </h5>
        </a>
        <h4 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Yollanda Chimbarami
        </h4>
        <a
          href="#"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          VOTE
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
        </a>
      </div>
    </div>
  );
}

export default ModelCard;
