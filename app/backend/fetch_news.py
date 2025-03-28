import requests
from flask import current_app
from datetime import datetime, timedelta
import logging

def fetch_and_store_news():
    """Fetch news articles from The News API and store them in Firestore."""
    api_key = current_app.config['NEWS_API_KEY']
    keywords = ['traffic', 'flood', 'accident', 'pollution']
    base_url = 'https://api.thenewsapi.com/v1/news/all'

    all_articles = []
    
    for keyword in keywords:
        params = {
            'api_token': api_key,
            'language': 'en',
            'search': keyword,
            'published_on': (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d')
        }
        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            articles = response.json().get('data', [])
            all_articles.extend(articles)
        except requests.RequestException as e:
            logging.error(f"Error fetching news: {e}")

    # Store in Firestore
    db = current_app.db
    for article in all_articles:
        doc_ref = db.collection('news_articles').document()
        doc_ref.set({
            'title': article['title'],
            'description': article['description'],
            'content': article.get('content', ''),
            'url': article['url'],
            'published_at': article['published_at'],
            'source': article['source'],
            'keyword': keyword,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
