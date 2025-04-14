// /api/proxy.js
export default async function handler(req, res) {
    const apiUrl = process.env.API_URL || 'http://52.62.194.208:8000';
    
    try {
      const response = await fetch(`${apiUrl}/submit-capsule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to proxy request' });
    }
  }