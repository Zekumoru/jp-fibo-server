import express from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import JPCard, { IJPCard } from '../models/JPCard';
import asyncHandler from 'express-async-handler';

const jpCardRouter = express.Router();

const createCard = async ({
  english,
  japanese,
  kana,
  romaji,
  level,
  date,
}: IJPCard & { date?: string }) => {
  const card = new JPCard({
    english,
    japanese,
    kana,
    romaji,
    level,
    createdAt: date ? new Date(date) : undefined,
  });
  await card.save();
};

const generalValidation = (chain: ValidationChain, fieldName: string) => {
  return chain
    .trim()
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isLength({ max: 300 })
    .withMessage(`${fieldName} cannot have more than 300 characters`)
    .escape();
};

const validations = [
  generalValidation(body('japanese'), 'Japanese')
    .customSanitizer((japanese: string) =>
      // Title case
      japanese.replace(
        /\w*/g,
        (token) =>
          token.charAt(0).toUpperCase() + token.substring(1).toLowerCase()
      )
    )
    .custom(async (japanese) => {
      const card = await JPCard.findOne({ japanese });
      if (card) throw new Error(`Card '${japanese}' already exists`);
    }),
  generalValidation(body('kana'), 'Kana'),
  generalValidation(body('english'), 'English'),
  generalValidation(body('romaji'), 'Romaji'),
  body('level')
    .customSanitizer((level: string | undefined) => {
      if (level === '' || level === undefined) return -1;
      const processed = Number(level);
      if (isNaN(processed) || level.trim() === '') return NaN;
      return processed;
    })
    .custom((level: number) => {
      if (isNaN(level)) throw new Error(`Level is not a number`);
      return true;
    }),
  body('date').custom((date: string) => {
    if (date === undefined || date === '') return true;
    if (isNaN(new Date(date).getTime())) throw new Error('Invalid date');
    return true;
  }),
];

jpCardRouter.post(
  '/create',
  ...validations,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({
        status: 422,
        message: 'Card fields have errors.',
        errors: errors.mapped(),
      });
      return;
    }

    await createCard(req.body);

    res.status(201).json({
      status: 201,
      message: 'Card has been added successfully.',
    });
  })
);

jpCardRouter.get(
  '/:japanese',
  asyncHandler(async (req, res) => {
    const card = await JPCard.findOne<IJPCard>({
      japanese: req.params.japanese,
    });
    if (!card) {
      res.status(404).json({
        status: 404,
        message: `Card '${req.params.japanese}' does not exist!`,
      });
      return;
    }

    res.json({
      status: 200,
      card: {
        id: card._id.toString(),
        type: card.type,
        japanese: card.japanese,
        english: card.english,
        kana: card.kana,
        progressive: card.progressive,
        romaji: card.romaji,
        createdAt: card.createdAt,
      },
    });
  })
);

jpCardRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Card route',
  });
});

export default jpCardRouter;
