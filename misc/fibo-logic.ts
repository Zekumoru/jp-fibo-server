const sqrt5 = Math.sqrt(5);
const phi1 = (1 + sqrt5) / 2;
const phi2 = (1 - sqrt5) / 2;

// calculate Fibonacci using Binet's formula
const getFibo = (n: number) =>
  Math.floor((Math.pow(phi1, n) - Math.pow(phi2, n)) / sqrt5);

const baseExp = 1.2618;
let totalExp = 0;
for (let rank = 2; rank <= 15 + 1; rank++) {
  // fibo as in the Fibonacci sequence based on the rank.
  // The fibo number is the number of days between review sessions.
  // Meaning, if you studied in the third session (which had 3 Fibo days)
  // then the next session is in 5 days (because that's the next Fibo number).
  const fibo = getFibo(rank);

  // 9 + (n/1 + n/2 + n/3 + ... + n/n) [sort of]
  const balancer = 9 + rank * (Math.log(rank) - 1);
  // base * 2.1 ^ rank
  const exp = Math.ceil((baseExp * Math.pow(2.1, rank)) / balancer);

  // "Experience per day" is used as the experience to give to the user when
  // they get it right. The idea is that the user will always have cards to
  // study therefore always accumulating exp per card. The experience that the
  // user gets per card is given by the experience obtained from that single
  // card divided by the number of days (the Fibo number) that have passed.
  // This should give the same amount of experience as you'll get as if
  // you studied one single card everyday.
  const expd = Math.ceil(exp / fibo);

  // Penalty experience is the experience the user will get if they have already
  // done this rank before. Basically, users get demoted if they fail to
  // recall the card during their session.
  const pexp = Math.ceil(exp * 0.1);
  const pexpd = Math.ceil(expd * 0.5);

  console.log({ rank: rank - 1, fibo, exp, expd, pexp, pexpd });
  totalExp += exp;
}

console.log({ totalExp });
