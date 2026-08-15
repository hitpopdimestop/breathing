# Spec: localization

## Objective

Provide typed Ukrainian and English strings for every Breathing-owned user-visible label, including phase names, settings, start, completion, and validation messages. Browser- or system-owned installation UI is outside the app dictionary.

## Contract

Both dictionaries expose the same key set. The phase labels are «Вдих», «Затримка дихання», «Видих», and «Затримка дихання» in Ukrainian, with equivalent concise English labels. No component writes a translated string inline.

## Acceptance Criteria

- Every Ukrainian key has an English counterpart and vice versa.
- Language selection is available before a session starts.
- The longer Ukrainian phase label remains readable on a narrow mobile viewport.
- Missing keys fail loudly in development rather than silently showing an empty label.

## Testing

Test dictionary key parity and render the start, settings, and active session states in both languages.

## Boundaries

- Must not perform network translation or load remote language data.
- Must not own persistence; `user-settings` stores the selected language.
- New user-visible text requires both dictionaries in the same change.

## Implementation Notes

The initial language follows browser locale: `uk` uses Ukrainian; all other locales use English.
