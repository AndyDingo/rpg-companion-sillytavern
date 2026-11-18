/**
 * Fallout 2d20 data schema and normalization helpers.
 * This module intentionally contains data defaults only; rule calculations are
 * introduced in later implementation phases.
 */

export const FALLOUT_DATA_VERSION = 1;

export const SPECIAL_ATTRIBUTES = [
    { id: 'str', name: 'STR', label: 'Strength' },
    { id: 'per', name: 'PER', label: 'Perception' },
    { id: 'end', name: 'END', label: 'Endurance' },
    { id: 'cha', name: 'CHA', label: 'Charisma' },
    { id: 'int', name: 'INT', label: 'Intelligence' },
    { id: 'agi', name: 'AGI', label: 'Agility' },
    { id: 'lck', name: 'LCK', label: 'Luck' }
];

export function createDefaultFalloutState() {
    return {
        version: FALLOUT_DATA_VERSION,
        ruleset: 'fallout2d20',
        character: {
            name: '',
            level: 1,
            special: {
                str: 5,
                per: 5,
                end: 5,
                cha: 5,
                int: 5,
                agi: 5,
                lck: 5
            },
            skills: {},
            perks: []
        },
        resources: {
            hp: null,
            maxHp: null,
            actionPoints: 0,
            luckPoints: 0,
            fatigue: 0,
            radiation: 0
        },
        conditions: [],
        injuries: [],
        survival: {
            enabled: false,
            hunger: { enabled: false, state: 'full', stateEnteredAt: null },
            thirst: { enabled: false, state: 'quenched', stateEnteredAt: null },
            sleep: { enabled: false, state: 'rested', lastRestAt: null }
        },
        campaignClock: {
            mode: 'manual',
            currentDate: null,
            currentTime: null,
            elapsedMinutes: 0,
            lastAdvanceReason: ''
        },
        equipment: {
            weapons: [],
            armour: [],
            ammunition: [],
            aid: [],
            miscellaneous: []
        },
        settings: {
            aiUpdateMode: 'automatic'
        }
    };
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeRecords(defaults, saved) {
    if (!isRecord(defaults)) return saved === undefined ? structuredClone(defaults) : saved;
    const result = structuredClone(defaults);
    if (!isRecord(saved)) return result;

    for (const [key, value] of Object.entries(saved)) {
        result[key] = isRecord(defaults[key]) && isRecord(value)
            ? mergeRecords(defaults[key], value)
            : (value === undefined ? result[key] : value);
    }
    return result;
}

/** Normalize a saved Fallout record without discarding future/unknown fields. */
export function normalizeFalloutState(savedState) {
    const defaults = createDefaultFalloutState();
    const normalized = mergeRecords(defaults, savedState);
    for (const key of ['character', 'resources', 'survival', 'campaignClock', 'equipment', 'settings']) {
        if (!isRecord(normalized[key])) normalized[key] = structuredClone(defaults[key]);
    }
    for (const key of ['special']) {
        if (!isRecord(normalized.character[key])) normalized.character[key] = structuredClone(defaults.character[key]);
    }
    for (const key of ['hunger', 'thirst', 'sleep']) {
        if (!isRecord(normalized.survival[key])) normalized.survival[key] = structuredClone(defaults.survival[key]);
    }
    normalized.version = FALLOUT_DATA_VERSION;
    normalized.ruleset = 'fallout2d20';
    normalized.campaignClock.mode = 'manual';
    normalized.settings.aiUpdateMode = 'automatic';

    const normalizedSpecial = {};
    for (const attribute of SPECIAL_ATTRIBUTES) {
        const value = Number(normalized.character.special[attribute.id]);
        normalizedSpecial[attribute.id] = Number.isFinite(value)
            ? Math.max(1, Math.min(10, Math.trunc(value)))
            : 5;
    }
    normalized.character.special = normalizedSpecial;

    normalized.character.level = Math.max(1, Math.trunc(Number(normalized.character.level) || 1));
    if (!isRecord(normalized.character.skills)) normalized.character.skills = {};
    if (!Array.isArray(normalized.character.perks)) normalized.character.perks = [];

    const nonNegativeNumber = value => Math.max(0, Number(value) || 0);
    for (const resource of ['actionPoints', 'luckPoints', 'fatigue', 'radiation']) {
        normalized.resources[resource] = nonNegativeNumber(normalized.resources[resource]);
    }
    for (const resource of ['hp', 'maxHp']) {
        const value = normalized.resources[resource];
        normalized.resources[resource] = value === null || value === undefined
            ? null
            : nonNegativeNumber(value);
    }

    normalized.survival.enabled = Boolean(normalized.survival.enabled);
    for (const need of ['hunger', 'thirst', 'sleep']) {
        normalized.survival[need].enabled = Boolean(normalized.survival[need].enabled);
    }
    if (!Array.isArray(normalized.conditions)) normalized.conditions = [];
    if (!Array.isArray(normalized.injuries)) normalized.injuries = [];
    if (!isRecord(normalized.equipment)) normalized.equipment = createDefaultFalloutState().equipment;
    for (const category of ['weapons', 'armour', 'ammunition', 'aid', 'miscellaneous']) {
        if (!Array.isArray(normalized.equipment[category])) normalized.equipment[category] = [];
    }
    normalized.campaignClock.elapsedMinutes = nonNegativeNumber(normalized.campaignClock.elapsedMinutes);
    if (typeof normalized.campaignClock.currentDate !== 'string') normalized.campaignClock.currentDate = null;
    if (typeof normalized.campaignClock.currentTime !== 'string') normalized.campaignClock.currentTime = null;
    if (typeof normalized.campaignClock.lastAdvanceReason !== 'string') normalized.campaignClock.lastAdvanceReason = '';

    return normalized;
}
