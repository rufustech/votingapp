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
  if (!id) return "No Pageant";

  const idString = typeof id === "object" && id._id ? id._id : String(id);

  const pageant = pageants.find((p) => String(p._id) === idString);

  return pageant ? pageant.name : "Unknown";
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8 mt-20">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Pageant Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              Manage Pageants
            </h2>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pageant Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter pageant name"
                  value={pageantForm.name}
                  onChange={(e) => setPageantForm({ ...pageantForm, name: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pageant ID</label>
                <input
                  type="number"
                  name="pageantId"
                  placeholder="Enter ID"
                  value={pageantForm.pageantId}
                  onChange={(e) => setPageantForm({ ...pageantForm, pageantId: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={pageantForm.startDate}
                  onChange={(e) => setPageantForm({ ...pageantForm, startDate: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={pageantForm.endDate}
                  onChange={(e) => setPageantForm({ ...pageantForm, endDate: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={pageantForm.status}
                  onChange={(e) => setPageantForm({ ...pageantForm, status: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>

            {/* Keep your exact button logic, just update the styling */}
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  editingPageant 
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
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
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
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
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Pageants List */}
          <div className="border-t border-gray-100">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Existing Pageants</h3>
              <div className="space-y-2">
                {pageants.map((p) => (
                  <div 
                    key={p._id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{p.name}</h4>
                      <p className="text-xs text-gray-500">
                        ID: {p.pageantId} • 
                        <span className={`ml-1 ${
                          p.status === 'ongoing' ? 'text-green-600' :
                          p.status === 'upcoming' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {p.status}
                        </span> • 
                        {p.startDate?.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
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
                        className="text-xs px-3 py-1 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
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
                        className="text-xs px-3 py-1 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
      Manage Models
    </h2>
  </div>

  <div className="p-6">
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Model Form Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter model name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            placeholder="Enter model bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Image Preview Grid */}
        {form.images.length > 0 && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-4 gap-4">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`Upload ${i + 1}`}
                    className={`w-full h-24 object-cover rounded-lg ${
                      i === mainImageIndex ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setMainImageIndex(i)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = [...form.images];
                      updatedImages.splice(i, 1);
                      setForm(prev => ({
                        ...prev,
                        images: updatedImages,
                      }));
                      if (mainImageIndex === i) setMainImageIndex(0);
                      else if (i < mainImageIndex) setMainImageIndex(prev => prev - 1);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                     </button>
                  {i === mainImageIndex && (
                    <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Pageant</label>
          <select
            name="pageantId"
            value={form.pageantId}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            required
          >
            <option value="">Choose a pageant</option>
            {pageants.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : editingModel
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? 'Processing...' : editingModel ? "Update Model" : "Create Model"}
        </button>
        {editingModel && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>

  {/* Models Grid */}
  <div className="border-t border-gray-100">
    <div className="p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Existing Models</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model._id} className="bg-gray-50 rounded-lg overflow-hidden group">
            {model.images?.[0] && (
              <div className="relative h-48">
                <img
                  src={model.images[0]}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-medium text-gray-800">{model.name}</h4>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{model.bio}</p>
              <p className="text-xs text-gray-400 mb-3">
                {getPageantName(model.pageantId)}
              </p>
              <div className="flex gap-2">
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
                  className="flex-1 text-xs px-3 py-1.5 rounded text-yellow-600 hover:bg-yellow-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(model._id)}
                  className="flex-1 text-xs px-3 py-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
);
}