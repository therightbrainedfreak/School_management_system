import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Verifying session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?action=login" replace />;
  }

  return children;
}