import React from "react";

function Footer() {
  return (
    <div>
      <footer className="w-full bg-gray-50  dark:bg-gray-900 text-base-content py-2 ">
        <div className="max-w-screen-xl mx-auto px-4 dark:border-t-1 dark:border-gray-100 text-center">
          <p className="text-md mt-2 dark:text-white">
            © {new Date().getFullYear()} - All rights reserved by Rocker Island
          </p>
          <img
            src="/rufaro.png"
            alt="Logo"
            className="h-20 mx-auto mt-4 dark:shadow-2xl dark:shadow-white"
          />
        </div>
      </footer>
    </div>
  );
}

export default Footer;
