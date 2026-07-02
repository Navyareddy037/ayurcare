"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../lib/db"));
const router = (0, express_1.Router)();
// GET /api/knowledge: Query database for herbs and blogs
router.get('/', async (req, res) => {
    try {
        const { search, type } = req.query;
        const whereClause = {};
        if (type) {
            whereClause.type = type;
        }
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { tags: { contains: search, mode: 'insensitive' } }
            ];
        }
        const items = await db_1.default.knowledgeHubItem.findMany({
            where: whereClause,
            orderBy: { id: 'asc' }
        });
        return res.json({ success: true, items });
    }
    catch (error) {
        console.error('Knowledge GET error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
