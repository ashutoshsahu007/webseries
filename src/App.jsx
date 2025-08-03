import "./App.css";
import { MovieProvider } from "./context/MovieProvider";
import { MovieTable } from "./components/MovieTable";

const App = () => {
  return (
    <MovieProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <MovieTable />
        </div>
      </div>
    </MovieProvider>
  );
};

export default App;
