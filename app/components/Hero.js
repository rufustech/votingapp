import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full">
      {/* Hero Section 1 */}
      <section
        className="h-[400px] bg-cover bg-center bg-black/60 bg-blend-overlay"
        style={{
          backgroundImage:
            "url('/pagentCrown.jpg')",
        }}
      >
        <div  className="h-full w-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <fieldset className="w-full max-w-xl border-2 border-yellow-400 bg-black/80 px-10 py-6 text-white font-serif">
              <legend className="text-yellow-400 uppercase text-sm tracking-widest">
                be impressed
              </legend>
              <h1 className="text-4xl font-bold font-[\'Abril_Fatface\'] tracking-wide mb-2">
                Classy Site
              </h1>
              <p className="mb-6">
                This is a classy site so it has a serious photo, classic font,
                and a gold and black colour palette.
              </p>
              <Link href="#scroll2">
                <button className="uppercase border-2 border-yellow-400 text-yellow-400 px-4 py-2 hover:bg-black">
                  click me
                </button>
              </Link>
            </fieldset>
          </div>
        </div>
      </section>
    </div>
  );
}
