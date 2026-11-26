[![One-Line Laugh-Off](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)
[![Rank](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae/WuYuanJie-211/u-zkhiel-one-line-laugh-off-714618ae/rank.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)
[![Reward](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae/WuYuanJie-211/u-zkhiel-one-line-laugh-off-714618ae/reward.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)

# One-Line Laugh-Off

Entry for the [One-Line Laugh-Off](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae) bounty on make.fun: exactly one funny line, a single joke that lands on a cold read.

## Entry

> The airline lost my luggage, found it in Lisbon, and mailed me a postcard that said, 'Having a great time without you.'

## How it works

`main.ts` holds the line as a constant, validates it (non-blank, exactly one line, at most 120 characters counted as Unicode code points, valid UTF-8 round-trip), writes it to `/output/entry.txt`, forces the file mode to 0644, then reads it back and asserts the content, the mode bits, and the byte length all match — exiting non-zero on any failure.

Run with Deno:

```sh
deno run --allow-write --allow-read main.ts
```
