import { Schema, Types, model } from 'mongoose';
import kanaTable from '../misc/kana';
import levels from '../misc/levels';

interface IJPCardSchema {
  type: 'jp_card';
  japanese: string;
  kana: string;
  english: string;
  romaji: string;
  level: number;
  createdAt: Date;
}

export interface IJPCard extends IJPCardSchema {
  _id: Types.ObjectId;
  progressive: string;
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

JPCardSchema.virtual<IJPCard>('progressive').get(function () {
  let ip = 0; // index pointer
  let rip = 0; // romaji index pointer
  const processed: string[] = [];
  while (ip < this.kana.length) {
    // move rip if there are spaces
    while (this.romaji.charAt(rip) == ' ') {
      processed.push(' ');
      rip++;
    }

    // get kana character
    let kana: string;
    if ('ゃゅょャュョ'.includes(this.kana.charAt(ip + 1))) {
      // check if digraph
      kana = this.kana.substring(ip, ip + 2);
      ip += 2;
    } else {
      kana = this.kana.substring(ip, ip + 1);
      ip++;
    }

    const romaji = kanaTable[kana];
    const isUnlocked = levels.reduce((isUnlocked, levelChars, level) => {
      if (level <= this.level && levelChars.includes(kana)) return true;
      return isUnlocked;
    }, false);
    if (isUnlocked) processed.push(kana);
    else processed.push(romaji);
    rip += romaji.length;
  }

  return processed.join('');
});

export default model('JPCard', JPCardSchema);
