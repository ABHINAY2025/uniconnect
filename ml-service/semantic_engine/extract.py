import re

VERB_SPLITS = [
    "write", "explain", "implement", "design",
    "define", "describe", "reverse", "asked",
    "questions", "discussion"
]

STOP_PHRASES = [
    "round", "mostly", "started with", "ended with",
    "concluded", "experience", "interview"
]

def extract_atomic_units(chunks):
    atomic = []

    for chunk in chunks:
        # skip obvious junk
        if any(p in chunk for p in STOP_PHRASES):
            continue

        # split on commas
        parts = [p.strip() for p in chunk.split(",")]

        for part in parts:
            # split further on verbs
            exploded = [part]
            for v in VERB_SPLITS:
                temp = []
                for e in exploded:
                    temp.extend(e.split(v))
                exploded = temp

            for e in exploded:
                e = e.strip()
                if len(e.split()) >= 3:
                    atomic.append(e)

    return atomic
