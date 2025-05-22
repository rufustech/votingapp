"use client";

import { useEffect, useState } from "react";
import { urls } from "../constants";

export default function Dashboard() {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ name: "", bio: "", images: [], pageantId: "" });
  const [editingModel, setEditingModel] = useState(null);
  const [pageants, setPageants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setForm({ name: "", bio: "", images: [], pageantId: "" });
    setEditingModel(null);
  };

  const getPageantName = (id) => pageants.find(p => p._id === id)?.name || "Unknown";

  useEffect(() => {
    fetch(`${urls.url}/api/models`)
      .then((res) => res.json())
      .then(setModels)
      .catch((error) => console.error("Error fetching models:", error));

    fetch(`${urls.url}/api/pageants`)
      .then((res) => res.json())
      .then(setPageants)
      .catch((error) => console.error("Error fetching pageants:", error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) {
        console.warn("No files selected.");
        return;
      }
  
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
  
      console.log("Uploading files:", files);
  
      const res = await fetch(`${urls.url}/api/upload`, {
        method: "POST",
        body: formData,
      });
  
      const text = await res.text(); // Read raw response
      console.log("Raw response text:", text);
  
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
  
      const data = JSON.parse(text);
      console.log("Parsed JSON:", data);
  
      if (!data.success || !Array.isArray(data.images)) {
        throw new Error("Upload response missing images.");
      }
  
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data.images],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.\n" + error.message);
    }
  };
  

  const handleCreate = async () => {
    if (!form.name || !form.bio || !form.pageantId) {
      alert("Please fill in all required fields");
      return;
    }

    if (!form.images.length) {
      alert("Please upload at least one image");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${urls.url}/api/models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to create model");

      setModels((prev) => [...prev, data.model]);
      resetForm();
      alert("Model created successfully!");
    } catch (error) {
      console.error("Create failed:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${urls.url}/api/models/${editingModel._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setModels((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update model");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    editingModel ? await handleUpdate() : await handleCreate();
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this model?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${urls.url}/api/models/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete failed:", res.status, errorText);
      alert("Failed to delete model. Server responded with: " + errorText);
      return;
    }

    setModels((prev) => prev.filter((m) => m._id !== id));
    alert("Model deleted successfully.");
  } catch (err) {
    console.error("Delete request error:", err);
    alert("An error occurred while deleting the model.");
  }
};


  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold text-[#9c27b0] mb-6 text-center">Model Dashboard</h1>

      <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Model Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
        />
        <div className="flex gap-2 flex-wrap">
          {form.images.map((url, i) => (
            <img key={i} src={url} alt={`Uploaded ${i}`} className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>
        <select
          name="pageantId"
          value={form.pageantId}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Pageant</option>
          {pageants.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded shadow"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : editingModel ? "Update Model" : "Create Model"}
          </button>
          {editingModel && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded shadow"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model._id} className="bg-white rounded-lg shadow-md p-5">
            <h2 className="text-xl font-bold mb-1">{model.name}</h2>
            <p className="text-sm mb-1">{model.bio}</p>
            <p className="text-xs text-gray-500 mb-3">
              Pageant: {getPageantName(model.pageantId)}
            </p>
            {model.images?.[0] && (
              <img
                src={model.images[0]}
                alt={model.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setEditingModel(model);
                  setForm({
                    name: model.name,
                    bio: model.bio,
                    images: model.images,
                    pageantId: model.pageantId?._id || model.pageantId || "",
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
