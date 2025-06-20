import { format } from 'date-fns';

console.log(format(new Date(), 'dd-MM-yyyy'));

const API_URL = 'https://fhqpdlxnvdysuarbifvf.supabase.co/rest/v1/article';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocXBkbHhudmR5c3VhcmJpZnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDgwNTcsImV4cCI6MjA2MzkyNDA1N30.NI6W2AJ6xucF22Ah13Me6Uj3iZsDsVUFNj8g8GtHzAg';

const sortSelect = document.getElementById('sort');

async function fetchArticles(orderBy = 'created_at.desc') {
  try {
    const response = await fetch(`${API_URL}?select=*&order=${orderBy}`, {
      headers: { apikey: API_KEY }
    });
    const data = await response.json();

    const container = document.getElementById('articles');
    container.innerHTML = '';

    data.forEach(article => {
      const formattedDate = format(new Date(article.created_at), 'dd-MM-yyyy');
      const el = document.createElement('div');
      el.innerHTML = `
        <h3>${article.title}</h3>
        <h4>${article.subtitle}</h4>
        <p><strong>Autor:</strong> ${article.author}</p>
        <p><strong>Data:</strong> ${formattedDate}</p>
        <p>${article.content}</p>
        <hr>
      `;
      container.appendChild(el);
    });
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function createNewArticle(articleData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        apikey: API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    });

    if (response.status !== 201) {
      throw new Error(`Status: ${response.status}`);
    }

    fetchArticles(sortSelect.value); 
  } catch (error) {
    console.error('POST error:', error);
  }
}

document.getElementById('articleForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const newArticle = {
    title: document.getElementById('title').value,
    subtitle: document.getElementById('subtitle').value,
    author: document.getElementById('author').value,
    content: document.getElementById('content').value,
    created_at: new Date(document.getElementById('created_at').value).toISOString()
  };
  createNewArticle(newArticle);
  this.reset();
});

sortSelect.addEventListener('change', () => {
  fetchArticles(sortSelect.value);
});

fetchArticles(sortSelect.value);
