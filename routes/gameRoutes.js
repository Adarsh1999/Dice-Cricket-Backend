import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateTeams, isValidObjectId } from '../utils/validation.js';
import diceGame from '../models/diceGame.js';
import SavedMatch from '../models/savedMatch.js';
import playerNames from '../data/teams.js';

const router = express.Router();

const normalizeSavedMatchName = (name, snapshot) => {
    if (typeof name === 'string' && name.trim()) {
        return name.trim();
    }

    if (typeof snapshot?.saveName === 'string' && snapshot.saveName.trim()) {
        return snapshot.saveName.trim();
    }

    const team1 = snapshot?.state?.team1 || 'Team 1';
    const team2 = snapshot?.state?.team2 || 'Team 2';
    return `${team1} vs ${team2}`;
};

const validateSavedMatchSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== 'object') {
        return 'Saved match snapshot is required';
    }

    if (!snapshot.state || typeof snapshot.state !== 'object') {
        return 'Saved match state is required';
    }

    if (!snapshot.appState || typeof snapshot.appState !== 'object') {
        return 'Saved match app state is required';
    }

    if (!snapshot.state.team1 || !snapshot.state.team2) {
        return 'Saved match teams are required';
    }

    return null;
};

const toSavedMatchResponse = (savedMatch) => ({
    id: savedMatch.id,
    name: savedMatch.name,
    team1: savedMatch.team1,
    team2: savedMatch.team2,
    matchType: savedMatch.matchType,
    source: savedMatch.source,
    snapshot: savedMatch.snapshot,
    createdAt: savedMatch.createdAt,
    updatedAt: savedMatch.updatedAt,
});

/**
 * @route   GET /api/teams
 * @desc    Get team players for two selected teams
 * @access  Public
 * @query   q - First team name
 * @query   p - Second team name
 */
router.get('/teams', asyncHandler(async (req, res) => {
    const { q: team1, p: team2 } = req.query;

    const validation = validateTeams(team1, team2);
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            error: validation.message
        });
    }

    const response = {
        success: true,
        data: {
            team1: {
                name: team1,
                players: playerNames[team1]
            },
            team2: {
                name: team2,
                players: playerNames[team2]
            }
        }
    };

    res.json(response);
}));

/**
 * @route   GET /api/saved-matches
 * @desc    Get all saved in-progress matches
 * @access  Public
 */
router.get('/saved-matches', asyncHandler(async (req, res) => {
    const savedMatches = await SavedMatch.find({}).sort({ updatedAt: -1 });

    res.json({
        success: true,
        count: savedMatches.length,
        data: savedMatches.map(toSavedMatchResponse),
    });
}));

/**
 * @route   POST /api/saved-matches
 * @desc    Create a new saved in-progress match
 * @access  Public
 */
router.post('/saved-matches', asyncHandler(async (req, res) => {
    const { name, snapshot, source } = req.body;
    const snapshotError = validateSavedMatchSnapshot(snapshot);

    if (snapshotError) {
        return res.status(400).json({
            success: false,
            error: snapshotError,
        });
    }

    const resolvedName = normalizeSavedMatchName(name, snapshot);
    const matchType = snapshot.state.matchType === 'test' ? 'test' : 'oneday';
    const nextSnapshot = {
        ...snapshot,
        saveName: resolvedName,
    };

    const savedMatch = await SavedMatch.create({
        name: resolvedName,
        team1: snapshot.state.team1,
        team2: snapshot.state.team2,
        matchType,
        source: source === 'imported' ? 'imported' : 'manual',
        snapshot: nextSnapshot,
    });

    res.status(201).json({
        success: true,
        data: toSavedMatchResponse(savedMatch),
    });
}));

/**
 * @route   PUT /api/saved-matches/:id
 * @desc    Rename or replace an existing saved in-progress match
 * @access  Public
 */
router.put('/saved-matches/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid saved match ID format',
        });
    }

    const savedMatch = await SavedMatch.findById(id);

    if (!savedMatch) {
        return res.status(404).json({
            success: false,
            error: 'Saved match not found',
        });
    }

    const { name, snapshot, source } = req.body;
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    if (snapshot !== undefined) {
        const snapshotError = validateSavedMatchSnapshot(snapshot);

        if (snapshotError) {
            return res.status(400).json({
                success: false,
                error: snapshotError,
            });
        }

        const resolvedName = normalizeSavedMatchName(trimmedName || savedMatch.name, snapshot);
        savedMatch.snapshot = {
            ...snapshot,
            saveName: resolvedName,
        };
        savedMatch.name = resolvedName;
        savedMatch.team1 = snapshot.state.team1;
        savedMatch.team2 = snapshot.state.team2;
        savedMatch.matchType = snapshot.state.matchType === 'test' ? 'test' : 'oneday';
    } else if (trimmedName) {
        savedMatch.name = trimmedName;
        savedMatch.snapshot = {
            ...(savedMatch.snapshot || {}),
            saveName: trimmedName,
        };
    }

    if (source === 'manual' || source === 'imported') {
        savedMatch.source = source;
    }

    await savedMatch.save();

    res.json({
        success: true,
        data: toSavedMatchResponse(savedMatch),
    });
}));

/**
 * @route   DELETE /api/saved-matches/:id
 * @desc    Delete a saved in-progress match
 * @access  Public
 */
router.delete('/saved-matches/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid saved match ID format',
        });
    }

    const savedMatch = await SavedMatch.findByIdAndDelete(id);

    if (!savedMatch) {
        return res.status(404).json({
            success: false,
            error: 'Saved match not found',
        });
    }

    res.json({
        success: true,
        data: toSavedMatchResponse(savedMatch),
    });
}));

/**
 * @route   GET /api/history
 * @desc    Get all game history
 * @access  Public
 */
router.get('/history', asyncHandler(async (req, res) => {
    const games = await diceGame.find({}).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: games.length,
        data: games
    });
}));

/**
 * @route   POST /api/history
 * @desc    Create new game record
 * @access  Public
 */
router.post('/history', asyncHandler(async (req, res) => {
    const gameData = req.body;

    // Basic validation
    if (!gameData.team1 || !gameData.team2) {
        return res.status(400).json({
            success: false,
            error: 'Team1 and team2 are required'
        });
    }

    const game = await diceGame.create(gameData);

    res.status(201).json({
        success: true,
        data: game
    });
}));

/**
 * @route   DELETE /api/history
 * @desc    Delete all game history
 * @access  Public
 */
router.delete('/history', asyncHandler(async (req, res) => {
    const result = await diceGame.deleteMany({});

    res.json({
        success: true,
        message: `Deleted ${result.deletedCount} games`,
        deletedCount: result.deletedCount
    });
}));

/**
 * @route   GET /api/history/:id
 * @desc    Get game by ID
 * @access  Public
 */
router.get('/history/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid game ID format'
        });
    }

    const game = await diceGame.findById(id);

    if (!game) {
        return res.status(404).json({
            success: false,
            error: 'Game not found'
        });
    }

    res.json({
        success: true,
        data: game
    });
}));

/**
 * @route   GET /api/history/all
 * @desc    Get all game history
 * @access  Public
 */
router.get('/history/all', asyncHandler(async (req, res) => {
    const games = await diceGame.find({}).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: games.length,
        data: games
    });
}));

/**
 * @route   POST /api/history/new
 * @desc    Create new game record
 * @access  Public
 */
router.post('/history/new', asyncHandler(async (req, res) => {
    const gameData = req.body;

    // Basic validation
    if (!gameData.team1 || !gameData.team2) {
        return res.status(400).json({
            success: false,
            error: 'Team1 and team2 are required'
        });
    }

    const game = await diceGame.create(gameData);

    res.status(201).json({
        success: true,
        data: game
    });
}));

/**
 * @route   DELETE /api/history/all
 * @desc    Delete all game history
 * @access  Public
 */
router.delete('/history/all', asyncHandler(async (req, res) => {
    const result = await diceGame.deleteMany({});

    res.json({
        success: true,
        message: `Deleted ${result.deletedCount} games`,
        deletedCount: result.deletedCount
    });
}));

/**
 * @route   GET /api/history/find/:id
 * @desc    Get game by ID
 * @access  Public
 */
router.get('/history/find/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid game ID format'
        });
    }

    const game = await diceGame.findById(id);

    if (!game) {
        return res.status(404).json({
            success: false,
            error: 'Game not found'
        });
    }

    res.json({
        success: true,
        data: game
    });
}));

/**
 * @route   POST /api/history/find
 * @desc    Get game by ID (POST method with ID in body)
 * @access  Public
 */
router.post('/history/find', asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: 'Game ID is required in request body'
        });
    }

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid game ID format'
        });
    }

    const game = await diceGame.findById(id);

    if (!game) {
        return res.status(404).json({
            success: false,
            error: 'Game not found'
        });
    }

    res.json({
        success: true,
        data: game
    });
}));

export default router;
