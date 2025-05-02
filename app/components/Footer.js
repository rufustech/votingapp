import React from 'react'

function Footer() {
  return (
    <div>
<footer className="w-full bg-gray-100 text-base-content py-8 ">
  <div className="max-w-screen-xl mx-auto px-4 text-center">
    <p className="text-xs dark:text-black">
      © {new Date().getFullYear()} - All rights reserved by Rocker Island - Rufaro Mucheri
    </p>
  </div>
</footer>

    </div>
  )
}

export default Footer
