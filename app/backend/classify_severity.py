from transformers import pipeline
import logging

# Load BERT model
try:
    classifier = pipeline('text-classification', model='bert-base-uncased')
except Exception as e:
    logging.error(f"Error loading NLP model: {e}")
    classifier = None

def classify_article_severity(text):
    """Classify article severity into low, medium, and high."""
    if not classifier:
        return 'unknown'

    try:
        result = classifier(text[:512])[0]
        label = result['label']

        # Map labels to severity levels
        if label == 'LABEL_0':
            return 'low'
        elif label == 'LABEL_1':
            return 'medium'
        elif label == 'LABEL_2':
            return 'high'
        else:
            return 'unknown'
    except Exception as e:
        logging.error(f"Error classifying severity: {e}")
        return 'unknown'
