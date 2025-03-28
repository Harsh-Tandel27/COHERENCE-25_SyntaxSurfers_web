from flask import Blueprint, jsonify, current_app
from .fetch_news import fetch_and_store_news
from .classify_severity import classify_article_severity

bp = Blueprint('routes', __name__)

@bp.route('/fetch-news', methods=['GET'])
def fetch_news():
    """Fetch and store news articles."""
    fetch_and_store_news()
    return jsonify({'message': 'News fetched and stored successfully'}), 200

@bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Retrieve alerts with severity classification."""
    db = current_app.db
    alerts = []
    for doc in db.collection('news_articles').stream():
        article = doc.to_dict()
        severity = classify_article_severity(
            article.get('content') or article.get('description')
        )
        article['severity'] = severity
        alerts.append(article)

    return jsonify(alerts), 200
