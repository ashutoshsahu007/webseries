import React, { useState } from "react";
import { useMovies } from "../context/MovieProvider";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { MovieForm } from "./MovieForm";

export const MovieTable = () => {
  const { state, dispatch } = useMovies();
  const { displayItems, hasMore, observerRef } = useInfiniteScroll(
    state.entries,
    15
  );
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Delete this entry?")) {
      dispatch({ type: "delete", payload: id });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Movies & TV Shows</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Director</th>
              <th className="p-2 text-left">Budget</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Year</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((entry, idx) => {
              const isLast = idx === displayItems.length - 1;
              return (
                <tr
                  key={entry.id}
                  ref={isLast ? (node) => observerRef(node) : null}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-2">{entry.title}</td>
                  <td className="p-2">{entry.type}</td>
                  <td className="p-2">{entry.director}</td>
                  <td className="p-2">
                    {entry.budget !== undefined
                      ? `$${entry.budget.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="p-2">{entry.location || "-"}</td>
                  <td className="p-2">{entry.duration || "-"}</td>
                  <td className="p-2">{entry.year || "-"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => setEditing(entry)}
                      className="text-sm px-2 py-1 rounded bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-sm px-2 py-1 rounded bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {state.entries.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No entries yet. Click “Add New” to start your list.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="text-center py-4 text-sm text-gray-600">
          Loading more entries...
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <MovieForm onClose={() => setShowAdd(false)} />
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <MovieForm
            initial={editing}
            onClose={() => setEditing(null)}
            isEdit
          />
        </div>
      )}
    </div>
  );
};
