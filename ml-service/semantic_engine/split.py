import re

def split_into_candidates(text: str):
    # Strong sentence boundaries only
    sentences = re.split(r'[.!?]', text)

    candidates = []
    for s in sentences:
        s = s.strip()
        if len(s.split()) >= 3:
            candidates.append(s)

    return candidates
