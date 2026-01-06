import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) setAllowed(true);
        else setAllowed(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return allowed ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
