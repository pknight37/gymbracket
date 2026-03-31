import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <NavLink to="/" className="site-nav__logo">
          GymBracket 2025
        </NavLink>
        <ul className="site-nav__links">
          <li>
            <NavLink to="/" end>
              Bracket
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </li>
          <li>
            <NavLink to="/picks">Picks</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
