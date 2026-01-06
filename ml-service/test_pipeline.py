from semantic_engine.pipeline import process_experience

text = """
Mostly Project based questions along with basic dsa questions
(reverse a string, accessing a text file and find the count of a word).
Why do I choose to study GCP over Azure and AWS.
OOP questions like singleton class, interfaces.

Asked OS questions: Deadlock, prevention, Banker's algorithm.
Linked list question to remove a node and garbage collection.

React questions: state management in react, why react.
System design question on designing a food delivery system.
Family background and future goals.
"""

results = process_experience(text)

print("\nEXTRACTED SEMANTIC UNITS:\n")
for r in results:
    print("-", r)
