"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-6 py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradiadient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-6">
            Revolutionizing Digital Voting
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Where Dreams Meet Democracy: Creating Memorable Moments Through Fair & Engaging Voting Experiences
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 transform rotate-3 rounded-2xl" />
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden transform -rotate-3 transition-transform hover:rotate-0 duration-500">
              <Image
                src="/bkgrnd.jpg"
                alt="Voting Showcase"
                fill
                priority
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Transforming Dreams into Reality</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                We've reimagined the voting experience for the digital age. Our platform combines cutting-edge technology with intuitive design to create seamless, engaging, and trustworthy voting events.
              </p>
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="font-bold text-purple-600 text-2xl mb-1">50K+</h3>
                  <p className="text-sm text-gray-500">Votes Cast</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="font-bold text-pink-600 text-2xl mb-1">100%</h3>
                  <p className="text-sm text-gray-500">Secure</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Beauty Pageants",
              description: "Transform traditional pageants into interactive digital experiences where every vote counts.",
              image: "/crown.jpg",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              title: "Corporate Excellence",
              description: "Recognize and celebrate outstanding achievements in your organization.",
              image: "/crown.jpg",
              gradient: "from-blue-500 to-purple-500"
            },
            {
              title: "Entertainment Awards",
              description: "Let fans participate in choosing their favorites across entertainment categories.",
              image: "/crown.jpg",
              gradient: "from-pink-500 to-rose-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="relative h-64">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-80`} />
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-12 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Voting Experience?</h2>
            <p className="mb-8 text-purple-100">Join thousands of organizations who trust us with their voting needs.</p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Get Started Today
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
