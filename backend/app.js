require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000; // Default to 5000 if not set in environment

// Endpoint to fetch articles from NewsAPI based on the company name
app.get('/api/articles', async (req, res) => {
  const company = req.query.company;

  if (!company) {
    return res.status(400).json({ error: 'Company query parameter is required' });
  }

  try {
    // Fetch articles from NewsAPI
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: company,         // Company name to search for
        pageSize: 20,       // Number of articles to fetch
        apiKey: process.env.NEWS_API_KEY,  
      },
    });

    // Return the articles to the frontend
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch articles from NewsAPI' });
  }
});

app.get('/', (req, res) => {
    res.send('Welcome to the NewsAPI backend!');
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
