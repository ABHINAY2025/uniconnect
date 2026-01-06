from sklearn.metrics.pairwise import cosine_similarity
from semantic_engine.embed import embed

SUBJECT_ANCHORS = {
    "DSA": [
        "data structures algorithms coding problems complexity"
    ],
    "OS": [
        "operating system deadlock process memory scheduling"
    ],
    "DBMS": [
        "database sql normalization indexing transactions"
    ],
    "CLOUD / DEVOPS": [
        "cloud aws gcp azure deployment scalability"
    ],
    "FRONTEND": [
        "react frontend state management ui"
    ],
    "SYSTEM DESIGN": [
        "system design architecture scalability"
    ],
    "HR": [
        "hr behavioral teamwork relocation goals"
    ],
}

# Precompute anchor embeddings
ANCHOR_EMBEDS = {
    k: embed(v) for k, v in SUBJECT_ANCHORS.items()
}

def classify_unit(text: str):
    unit_emb = embed([text])[0]

    best_subject = None
    best_score = 0.0

    for subject, emb in ANCHOR_EMBEDS.items():
        score = cosine_similarity(
            [unit_emb], emb
        ).max()

        if score > best_score:
            best_score = score
            best_subject = subject

    return best_subject, round(float(best_score), 2)
