import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1 style={{ fontSize: "3rem" }}>404</h1>
      <p>Page not found.</p>
      <Link to="/">← Go back home</Link>
    </div>
  );
}
