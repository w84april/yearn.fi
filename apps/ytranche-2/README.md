# yTranche forest landing

The landing page uses the fixed-camera photographic forest set captured in Source,
with the warm ivory widget presentation from `codex/ytranche-2`.

## Run

```sh
bun install
bun run dev:ytranche-2
bun run tslint:ytranche-2
bun run build:ytranche-2
```

The default dev port is 3006. To run beside the original app:

```sh
cd apps/ytranche-2
bun run dev --port 3014
```

## Demo flow

- The foggy video loops until a mock deposit is confirmed.
- Enter an amount, review, then confirm. A 1.4-second local delay represents confirmation.
- Confirmation plays the four-second reveal once, then starts the sunny flower loop.
- Later deposits keep the sunny scene. Reset demo restores the fog and the initial balance.
- The mock widget starts with 10,000 USDC and supports deposits and withdrawals locally.
  No wallet, signature, RPC write, or transaction is involved. Balances reset on reload.
- The widget shares the original heading/surface, action tabs, and action button.
  The original live `DepositWidget` remains available in the codebase.

## Media and accessibility

Assets in `public/backgrounds/forest` are 1280×720 / 24fps H.264 composites
based on the photographic set captured in Source. The backgrounds use AI-edited photographic imagery;
they are not fully modeled 3D environments. The flowers fade in during the reveal.
The foggy and sunny clips repeat the same four-second water cycle twice.
Foliage uses actual temporal image detail from the supplied waterfall footage.
The left foliage and canopy retain the recorded leaf detail with a fitted colour
grade for each scene. The right flowering branch keeps the sunny artwork and follows
the much smaller motion measured there with optical flow. There is no procedural
wind displacement in the browser.
An eight-second foliage loop smoothly retimes two seconds of the reference forward
and back, while water keeps flowing forward. The four-second reveal finishes at the
midpoint of that cycle, so sunny playback begins at four seconds to match it.
The sunny backdrop is a clear-air image edit with the pale green mist removed.
Its distant tree detail stays visible after the reveal; recorded foreground foliage
and temporal water variation are composited onto that image. The reveal blends the
foggy clip into this clear scene, keeping its end phase aligned with the sunny loop.
The camera remains fixed, and the pre-deposit foggy loop is unchanged.

Three videos stay buffered as separate layers. The visible layer changes only when
its video starts playing, preserving the previous frame during loading; a short
opacity fade softens each handoff. The transition's ended event starts the sunny loop.
If the transition fails, playback falls back to the sunny scene. Muted inline playback
works without a wallet or audio permission. Hidden tabs pause all videos.
Reduced-motion users see the foggy still before confirmation and the sunny still
afterwards. Pause scene freezes playback; Play scene resumes it. Posters cover
autoplay failures.
