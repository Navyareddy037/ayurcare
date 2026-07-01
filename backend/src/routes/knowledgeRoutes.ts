import { Router, Request, Response } from 'express';
import prisma from '../lib/db';

const router = Router();

// GET /api/knowledge: Query database for herbs and blogs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, type } = req.query;
    const whereClause: any = {};

    if (type) {
      whereClause.type = type as string;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { tags: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.knowledgeHubItem.findMany({
      where: whereClause,
      orderBy: { id: 'asc' }
    });

    return res.json({ success: true, items });
  } catch (error: any) {
    console.error('Knowledge GET error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
