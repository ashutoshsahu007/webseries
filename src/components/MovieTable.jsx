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
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          + Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse ">
          <thead className="bg-gray-100 sticky top-0 ">
            <tr>
              <th className="p-2 text-left border-1">Title</th>
              <th className="p-2 text-left border-1">Type</th>
              <th className="p-2 text-left border-1">Director</th>
              <th className="p-2 text-left border-1">Budget</th>
              <th className="p-2 text-left border-1">Location</th>
              <th className="p-2 text-left border-1">Duration</th>
              <th className="p-2 text-left border-1">Year</th>
              <th className="p-2 text-left border-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((entry, idx) => {
              const isLast = idx === displayItems.length - 1;
              return (
                <tr
                  key={entry.id}
                  ref={isLast ? (node) => observerRef(node) : null}
                  className=" hover:bg-gray-50"
                >
                  <td className="p-2 border-1">{entry.title}</td>
                  <td className="p-2 border-1">{entry.type}</td>
                  <td className="p-2 border-1">{entry.director}</td>
                  <td className="p-2 border-1">
                    {entry.budget !== undefined
                      ? `$${entry.budget.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="p-2 border-1">{entry.location || "-"}</td>
                  <td className="p-2 border-1">{entry.duration || "-"}</td>
                  <td className="p-2 border-1 ">{entry.year || "-"}</td>
                  <td className="p-2 border-1">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(entry)}
                        className="text-sm px-2 py-1 rounded cursor-pointer bg-yellow-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-sm px-2 py-1 cursor-pointer  rounded bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
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
