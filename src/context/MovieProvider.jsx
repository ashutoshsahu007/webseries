import React, { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

const MovieContext = createContext(null);

const initialState = { entries: [] };

function reducer(state, action) {
  switch (action.type) {
    case "initialize":
      return { entries: action.payload };
    case "add": {
      const now = new Date().toISOString();
      const newEntry = {
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        ...action.payload,
      };
      return { entries: [newEntry, ...state.entries] };
    }
    case "update":
      return {
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? { ...action.payload, updatedAt: new Date().toISOString() }
            : e
        ),
      };
    case "delete":
      return { entries: state.entries.filter((e) => e.id !== action.payload) };
    default:
      return state;
  }
}

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem("movie_entries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: "initialize", payload: parsed });
      } catch (e) {
        console.warn("Failed to parse stored entries", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("movie_entries", JSON.stringify(state.entries));
  }, [state.entries]);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error("useMovies must be used inside MovieProvider");
  return ctx;
};
