export default async function handler(req, res) {
    const API_URL = "http://localhost:5000/models"; // Adjust for your backend
    const { method, body, query } = req;
  
    const options = method !== "GET" ? { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {};
  
    try {
      const response = await fetch(`${API_URL}${query.id ? `/${query.id}` : ""}`, options);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Error connecting to backend" });
    }
  }
  