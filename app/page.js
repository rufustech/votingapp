"use client"

import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

import { Poppins } from "next/font/google";
import Models from "./components/Models";

const poppins = Poppins({
  weight: [ "700"], // Ensure the correct weights
  subsets: ["latin"],
  variable: "--font-poppins",
});


export default function Home() {
   const [models, setModels] = useState([]);
    const [form, setForm] = useState({ name: "", bio: "", images: "", pageantId: "" });
    const [editingModel, setEditingModel] = useState(null);
  
    // Fetch models from the backend
 // Fetch models from the backend
 useEffect(() => {
  const fetchModels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/models");
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  fetchModels();
}, []);
  
    // Handle form input changes
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    // Submit form (Create or Update)
    const handleSubmit = async (e) => {
      e.preventDefault();
      const method = editingModel ? "PUT" : "POST";
      const url = editingModel ? `/api/models/${editingModel._id}` : "/api/models";
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      if (response.ok) {
        const updatedModel = await response.json();
        setModels((prev) =>
          editingModel
            ? prev.map((m) => (m._id === updatedModel._id ? updatedModel : m))
            : [...prev, updatedModel]
        );
        setForm({ name: "", bio: "", images: "", pageantId: "" });
        setEditingModel(null);
      }
    };
  return (
    <div>
      <div className="antialiased bg-gray-50 dark:bg-gray-200">
        <Header />
        
        {/* Sidebar */}
        <SideBar />
        <main className="p-4 md:ml-64 h-auto pt-20">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <section className="ezy__about12 light  pt-8 md:pt-8 bg-white dark:bg-[#fff] text-zinc-900 dark:text-zinc-900">
              <div className="container px-4">
                <div className="grid grid-cols-12 gap-5 justify-center items-center">
                  <div className="col-span-12 lg:col-span-6">
                    <div className="lg:px-7">
                    <h1 className={`${poppins.className} uppercase text-4xl md:text-5xl text-orange-600 leading-tight font-medium mb-2`}>
  Pageant Crown Vote
</h1>
                      <p className="text-lg leading-normal opacity-75 my-6">
                        Completely network collaborative web services via
                        user-centric initiatives. Quickly promote sticky testing
                        procedures collaborator before unique process
                        improvements. Since our inception set out in 2012, TalEx
                        has set out to disrupt inception the HR &amp;
                        Talent/Staffing Management industry. Purposefully
                        designed by our founders (Amrita Grewal and Julie Dacar)
                        to connect great companies and great talent.
                      </p>
                      <div className="mt-12">
                        <button className="bg-gray-900 text-white hover:bg-opacity-90 dark:bg-orange-600 hover:bg-orange-700 dark:text-white rounded-md px-7 py-2.5 transition">
                          Pageants
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <div className="flex justify-center lg:justify-start lg:ml-12">
                      <img
                        src="/pinkmodel.png"
                        alt="Pink Model"
                        className="max-w-full h-[700px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            <Models />
              
         
              <Dashboard />
            </section>
          </main>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
          </div>
          <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
          </div>
          <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
          </div> */}
        </main>
      </div>
    </div>
  );
}
