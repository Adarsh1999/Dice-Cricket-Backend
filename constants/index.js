/**
 * Application constants
 */

export const TEAMS = {
    AUSTRALIA: 'Australia',
    NEW_ZEALAND: 'New_Zealand',
    ENGLAND: 'England',
    INDIA: 'India',
    SOUTH_AFRICA: 'South_Africa'
};

export const VALID_TEAMS = Object.values(TEAMS);

export const GAME_STATUS = {
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    ABANDONED: 'abandoned'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const LIMITS = {
    MAX_WICKETS: 10,
    MIN_SCORE: 0,
    MAX_PLAYERS_PER_TEAM: 11,
    JSON_LIMIT: '10mb'
};

export const DICE_VALUES = [0, 1, 2, 3, 4, 6]; // 0 represents wicket

export const DEFAULT_PORT = 3001;
