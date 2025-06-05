import React from "react";
import Nav from "./Nav";

function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
      <Nav />
    </nav>
  );
}

export default Header;
