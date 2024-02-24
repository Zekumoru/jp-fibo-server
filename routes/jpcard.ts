import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import JPCard, { IJPCard } from '../models/JPCard';
import asyncHandler from 'express-async-handler';
import { Types } from 'mongoose';
import jwtCookieAuth from '../middlewares/jwtCookieAuth';

const jpCardRouter = express.Router();

const createCard = async ({
  english,
  japanese,
  kana,
  romaji,
  progressive,
  level,
  date,
}: IJPCard & { date?: string }) => {
  const card = new JPCard({
    english,
    japanese,
    kana,
    romaji,
    progressive,
    level,
    createdAt: date ? new Date(date) : undefined,
  });
  await card.save();
};

const updateCard = async ({
  english,
  japanese,
  kana,
  romaji,
  progressive,
  level,
  date,
}: IJPCard & { date?: string }) => {
  const card = await JPCard.findOne({ japanese });
  if (!card) {
    throw new Error(
      `Could not update '${japanese}', it probably got removed before this operation completed.`
    );
  }

  const data: Partial<IJPCard> = {
    english,
    japanese,
    kana,
    romaji,
    progressive,
    level,
    createdAt: date ? new Date(date) : undefined,
  };
  card.overwrite(data);
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

const titleCase = (text: string) =>
  text.replace(
    /\w*/g,
    (token) => token.charAt(0).toUpperCase() + token.substring(1).toLowerCase()
  );

const createValidations = [
  generalValidation(body('japanese'), 'Japanese')
    .customSanitizer(titleCase)
    .custom(async (japanese) => {
      const card = await JPCard.findOne({ japanese });
      if (card) throw new Error(`Card '${japanese}' already exists`);
    }),
];

const updateValidations = [
  generalValidation(body('japanese'), 'Japanese')
    .customSanitizer(titleCase)
    .custom(async (japanese) => {
      const card = await JPCard.findOne({ japanese });
      if (!card) throw new Error(`Card '${japanese}' does not exist`);
    }),
];

const validations = [
  generalValidation(body('kana'), 'Kana'),
  generalValidation(body('english'), 'English'),
  generalValidation(body('romaji'), 'Romaji'),
  generalValidation(body('progressive'), 'Progressive'),
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
  jwtCookieAuth,
  ...createValidations,
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

    // await createCard(req.body);

    res.status(201).json({
      status: 201,
      message: 'Card has been added successfully.',
    });
  })
);

jpCardRouter.post(
  '/:japanese/update',
  ...updateValidations,
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

    await updateCard(req.body);

    res.json({
      status: 200,
      message: `Card '${req.body.japanese}' has been updated successfully!`,
    });
  })
);

/**
 * Extracts a JPCard-like object's JPCard's only properties.
 * @param card A JPCard-like object with extra properties.
 * @returns JPCard without extra properties.
 */
const extractCard = ({
  _id,
  createdAt,
  english,
  japanese,
  kana,
  level,
  progressive,
  romaji,
  type,
}: IJPCard & { _id: Types.ObjectId }): Omit<IJPCard, '_id'> & {
  id: string;
} => ({
  id: _id.toString(),
  createdAt,
  english,
  japanese,
  kana,
  level,
  progressive,
  romaji,
  type,
});

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
      card: extractCard(card),
    });
  })
);

const searchMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.search) return next();
    if (typeof req.query.search !== 'string') {
      res.json({
        status: 422,
        message: 'Invalid search string',
      });
      return;
    }

    const search = req.query.search.trim();
    if (search === '') {
      res.json({
        status: 422,
        message: 'Empty search string',
      });
      return;
    }

    let results: ReturnType<typeof extractCard>[] = [];
    try {
      results = (
        await JPCard.find<IJPCard>({
          japanese: new RegExp(`^${search}`),
        }).limit(10)
      ).map((result) => extractCard(result));
    } catch (e) {
      console.log(e);
    }

    res.json({
      status: 200,
      search,
      results,
    });
  }
);

jpCardRouter.get('/', searchMiddleware, (req, res) => {
  res.json({
    status: 200,
    message: 'Card route',
  });
});

export default jpCardRouter;
