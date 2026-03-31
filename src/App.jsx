import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Bracket from "./components/Bracket";
import Leaderboard from "./components/Leaderboard";
import PicksBracket from "./components/PicksBracket";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="main-content">
        <Routes>
          <Route path="/" element={<Bracket />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/picks/:name" element={<PicksBracket />} />
          <Route path="/picks" element={<PicksBracket />} />
        </Routes>
      </main>
    </>
  );
}
