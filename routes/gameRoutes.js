import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateTeams, isValidObjectId } from '../utils/validation.js';
import diceGame from '../models/diceGame.js';
import playerNames from '../data/teams.js';

const router = express.Router();

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
