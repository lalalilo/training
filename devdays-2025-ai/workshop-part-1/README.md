# LLM Grammar Checker

## Overview
In this exercise, you'll practice writing effective prompts for Large Language Models (LLMs) by creating a grammar checking system that can analyze both English and French sentences.

## Your Task
Write a prompt that gets an LLM to:
1. Determine if a sentence is grammatically correct
2. Explain why it's correct or incorrect

Example input data can be found in the following files:
- `en-input.txt`: 10 English sentences (mix of correct and incorrect)
- `fr-input.txt`: 10 French sentences (mix of correct and incorrect)

But feel free to try your own examples too and find ones that break your prompt!

## Bonus
If your're waiting for others to finish, you can:

- Make the LLM generate JSON with an format you specify
- Make the LLM output a severity level for the error (e.g. "minor", "major", "critical")
- Make the LLM suggest exercises to avoid making this mistake again
- Write a bash script that runs the LLM on all the sentences in the input files and evaluates its performance