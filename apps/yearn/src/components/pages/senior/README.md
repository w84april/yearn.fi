# Senior landing concepts

Two independent marketing routes in the existing Yearn Next.js app:

- /senior — blue split composition
- /senior/meadow — paper and engraved canopy composition

Run the normal app development command and open either route. These pages share content and use the existing Aeonik fonts and Yearn typemark. No new dependencies are needed. The marketing pages need no environment variables; the deposit widget uses the existing app WalletConnect and Ethereum RPC settings.

The hero artwork is local WebP in public/senior. Both illustrations were adapted from the approved Miro references, with the protruding bark knot removed. Text, navigation, controls and links are real page elements.

References:

- https://miro.com/app/board/uXjVEUYdeV8=/?moveToWidget=3458764689434059998
- https://miro.com/app/board/uXjVEUYdeV8=/?moveToWidget=3458764689434271730

The yield/loss switch explains the priority order without invented metrics. Contract links use the Ethereum deployment documented in the tronche skill; the live activity dashboard is labeled as wider Yearn V3 activity. Deposit opens the calm Senior widget reused from apps/ytranche-2 in the earlier ytranche worktree, while the hero copy slides left. The app wrapper reads live ERC-4626 metadata, balances, deposit/withdrawal limits and fee-aware previews for the same fixed USDC tranche, disables token selection and staking, and preserves the original zero-loss direct withdrawal limit. Loading or read failures show a status/retry state rather than falling back to balance-only limits. The opt-in calm presentation lives in the shared vault-widget package; its default appearance is unchanged. The scoped SeniorDepositWidget.module.css skin adapts the earlier widget to the landing palette. The widget loads on first use and remains mounted when closed, preserving wallet and query state. The page shows the requested 5% target rate as marketing copy; it is not passed to the widget as realized APR. The widget reads live metadata, balances and limits. Both routes are excluded from search indexing through page metadata.

## Hero character edit

The current heroes use `elder-oak-dress.webp` and `meadow-canopy-dress.webp`.
The seated figure now has a short bob, a round-neck puff-sleeve gathered dress
and a simple straw sun hat, following the supplied character reference. The
original engraved landscapes and resting pose are preserved. The previous
`elder-oak.webp` and `meadow-canopy.webp` remain available as source versions.
Both edits were made with the built-in image_gen tool; their exact prompts
and input roles are saved in `public/senior/character-edit-prompts.json`.

## Control design

Buttons, the deposit panel, tabs and token controls follow the sharp treatment in https://yearnfi-git-feat-landing-page-yearn.vercel.app/: square corners, thin ink borders, flat surfaces, regular-weight Aeonik and restrained hover motion. The blue hero uses the inverse white button treatment. The large tree crop stays curved as part of the illustration composition.

## Footer artwork

Asset: public/senior/resting-book.webp. Generated with the built-in image_gen tool using meadow-canopy.webp as a style and world reference. A closed book in oak shade completes the rest/wisdom story with a quieter still life.

Generation prompt:

Use case: illustration-story. Asset type: wide website footer illustration, a new closing scene in the exact world of the reference. The reference image is STYLE and WORLD reference only, not an edit target. Create a wide landscape engraved illustration: a well-worn CLOSED clothbound book resting on a simple weathered wooden bench in the dappled shade of an old oak. A single natural oak leaf lies beside the book. Quiet meadow grasses and a faint distant field connect it to the reference's countryside. Intimate low eye-level still life; book, leaf and bench occupy the right half, with the book visibly set down to rest. Leave the left 50-55% mostly unprinted warm ivory paper with only the faintest landscape marks, so real website copy can be placed there later. Match the supplied reference's exquisite cobalt-blue copperplate engraving, botanical linework, delicate cross-hatching and warm lightly textured ivory paper. The mood is thoughtful, established, unhurried. No giant tree trunk or second grand tree scene. No people. No financial symbols, coins, charts, saplings, glowing objects or cartoon style. Absolutely no text, letters, logos or UI; the book cover is blank. Wide approximately 2:1 composition.

## Fork preview deployment

The separate `senior-preview` Vercel project in `w84aprils-projects` is connected
to `w84april/yearn.fi`. Root Directory is `apps/yearn`, with source files outside
the root enabled for the workspace packages. It uses Node.js 22,
`bun install --frozen-lockfile`, `bun run build` and the detected Next.js output.

Native Git integration deploys non-main branches, including
`codex/senior-tree-landings`. Automatic deployments from `main` are disabled.
The project uses Vercel sign-in protection; open `/senior` or `/senior/meadow`
on the branch Preview URL. No Yearn Doppler or GitHub deployment secrets are
required. The inherited Yearn deployment and Telegram notification jobs are
restricted to `yearn/yearn.fi`, while normal fork checks remain enabled.
