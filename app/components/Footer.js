import React from 'react'

function Footer() {
  return (
    <div>
<footer className="w-full bg-gray-50 text-base-content py-2 ">
  <div className="max-w-screen-xl mx-auto px-4 text-center">
    <p className="text-md dark:text-black">
      © {new Date().getFullYear()} - All rights reserved by Rocker Island 
    </p>
    <img src="/rufaro.png" alt="Logo" className="h-20 mx-auto mt-4" />
  </div>
</footer>

    </div>
  )
}

export default Footer
