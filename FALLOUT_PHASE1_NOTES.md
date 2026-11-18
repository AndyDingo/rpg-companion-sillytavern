# Fallout 2d20 Conversion – Phase 1

This fork is being adapted into a Fallout 2d20 companion. Phase 1 establishes the data model and safe migration foundation; it does not yet implement the full Fallout rules engine.

## Decisions captured

- Ruleset: `fallout2d20`
- Campaign clock: manual only
- AI update policy: automatic application of valid proposed updates (the validation layer is planned for a later phase)
- Survival configuration: one master `survival.enabled` switch with independent Hunger, Thirst and Sleep switches beneath it
- Interface theme: `pipboy`

## New Fallout state

`src/systems/fallout/schema.js` defines the canonical Fallout record and normalization helpers. The record contains:

- Character identity, level, SPECIAL, skills and perks
- HP, maximum HP, Action Points, Luck, Fatigue and Radiation resource slots
- Conditions and injuries
- Optional survival configuration and current Hunger/Thirst/Sleep states
- A manual campaign clock
- Typed equipment collections
- AI update policy

The data is stored per chat in `chat_metadata.rpg_companion.fallout` and restored when that chat is opened.

## Compatibility and migration

- Settings schema version is now 6.
- Existing inventory, quests, NPCs, Info Box data and SillyTavern integration are retained.
- Existing generic life-simulation fields are no longer part of the default user-stat model or visible default tracker configuration.
- Old generic fields are filtered during user-stat normalization. A few parser compatibility references remain intentionally until the AI integration phase replaces the legacy tracker parser end-to-end.
- Existing D&D-style attribute values are not silently reinterpreted as SPECIAL. New SPECIAL values initialise to 5, and the old attribute panel is repurposed to STR/PER/END/CHA/INT/AGI/LCK.

## Phase 1 limitations

- Hunger, Thirst and Sleep settings exist in the data schema, but the settings UI and time-based rules are not implemented yet.
- The campaign clock data structure exists, but there are no clock controls or transition calculations yet.
- AI update mode is recorded as `automatic`, but structured proposal validation is a later phase.
- HP/AP/Luck/Fatigue/Radiation fields are storage slots only; derived calculations and rules enforcement are not yet implemented.
- The Pip-Boy theme foundation is present; the full character-sheet redesign is a later phase.

## Validation performed

- JavaScript syntax check across all source `.js` files.
- JSON parsing check for English locale and extension manifest.
- Smoke test for Fallout defaults, SPECIAL clamping, survival defaults, manual clock and automatic AI update policy.

The repository locale validator could not be run because `fs-extra` is not installed in this environment.
