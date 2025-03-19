"use client"

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ name: "", bio: "", images: "", pageantId: "" });
  const [editingModel, setEditingModel] = useState(null);

  // Fetch models from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/models")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((error) => console.error("Error fetching models:", error));
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

  // Delete a model
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;
    const response = await fetch(`/api/models/${id}`, { method: "DELETE" });
    if (response.ok) setModels(models.filter((m) => m._id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Model Dashboard</h1>

      {/* Model Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow rounded">
        <input
          type="text"
          name="name"
          placeholder="Model Name"
          value={form.name}
          onChange={handleChange}
          className="block w-full p-2 border mb-2"
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="block w-full p-2 border mb-2"
          required
        />
        <input
          type="text"
          name="images"
          placeholder="Image URL"
          value={form.images}
          onChange={handleChange}
          className="block w-full p-2 border mb-2"
        />
        <input
          type="text"
          name="pageantId"
          placeholder="Pageant ID"
          value={form.pageantId}
          onChange={handleChange}
          className="block w-full p-2 border mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingModel ? "Update Model" : "Create Model"}
        </button>
      </form>

      {/* Models List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model._id} className="bg-gray-100 p-4 shadow rounded">
            <h2 className="text-lg font-semibold">{model.name}</h2>
            <p className="text-sm">{model.bio}</p>
            <p className="text-sm text-gray-500">Pageant ID: {model.pageantId}</p>
            <img src={model.images} alt={model.name} className="w-full h-32 object-cover mt-2" />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => {
                  setEditingModel(model);
                  setForm(model);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(model._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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
