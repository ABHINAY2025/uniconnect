import re

def normalize_text(text: str) -> str:
    text = text.lower()

    # Replace bullets, numbering, headings
    text = re.sub(r'\n+', '. ', text)
    text = re.sub(r'[\u2022•\-–]', '. ', text)
    text = re.sub(r'\d+\.', '. ', text)
    text = re.sub(r':', '. ', text)

    # Remove brackets but keep content
    text = re.sub(r'[\(\)]', ' ', text)

    # Normalize spaces
    text = re.sub(r'\s+', ' ', text)

    return text.strip()
