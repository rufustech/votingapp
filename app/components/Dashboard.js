"use client"

import { useState, useEffect } from "react";
import { urls } from "../constants";

export default function Dashboard() {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ name: "", bio: "", images: "", pageantId: "" });
  const [editingModel, setEditingModel] = useState(null);
  const [pageants, setPageants] = useState([]);

  const resetForm = () => {
    setForm({ name: "", bio: "", images: "", pageantId: "" });
    setEditingModel(null);
  };

  useEffect(() => {
    fetch(`${urls.url}/api/models`)
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((error) => console.error("Error fetching models:", error));

    fetch(`${urls.url}/api/pageants`)
      .then((res) => res.json())
      .then((data) => setPageants(data))
      .catch((error) => console.error("Error fetching pageants:", error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const payload = {
      ...form,
      images: [form.images],
    };

    const response = await fetch(`${urls.url}/api/models`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const newModel = await response.json();
      setModels((prev) => [...prev, newModel]);
      resetForm();
    } else {
      const errorText = await response.text();
      console.error("Create failed:", response.status, errorText);
    }
  };

  const handleUpdate = async () => {
    const payload = {
      ...form,
      images: [form.images],
    };

    const response = await fetch(`${urls.url}/api/models/${editingModel._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedModel = await response.json();
      setModels((prev) =>
        prev.map((m) => (m._id === updatedModel._id ? updatedModel : m))
      );
      resetForm();
    } else {
      const errorText = await response.text();
      console.error("Update failed:", response.status, errorText);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    editingModel ? await handleUpdate() : await handleCreate();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;
    const response = await fetch(`/api/models/${id}`, { method: "DELETE" });
    if (response.ok) setModels(models.filter((m) => m._id !== id));
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Model Dashboard</h1>

      <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Model Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
          required
        />
        <input
          type="text"
          name="images"
          placeholder="Image URL"
          value={form.images}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
        <select
          name="pageantId"
          value={form.pageantId}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
          required
        >
          <option value="">Select Pageant</option>
          {pageants.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded shadow"
        >
          {editingModel ? "Update Model" : "Create Model"}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model._id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{model.name}</h2>
            <p className="text-gray-600 text-sm mb-1">{model.bio}</p>
            <p className="text-gray-400 text-sm mb-3">Pageant: {model.pageantId?.name}</p>
            <img
              src={model.images}
              alt={model.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setEditingModel(model);
                  setForm({
                    name: model.name,
                    bio: model.bio,
                    images: model.images,
                    pageantId: model.pageantId?._id || "",
                  });
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(model._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
