import * as rl from 'readline'

export const waitForEnter = () => new Promise<void>(resolve => {
  const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  readline.question('Press ENTER to continue...', (ans) => {
    resolve();
    readline.close();
  });
});

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const headers = {
  "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  "accept-encoding": 'gzip, deflate, br',
  "accept-language": 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
  "referer": 'https://www.google.com/',
};

export const cookie = '_cmuid=9d1741d7-028d-4a36-96aa-2920edb24996; wdctx=v4.L_9PYVB-BKDvV5XpEYWYXphOXaem1-2rzhxIHbecqJiDzkDFGOkOmuZGXUzfIvYMkmuiaqlkqjxzLLoHSR3TGGT3kyuYIMm_ZzE_zNUQi1YhTWgpPDVZtVmzUQWaCW2iMXn04-wGQ8PYbAjzq1v2AAotCRa12gk4w8EIJQqMAFO6L_QJtnSJBbUVkFR0vpg7rRNtp8ciepHiBMLnmyTlfP9pbKR5xwxUqEEr9QPpzUxdQd9UHYeYXpeek1c; __gfp_64b=y8ZwAfdkyYi5V3sC2C3xeb7R9IeLwuR7_.2liRPZW6L.97|1668193715; datadome=JkOGwcatUgOYbEPYSjSDPQGBnUrtA9xmMV3FIF.sdG0qMJc.~G41cUDVrp8tAzdZdkQaHbMwoYsFnrzxSq8cX592fT8IV3JHJ~~8SQ~cKpW4QuFN0Ex7J0QZtgiJ5QV';
