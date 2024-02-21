const output: string[] = [];

{
  // MONOGRAPHS
  const input = `あいうえお
かきくけこ
さしすせそ
たちつてと
なにぬねの
はひふへほ
まみむめも
や ゆ よ
らりるれろ
わ   を
アイウエオ
カキクケコ
サシスセソ
タチツテト
ナニヌネノ
ハヒフヘホ
マミムメモ
ヤ ユ ヨ
ラリルレロ
ワ   ヲ`;

  const vowels = 'aiueo';
  const consonants = ' kstnhmyrw';
  input.split('\n').forEach((line, lineIndex) => {
    line.split('').forEach((token, tokenIndex) => {
      if (!token.trim()) return;

      const vowel = vowels.charAt(tokenIndex);
      const consonant = consonants.charAt(lineIndex % consonants.length).trim();
      let romaji = `${consonant}${vowel}`;
      if (romaji == 'si') romaji = 'shi';
      if (romaji == 'ti') romaji = 'chi';
      if (romaji == 'tu') romaji = 'tsu';
      if (romaji == 'hu') romaji = 'fu';
      output.push(`"${token}": "${romaji}",`);
    });
  });
}

{
  // MONOGRAPHS DIGRAPHS
  const input = `きゃ きゅ きょ
しゃ しゅ しょ
ちゃ ちゅ ちょ
にゃ にゅ にょ
ひゃ ひゅ ひょ
みゃ みゅ みょ
りゃ りゅ りょ
キャ キュ キョ
シャ シュ ショ
チャ チュ チョ
ニャ ニュ ニョ
ヒャ ヒュ ヒョ
ミャ ミュ ミョ
リャ リュ リョ`;

  const vowels = 'auo';
  const consonants = ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry'];
  input.split('\n').forEach((line, lineIndex) => {
    line.split(' ').forEach((token, tokenIndex) => {
      const vowel = vowels.charAt(tokenIndex);
      const consonant = consonants[lineIndex % consonants.length];
      const romaji = `${consonant}${vowel}`;
      output.push(`"${token}": "${romaji}",`);
    });
  });
}

{
  // MONOGRAPHS WITH DIACRITICS
  const input = `がぎぐげご
ざじずぜぞ
だぢづでど
ばびぶべぼ
ぱぴぷぺぽ
ガギグゲゴ
ゼジズゼゾ
ダヂヅデド
バビブベボ
パピプペポ`;

  const vowels = 'aiueo';
  const consonants = 'gzdbp';
  input.split('\n').forEach((line, lineIndex) => {
    line.split('').forEach((token, tokenIndex) => {
      if (!token.trim()) return;

      const vowel = vowels.charAt(tokenIndex);
      const consonant = consonants.charAt(lineIndex % consonants.length).trim();
      let romaji = `${consonant}${vowel}`;
      if (romaji == 'zi') romaji = 'ji';
      if (romaji == 'di') romaji = 'ji';
      if (romaji == 'du') romaji = 'zu';
      output.push(`"${token}": "${romaji}",`);
    });
  });
}

{
  // MONOGRAPHS DIGRAPHS WITH DIACRITICS
  const input = `ぎゃ ぎゅ ぎょ
じゃ じゅ じょ
ぢゃ ぢゅ ぢょ
びゃ びゅ びょ
ぴゃ ぴゅ ぴょ
ギャ ギュ ギョ
ジャ ジュ ジョ
ヂャ ヂュ ヂョ
ビャ ビュ ビョ
ピャ ピュ ピョ`;

  const vowels = 'auo';
  const consonants = ['gy', 'j', 'j', 'by', 'py'];
  input.split('\n').forEach((line, lineIndex) => {
    line.split(' ').forEach((token, tokenIndex) => {
      const vowel = vowels.charAt(tokenIndex);
      const consonant = consonants[lineIndex % consonants.length];
      const romaji = `${consonant}${vowel}`;
      output.push(`"${token}": "${romaji}",`);
    });
  });
}

console.log(output.join('\n'));
