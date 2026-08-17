import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h4>Page Not Found</h4>
      <p className="text-muted">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary rounded-pill px-4">
        Back to Home
      </Link>
    </div>
  );
}
