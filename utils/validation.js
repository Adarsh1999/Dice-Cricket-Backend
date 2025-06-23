import { VALID_TEAMS } from '../constants/index.js';

/**
 * Validates environment variables
 * @throws {Error} If required environment variables are missing
 */
const validateEnvironment = () => {
    const requiredVars = ['MONGODB_URL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};

/**
 * Validates team query parameters
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @returns {Object} Validation result
 */
const validateTeams = (team1, team2) => {
    if (!team1 || !team2) {
        return {
            valid: false,
            message: "Both team1 and team2 parameters are required"
        };
    }

    if (!VALID_TEAMS.includes(team1) || !VALID_TEAMS.includes(team2)) {
        return {
            valid: false,
            message: `Invalid team selection. Valid teams are: ${VALID_TEAMS.join(', ')}`
        };
    }

    if (team1 === team2) {
        return {
            valid: false,
            message: "Team1 and team2 cannot be the same"
        };
    }

    return { valid: true };
};

/**
 * Validates MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} True if valid ObjectId
 */
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export { validateEnvironment, validateTeams, isValidObjectId };
