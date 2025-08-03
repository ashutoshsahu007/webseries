import React, { useState } from "react";
import { useMovies } from "../context/MovieProvider";

/**
 * Props:
 *  initial: partial entry for edit
 *  onClose: fn
 *  isEdit: bool
 */
export const MovieForm = ({ initial = {}, onClose, isEdit = false }) => {
  const { dispatch } = useMovies();
  const [form, setForm] = useState({
    title: initial.title || "",
    type: initial.type || "Movie",
    director: initial.director || "",
    budget: initial.budget !== undefined ? String(initial.budget) : "",
    location: initial.location || "",
    duration: initial.duration || "",
    year: initial.year !== undefined ? String(initial.year) : "",
    notes: initial.notes || "",
  });
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.director.trim()) {
      setError("Director is required");
      return;
    }
    const payload = {
      title: form.title,
      type: form.type,
      director: form.director,
      budget: form.budget ? Number(form.budget) : undefined,
      location: form.location,
      duration: form.duration,
      year: form.year ? Number(form.year) : undefined,
      notes: form.notes,
    };

    if (isEdit && initial.id) {
      dispatch({
        type: "update",
        payload: { ...initial, ...payload, id: initial.id },
      });
    } else {
      dispatch({ type: "add", payload });
    }
    onClose();
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Entry" : "Add New Movie/Show"}
      </h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input
              required
              value={form.title}
              onChange={handleChange("title")}
              className="mt-1 block w-full rounded p-2 border"
              placeholder="Inception"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={form.type}
              onChange={handleChange("type")}
              className="mt-1 block w-full rounded p-2 border"
            >
              <option>Movie</option>
              <option>TV Show</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Director *</label>
          <input
            required
            value={form.director}
            onChange={handleChange("director")}
            className="mt-1 block w-full rounded p-2 border"
            placeholder="Christopher Nolan"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Budget</label>
            <input
              value={form.budget}
              onChange={handleChange("budget")}
              type="number"
              className="mt-1 block w-full rounded p-2 border"
              placeholder="160000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              value={form.location}
              onChange={handleChange("location")}
              className="mt-1 block w-full rounded p-2 border"
              placeholder="Los Angeles"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Duration</label>
            <input
              value={form.duration}
              onChange={handleChange("duration")}
              className="mt-1 block w-full rounded p-2 border"
              placeholder="2h 28m"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input
              value={form.year}
              onChange={handleChange("year")}
              type="number"
              className="mt-1 block w-full rounded p-2 border"
              placeholder="2010"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <input
              value={form.notes}
              onChange={handleChange("notes")}
              className="mt-1 block w-full rounded p-2 border"
              placeholder="Mind-bending thriller"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            {isEdit ? "Save Changes" : "Add Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};
