"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environmental parameters
dotenv_1.default.config();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const doctorRoutes_1 = __importDefault(require("./routes/doctorRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const trackerRoutes_1 = __importDefault(require("./routes/trackerRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const knowledgeRoutes_1 = __importDefault(require("./routes/knowledgeRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware registration
app.use((0, cors_1.default)({
    origin: '*', // Allow all cross-origins for easy local evaluation
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// REST API Route mapping
app.use('/api/auth', authRoutes_1.default);
app.use('/api/doctors', doctorRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/health-tracker', trackerRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/knowledge', knowledgeRoutes_1.default);
app.use('/api/ai-assessment', aiRoutes_1.default);
// Base route for server health verification
app.get('/', (req, res) => {
    res.json({ message: 'AyurCare Express REST API Server is running successfully.' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});
// Start listening
app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
