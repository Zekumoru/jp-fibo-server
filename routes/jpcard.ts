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
}: IJPCard) => {
  const card = new JPCard({
    english,
    japanese,
    kana,
    romaji,
    level: level ?? -1,
    createdAt: new Date('2024/02/18 12:00'),
  });
  await card.save();
};

const generalValidation = (chain: ValidationChain, fieldName: string) => {
  return chain
    .trim()
    .isLength({ min: 0 })
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
  body('level').customSanitizer((level) => {
    if (level.trim() === '') return -1;
    const processed = Number(level);
    if (isNaN(processed)) return -1;
    return processed;
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
