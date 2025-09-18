
import express from 'express';
import { db } from '../db/database';

const router = express.Router();

// Get all journal entries for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const entries = await db
      .selectFrom('journal_entries')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('timestamp', 'desc')
      .execute();
    res.json(entries);
  } catch (error) {
    console.error('Failed to fetch journal entries:', error);
    res.status(500).json({ message: 'Failed to fetch journal entries' });
  }
});

// Add a new journal entry
router.post('/', async (req, res) => {
  const { userId, text, poeticLine, tokensEarned } = req.body;

  if (!userId || !text) {
    res.status(400).json({ message: 'userId and text are required' });
    return;
  }

  try {
    // Check for entry count in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { count } = await db
      .selectFrom('journal_entries')
      .select(db.fn.count<number>('id').as('count'))
      .where('user_id', '=', userId)
      .where('timestamp', '>', twentyFourHoursAgo)
      .executeTakeFirstOrThrow();

    if (count >= 3) {
      res.status(429).json({ message: 'You can only post three journal entries every 24 hours.' });
      return;
    }

    const newEntry = await db
      .insertInto('journal_entries')
      .values({
        user_id: userId,
        text,
        poetic_line: poeticLine,
        tokens_earned: tokensEarned,
        timestamp: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Failed to add journal entry:', error);
    res.status(500).json({ message: 'Failed to add journal entry' });
  }
});

// Delete a journal entry
router.delete('/:entryId', async (req, res) => {
    const { entryId } = req.params;
    try {
        const result = await db
            .deleteFrom('journal_entries')
            .where('id', '=', parseInt(entryId, 10))
            .executeTakeFirst();

        if (result.numDeletedRows === 0n) {
            res.status(404).json({ message: 'Entry not found.' });
            return;
        }

        res.status(200).json({ message: 'Entry deleted successfully.' });
    } catch (error) {
        console.error('Failed to delete journal entry:', error);
        res.status(500).json({ message: 'Failed to delete journal entry.' });
    }
});

export default router;
