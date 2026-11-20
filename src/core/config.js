/**
 * Core Configuration Module
 * Extension metadata and configuration constants
 */

// Type imports
/** @typedef {import('../types/inventory.js').InventoryV2} InventoryV2 */

export const extensionName = 'third-party/rpg-companion-sillytavern';

/**
 * Dynamically determine extension path based on current location
 * This supports both global (public/extensions) and user-specific (data/default-user/extensions) installations
 */
const currentScriptPath = import.meta.url;
const isUserExtension = currentScriptPath.includes('/data/') || currentScriptPath.includes('\\data\\');
export const extensionFolderPath = isUserExtension
    ? `data/default-user/extensions/${extensionName}`
    : `scripts/extensions/${extensionName}`;

/**
 * Default extension settings
 */
export const defaultSettings = {
    ruleset: 'fallout2d20',
    enabled: true,
    autoUpdate: true,
    updateDepth: 4, // How many messages to include in the context
    generationMode: 'together', // 'separate' or 'together' - whether to generate with main response or separately
    showUserStats: true,
    showInfoBox: true,
    showCharacterThoughts: true,
    showAlternatePresentCharactersPanel: false,
    enableThoughtBasedExpressions: false,
    hideDefaultExpressionDisplay: false,
    showInventory: true, // Show inventory section (v2 system)
    showQuests: true, // Show quests section
    showLockIcons: true, // Show lock/unlock icons on tracker items
    showThoughtsInChat: true, // Show thoughts overlay in chat
    thoughtsInChatStyle: 'corner', // 'corner' or 'inline'
    enableHtmlPrompt: false, // Enable immersive HTML prompt injection
    enableSpotifyMusic: false, // Enable Spotify music integration (asks AI for Spotify URLs)
    customSpotifyPrompt: '', // Custom Spotify prompt text (empty = use default)
    // Controls when the extension skips injecting tracker instructions/examples/HTML
    // into generations that appear to be user-injected instructions. Valid values:
    //  - 'none'          -> never skip (legacy behavior: always inject)
    //  - 'guided'        -> skip for any guided / instruct or quiet_prompt generation
    //  - 'impersonation' -> skip only for impersonation-style guided generations
    // This setting helps compatibility with other extensions like GuidedGenerations.
    skipInjectionsForGuided: 'none',
    enablePlotButtons: true, // Show plot progression buttons above chat input
    saveTrackerHistory: false, // Save tracker data in chat history for each message
    panelPosition: 'right', // 'left', 'right', or 'top'
    theme: 'pipboy', // Fallout Pip-Boy theme
    customColors: {
        bg: '#1a1a2e',
        accent: '#16213e',
        text: '#eaeaea',
        highlight: '#e94560'
    },
    statBarColorLow: '#cc3333', // Color for low stat values (red)
    statBarColorHigh: '#33cc66', // Color for high stat values (green)
    enableAnimations: true, // Enable smooth animations for stats and content updates
    mobileFabPosition: {
        top: 'calc(var(--topBarBlockSize) + 60px)',
        right: '12px'
    }, // Saved position for mobile FAB button
    userStats: {
        conditions: 'None',
        /** @type {InventoryV2} */
        inventory: {
            version: 2,
            onPerson: "None",
            stored: {},
            assets: "None"
        }
    },
    classicStats: {
        str: 5, per: 5, end: 5, cha: 5, int: 5, agi: 5, lck: 5
    },
    fallout: {
        version: 1,
        ruleset: 'fallout2d20',
        character: { name: '', level: 1, special: { str: 5, per: 5, end: 5, cha: 5, int: 5, agi: 5, lck: 5 }, skills: {}, perks: [] },
        resources: { hp: null, maxHp: null, actionPoints: 0, luckPoints: 0, fatigue: 0, radiation: 0 },
        conditions: [], injuries: [],
        survival: { enabled: false, hunger: { enabled: false, state: 'full', stateEnteredAt: null }, thirst: { enabled: false, state: 'quenched', stateEnteredAt: null }, sleep: { enabled: false, state: 'rested', lastRestAt: null } },
        campaignClock: { mode: 'manual', currentDate: null, currentTime: null, elapsedMinutes: 0, lastAdvanceReason: '' },
        equipment: { weapons: [], armour: [], ammunition: [], aid: [], miscellaneous: [] },
        settings: { aiUpdateMode: 'automatic' }
    },
    lastDiceRoll: null, // Store last dice roll result
    collapsedInventoryLocations: [] // Array of collapsed storage location names
};
