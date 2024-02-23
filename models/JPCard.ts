import { Schema, Types, model } from 'mongoose';
import kanaTable from '../misc/kana';
import levels from '../misc/levels';

interface IJPCardSchema {
  type: 'jp_card';
  japanese: string;
  kana: string;
  english: string;
  progressive: string;
  romaji: string;
  level: number;
  createdAt: Date;
}

export interface IJPCard extends IJPCardSchema {
  _id: Types.ObjectId;
}

const JPCardSchema = new Schema<IJPCardSchema>({
  type: {
    type: String,
    default: 'jp_card',
  },
  japanese: {
    type: String,
    maxlength: 300,
    required: true,
    trim: true,
  },
  kana: {
    type: String,
    maxlength: 300,
    required: true,
    trim: true,
  },
  english: {
    type: String,
    maxlength: 300,
    required: true,
    trim: true,
  },
  progressive: {
    type: String,
    maxlength: 300,
    required: true,
    trim: true,
  },
  romaji: {
    type: String,
    maxlength: 300,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    default: -1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('JPCard', JPCardSchema);
