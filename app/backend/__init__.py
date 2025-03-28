from flask import Flask
from firebase_admin import credentials, firestore, initialize_app
from config import Config

def create_app():
    """Initialize Flask app and Firestore client."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Firebase Initialization
    cred = credentials.Certificate(app.config['FIREBASE_CREDENTIALS_PATH'])
    initialize_app(cred)
    app.db = firestore.client()

    # Register API routes
    from .routes import bp
    app.register_blueprint(bp)

    return app
