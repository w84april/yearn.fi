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

## Vercel previews

Use the separate `ytranche-2-preview` project in `w84aprils-projects`, connected
to `w84april/yearn.fi`. Its root directory is `apps/ytranche-2`, with source
files outside that directory included for the shared workspace packages.
Select Next.js and Node.js 22; install with `bun install --frozen-lockfile`
and build with `bun run build`.

Branch pushes create previews through Vercel's Git integration. The current
branch is `codex/ytranche-2-clean`; append `/widget-left` or `/deposit-reveal`
to its preview URL for the latest hero layouts. Automatic deployments from
`main` are disabled in this app's `vercel.json` so this project stays a preview.
Yearn's Doppler deployment jobs run only in `yearn/yearn.fi` and skip this fork.

## Hero copy options

The preview buttons switch between Original, Touch grass, Personality, and Nature
without resetting the amount, demo balance, background scene, or pause state.
Each route selects its initial variant; switching stays on that route. Reset demo
keeps the selected variant while clearing the mock position and restoring fog.

`/touch-grass` keeps the same forest and mock widget with a Fixed/USDC hero:
“Earn yield. Touch grass.” The copy focuses on a target APY and less rate-watching.
It does not display a fabricated APY or describe the target as guaranteed.
Two further hero options retain the same mock flow and forest media:

- `/personality`: “Your USDC has a job. You have a life.” Direct copy, a “Put USDC to work” action, and priority-yield proof.
- `/nature`: “Let your USDC earn / Let yourself wander.” Aeonik throughout, a lighter nature-led voice, and a “Let USDC earn” action.

Copy and layout can be selected independently. Two additional hero layouts use
the same mock balance, deposit flow, and synchronized video backgrounds:

- `/widget-left`: the widget on the left, with the hero copy and an illustrative “5% Fixed APY on USDC” rate on the right. On mobile the copy sits above the widget.
- `/deposit-reveal`: copy and a Deposit USDC button on the left. Clicking slides and fades the copy to the right while the widget enters from the left into the same position. Back to the view restores the copy without resetting the deposit amount or balance. Hidden panels are inert; keyboard focus follows the active panel. Reduced motion switches panels immediately.

Labels, navigation, widget text, and supporting copy are enlarged across all options.

Both use the existing Aeonik Regular and Bold assets for consistent typography.
Supporting copy takes its cues from the Yearn tone-of-voice guide: human language,
light humour, clear actions, and honest target-rate wording. Their approved headlines
remain unchanged, with variant-specific confirmation and footer copy.
The original “Let it flow” hero remains at `/`.

All forest options use the shared Yearn masthead, ecosystem/resources menus,
wallet entry point, and mobile navigation. Campaign copy ends with
“Less rate-watching. More living.” The extra rate note, product eyebrow,
custom header links, and Nature’s pre-deposit footer line are removed.

## Demo flow

- The foggy video loops until a mock deposit is confirmed.
- Enter an amount, review, then confirm. A 1.4-second local delay represents confirmation.
- Confirmation blends into the sunny flower loop over four seconds.
- Later deposits keep the sunny scene. Reset demo restores the fog and the initial balance.
- The mock widget starts with 10,000 USDC and supports deposits and withdrawals locally.
  No wallet, signature, RPC write, or transaction is involved. Balances reset on reload.
- The widget shares the original heading/surface, action tabs, and action button.
  The original live `DepositWidget` remains available in the codebase.

## Media and accessibility

The foggy and sunny loops in `public/backgrounds/forest` are 1280×720 / 60fps
H.264 composites based on the photographic set captured in Source. Each loop is
eight seconds / 480 frames. The 24fps composites are motion-interpolated to 60fps,
with neighbouring frames wrapped across the loop seam. A five-frame weighted
exposure blend smooths the water cadence; foreground foliage stays sharp outside
a short seam treatment. This is interpolated footage, not a native 60fps Source
capture. The unused `transition.mp4` source artifact remains 24fps. The backgrounds use AI-edited photographic imagery;
they are not fully modeled 3D environments. The flowers fade in during the reveal.
The foggy and sunny clips repeat the same four-second water cycle twice.
Foliage uses actual temporal image detail from the supplied waterfall footage.
The left foliage and canopy retain the recorded leaf detail with a fitted colour
grade for each scene. The right flowering branch keeps the sunny artwork and follows
the much smaller motion measured there with optical flow. There is no procedural
wind displacement in the browser.
An eight-second foliage loop smoothly retimes two seconds of the reference forward
and back, while water keeps flowing forward. Both weather loops use the same motion.
On confirmation, the sunny video seeks to the foggy video's current phase. Both
keep playing while a four-second eased opacity blend clears the fog and reveals
the flowers. This creates the intermediate weather in the browser instead of
cutting to the frame-zero transition clip. Only the sunny loop remains playing
once the blend completes. Pausing or hiding the page freezes both the video and
the blend; resuming aligns the loops again before continuing.
The sunny backdrop is a clear-air image edit with the pale green mist removed.
Its distant tree detail stays visible after the reveal; recorded foreground foliage
and temporal water variation are composited onto that image.
The camera and weather artwork remain fixed; only temporal motion is processed.

Two videos stay buffered as separate layers. The blend starts only after playback
is ready, preserving the foggy view during loading. The old `transition.mp4` is
retained as a source artifact and is no longer used by the page.
If playback fails, the matching weather poster is shown. Muted inline playback
works without a wallet or audio permission. Hidden tabs pause all videos.
Reduced-motion users see the foggy still before confirmation and the sunny still
afterwards. Pause scene freezes playback; Play scene resumes it. Posters cover
autoplay failures.
