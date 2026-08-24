import express, { type Request, type Response } from 'express';
import diaryService from '../services/diaryService.ts';
import { type DiaryEntry, type NonSensitiveDiaryEntry } from '../types.ts';
import { errorMiddleware } from '../middleware.ts';
import { parseNewDiaryEntry } from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  const data = diaryService.getNonSensitiveEntries();
  res.send(data);
});

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req: Request, res: Response<DiaryEntry | { error: string }>) => {
  try {
    const newDiaryEntry = parseNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: 'Invalid diary entry' });
    }
  }
});

router.use(errorMiddleware);

export default router;