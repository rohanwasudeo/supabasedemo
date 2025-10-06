import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./style.css";

function App() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessage() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("message")
        .select("message")
        .limit(2); // Only need to know if >1 row
      if (error) {
        setError("Failed to fetch message.");
        setLoading(false);
        return;
      }
      if (data && data.length === 1) {
        setMessage(data[0].message);
      } else if (data && data.length > 1) {
        setMessage(data.map(row => row.message));
      } else {
        setMessage(null);
      }
      setLoading(false);
    }
    fetchMessage();
  }, []);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center animate__animated animate__fadeInDown w-100">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">{error}</div>
        ) : Array.isArray(message) ? (
          <div>
            <h1 className="display-6 fw-bold mb-3">Messages</h1>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {message.map((msg, idx) => (
                    <tr key={idx}>
                      <td>{msg || <span className="text-muted">(No message)</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <h1 className="display-4 fw-bold mb-3">{message || "No message found."}</h1>
            <p className="lead">Welcome to your simple React app.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
