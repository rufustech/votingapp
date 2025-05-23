"use client";

import { useEffect, useState } from "react";
import { urls } from "../constants";

export default function Dashboard() {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ name: "", bio: "", images: [], pageantId: "" });
  const [editingModel, setEditingModel] = useState(null);
  const [pageants, setPageants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [pageantForm, setPageantForm] = useState({
  name: "",
  pageantId: "",
  startDate: "",
  endDate: "",
  status: "Upcoming"
});
const [editingPageant, setEditingPageant] = useState(null);



  const resetForm = () => {
    setForm({ name: "", bio: "", images: [], pageantId: "" });
    setEditingModel(null);
  };

const getPageantName = (id) => {
  if (!id) {
    console.log("Pageant ID is null or undefined:", id);
    return "No Pageant"; // Handle case where pageantId is missing
  }

  // Log the pageantId and the pageants array to see what's being passed
  console.log("Looking for pageant with ID:", id);

  // Find the pageant by matching _id with the pageantId from the model
  const pageant = pageants.find((p) => p._id === String(id)); // Ensure the id is a string

  console.log("Found pageant:", pageant); // Log to verify the pageant is found
  return pageant ? pageant.name : "Unknown"; // Return the name if found, else "Unknown"
};







useEffect(() => {
  fetch(`${urls.url}/api/models`)
    .then((res) => res.json())
    .then(setModels)
    .catch((error) => console.error("Error fetching models:", error));

  fetch(`${urls.url}/api/pageants`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched pageants:", data); // Debugging line
      setPageants(data);
    })
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
setMainImageIndex(0); // first image becomes main

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
      {/* PAGEANT MANAGEMENT SECTION */}
<div className="mb-12 bg-white p-6 rounded-lg shadow-md space-y-4">
  <h2 className="text-2xl font-bold text-[#4caf50]">Manage Pageants</h2>
  
  <div className="grid md:grid-cols-2 gap-4">
    <input
      type="text"
      name="name"
      placeholder="Pageant Name"
      value={pageantForm.name}
      onChange={(e) => setPageantForm({ ...pageantForm, name: e.target.value })}
      className="w-full p-3 border rounded"
      required
    />
    <input
      type="number"
      name="pageantId"
      placeholder="Pageant ID"
      value={pageantForm.pageantId}
      onChange={(e) => setPageantForm({ ...pageantForm, pageantId: e.target.value })}
      className="w-full p-3 border rounded"
      required
    />
    <input
      type="date"
      name="startDate"
      value={pageantForm.startDate}
      onChange={(e) => setPageantForm({ ...pageantForm, startDate: e.target.value })}
      className="w-full p-3 border rounded"
    />
    <input
      type="date"
      name="endDate"
      value={pageantForm.endDate}
      onChange={(e) => setPageantForm({ ...pageantForm, endDate: e.target.value })}
      className="w-full p-3 border rounded"
    />
    <select
      name="status"
      value={pageantForm.status}
      onChange={(e) => setPageantForm({ ...pageantForm, status: e.target.value })}
      className="w-full p-3 border rounded"
    >
      <option value="Upcoming">Upcoming</option>
      <option value="ongoing">Ongoing</option>
      <option value="past">Past</option>
    </select>
  </div>

  <div className="flex gap-4">
    <button
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded shadow"
      onClick={async () => {
        const method = editingPageant ? "PUT" : "POST";
        const url = editingPageant
          ? `${urls.url}/api/pageants/${editingPageant._id}`
          : `${urls.url}/api/pageants`;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pageantForm),
        });

        const data = await res.json();

        if (res.ok) {
          if (editingPageant) {
            setPageants((prev) =>
              prev.map((p) => (p._id === data._id ? data : p))
            );
          } else {
            setPageants((prev) => [...prev, data]);
          }
          setPageantForm({
            name: "",
            pageantId: "",
            startDate: "",
            endDate: "",
            status: "Upcoming"
          });
          setEditingPageant(null);
          alert("Pageant saved!");
        } else {
          alert(data.message || "Failed to save pageant.");
        }
      }}
    >
      {editingPageant ? "Update Pageant" : "Create Pageant"}
    </button>

    {editingPageant && (
      <button
        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded shadow"
        onClick={() => {
          setPageantForm({
            name: "",
            pageantId: "",
            startDate: "",
            endDate: "",
            status: "Upcoming"
          });
          setEditingPageant(null);
        }}
      >
        Cancel Edit
      </button>
    )}
  </div>
</div>

{/* PAGEANT LIST SECTION */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Pageants</h2>
  <ul className="space-y-3">
    {pageants.map((p) => (
      <li key={p._id} className="flex justify-between items-center border-b pb-2">
        <div>
          <p className="font-semibold">{p.name}</p>
          <p className="text-sm text-gray-500">
            ID: {p.pageantId} | Status: {p.status} | Start: {p.startDate?.slice(0, 10)} | End: {p.endDate?.slice(0, 10)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="text-yellow-600 hover:underline"
            onClick={() => {
              setEditingPageant(p);
              setPageantForm({
                name: p.name,
                pageantId: p.pageantId,
                startDate: p.startDate?.slice(0, 10),
                endDate: p.endDate?.slice(0, 10),
                status: p.status
              });
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={async () => {
              const confirmDelete = window.confirm("Delete this pageant?");
              if (!confirmDelete) return;

              const res = await fetch(`${urls.url}/api/pageants/${p._id}`, {
                method: "DELETE"
              });

              if (res.ok) {
                setPageants((prev) => prev.filter((pg) => pg._id !== p._id));
                alert("Deleted!");
              } else {
                alert("Failed to delete pageant.");
              }
            }}
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

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
    <div key={i} className="relative">
      <img
        src={url}
        alt={`Uploaded ${i}`}
        className={`w-20 h-20 object-cover rounded border-2 ${
          i === mainImageIndex ? "border-blue-600" : "border-gray-300"
        } cursor-pointer`}
        onClick={() => setMainImageIndex(i)}
        title="Click to set as main image"
      />
      <button
        type="button"
        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        onClick={() => {
          const updatedImages = [...form.images];
          updatedImages.splice(i, 1);
          setForm((prev) => ({
            ...prev,
            images: updatedImages,
          }));
          if (mainImageIndex === i) setMainImageIndex(0);
          else if (i < mainImageIndex) setMainImageIndex((prev) => prev - 1);
        }}
        title="Remove image"
      >
        ×
      </button>
    </div>
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
        Pageant: {getPageantName(model.pageantId) || "No Pageant"}
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
