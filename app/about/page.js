"use client";

import Image from "next/image";

export default function About() {
  return (
    <div className="container mx-auto max-w-5xl mt-16 px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About Us</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          We make voting easy, fun, and impactful – from crowning beauty queens to recognizing corporate excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <Image
          src="/voting-app-showcase.jpg"
          alt="Voting Showcase"
          width={500}
          height={400}
          className="rounded-xl shadow-lg object-cover"
        />

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why We Exist</h2>
          <p className="text-gray-600 mb-4">
            We built this platform to empower organizations and event organizers with a seamless, secure, and engaging voting experience. Whether it's a Year-End Awards ceremony at a corporate firm, a glamorous beauty pageant, or a fan-voted music contest — we’ve got you covered.
          </p>
          <p className="text-gray-600">
            Our mission is simple: enable real-time, transparent voting with beautiful design and unbeatable ease of use. No paper ballots, no bias — just pure results.
          </p>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <Image src="/beauty.png" alt="Pageants" width={80} height={80} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Beauty Pageants</h3>
          <p className="text-gray-500 text-sm">Empowering the audience to crown their queen with live digital voting.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <Image src="/corporate.png" alt="Corporate" width={80} height={80} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Corporate Awards</h3>
          <p className="text-gray-500 text-sm">Streamline employee voting for annual awards, recognitions, and leadership polls.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <Image src="/music.png" alt="Music Awards" width={80} height={80} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Entertainment</h3>
          <p className="text-gray-500 text-sm">Let fans decide their favorites in music, film, and digital arts competitions.</p>
        </div>
      </div>
    </div>
  );
}