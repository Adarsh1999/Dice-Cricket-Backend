import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @param {string} connectionUrl - MongoDB connection string
 * @returns {Promise} Connection promise
 */
const connectDB = async (connectionUrl) => {
    try {
        const connection = await mongoose.connect(connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${connection.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        return connection;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export { connectDB };
