import mongoose from 'mongoose';

const { Schema } = mongoose;

const hasValidSnapshotShape = (value) => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const state = value.state;
    const appState = value.appState;

    return Boolean(
        state &&
            appState &&
            typeof state.team1 === 'string' &&
            state.team1.trim() &&
            typeof state.team2 === 'string' &&
            state.team2.trim(),
    );
};

const savedMatchSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Save name is required'],
            trim: true,
            maxlength: [120, 'Save name cannot exceed 120 characters'],
        },
        team1: {
            type: String,
            required: [true, 'Team1 name is required'],
            trim: true,
        },
        team2: {
            type: String,
            required: [true, 'Team2 name is required'],
            trim: true,
        },
        matchType: {
            type: String,
            enum: ['oneday', 'test'],
            default: 'oneday',
        },
        source: {
            type: String,
            enum: ['manual', 'imported'],
            default: 'manual',
        },
        snapshot: {
            type: Schema.Types.Mixed,
            required: [true, 'Saved match snapshot is required'],
            validate: {
                validator: hasValidSnapshotShape,
                message: 'Saved match snapshot is invalid',
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

savedMatchSchema.index({ updatedAt: -1 });
savedMatchSchema.index({ team1: 1, team2: 1 });
savedMatchSchema.index({ matchType: 1, updatedAt: -1 });

export default mongoose.model('SavedMatch', savedMatchSchema, 'dicecricket_saved_matches');
