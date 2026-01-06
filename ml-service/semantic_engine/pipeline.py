from semantic_engine.normalize import normalize_text
from semantic_engine.split import split_into_candidates
from semantic_engine.extract import extract_atomic_units

def process_experience(raw_text: str):
    normalized = normalize_text(raw_text)
    candidates = split_into_candidates(normalized)
    atomic_units = extract_atomic_units(candidates)

    # Deduplicate while preserving order
    seen = set()
    final = []
    for a in atomic_units:
        if a not in seen:
            seen.add(a)
            final.append(a)

    return final
