import { useNavigate } from "react-router-dom";
import { PICKS } from "../data/picks";

export default function PicksSelector({ current }) {
  const navigate = useNavigate();

  function handleChange(e) {
    const name = e.target.value;
    if (name) {
      navigate(`/picks/${encodeURIComponent(name)}`);
    } else {
      navigate("/picks");
    }
  }

  return (
    <div className="picks-selector">
      <label className="picks-selector__label" htmlFor="picks-select">
        Participant:
      </label>
      <select
        id="picks-select"
        className="picks-selector__select"
        value={current || ""}
        onChange={handleChange}
      >
        <option value="">Select...</option>
        {PICKS.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
