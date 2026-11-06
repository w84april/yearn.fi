# Senior landing concepts

Two independent marketing routes in the existing Yearn Next.js app:

- /senior — blue split composition
- /senior/meadow — white paper and engraved canopy composition

The blue edition uses Good ol’ Grey 100 (#F4F4F4) from the Yearn presskit for its neutral page backgrounds. The Paper edition keeps white backgrounds.

Run the normal app development command and open either route. These pages share content and use the existing Aeonik fonts and Yearn typemark. No new dependencies are needed. The shared Yearn header and deposit widget use the existing app WalletConnect and Ethereum RPC settings, with one wallet connection shared across the page.

The hero uses the selected Quiet classic pairing from the Yearn presskit: white (#FFFFFF) with black text for Deposit, and Good ol’ Grey 800 (#282828) with white text for Live data, which links to the onchain section. Meadow adds a thin black border to Deposit. The header Connect wallet button remains blue. The blue edition keeps the centered, non-interactive Learn more cue beneath the actions. The Paper edition places a non-interactive Learn more cue lower in the hero, using the same white rectangular treatment and black outline as Deposit, with a downward arrow to the right of the text. The former hero risk footnote is removed; the risk explanations in the content and deposit panel remain.

The hero artwork is local WebP in public/senior. Both illustrations were adapted from the approved Miro references, with the protruding bark knot removed. Text, navigation, controls and links are real page elements.

References:

- https://miro.com/app/board/uXjVEUYdeV8=/?moveToWidget=3458764689434059998
- https://miro.com/app/board/uXjVEUYdeV8=/?moveToWidget=3458764689434271730
- https://ytranche-git-separate-ui-w84aprils-projects.vercel.app/

## Content direction

Both editions keep the approved “Let it rest” hero and use the reference Earn page’s
“It’s easy.”, “It’s consistent.” and “It’s secure.” sequence. The copy explains deposits,
strategy allocation, withdrawals, the 5% annual target, the Senior/Junior waterfall,
supporting capital and the independent review in the existing quiet, unnumbered layout.
Withdrawal copy is specific to Senior: no tranche cooldown, with underlying liquidity
and protocol controls still applying. Risk qualifications sit alongside the benefits. “It’s easy.” fills the available viewport beneath the shared header, growing naturally when its content needs more room. The original heading, explanatory copy and three steps are retained. The section shares the 120px desktop padding and responsive gutters of “It’s consistent.” The data section begins directly with “Learn deeper.” and the FAQ leads straight into the footer; the closing “Take your time.” section has been removed.

“Learn deeper.” links directly to the reference’s institutions dashboard, which labels
Senior as Fixed, plus the deployed contracts, audit, YIP-91 and source. The separate
Yearn live activity link remains explicitly labeled as wider V3 activity. No deposit
total or other live metric is hardcoded into the marketing copy.

The yield/loss switch explains the priority order without invented metrics. Contract links use the Ethereum deployment documented in the tronche skill; the live activity dashboard is labeled as wider Yearn V3 activity. Deposit opens the calm Senior widget reused from apps/ytranche-2 in the earlier ytranche worktree, while the hero copy slides left. The app wrapper reads live ERC-4626 metadata, balances, deposit/withdrawal limits and fee-aware previews for the same fixed USDC tranche, disables token selection and staking, and preserves the original zero-loss direct withdrawal limit. Loading or read failures show a status/retry state rather than falling back to balance-only limits. The opt-in calm presentation lives in the shared vault-widget package; its default appearance is unchanged. The scoped SeniorDepositWidget.module.css skin adapts the earlier widget to the landing palette. The widget mounts in its hidden, inert panel when the page opens, starting its code and live vault reads before Deposit is clicked. It remains mounted when closed, preserving the entered amount. Its wallet and query providers are shared with the standard Yearn header. The header shows Connect wallet when disconnected and the account menu when connected. Senior uses a fixed white shared header with a blue Yearn logo and Senior suffix, without the status indicator, theme switch or direct Vaults link on desktop and mobile. The header reuses the footer’s exact Yearn/Senior wordmark, divider and lettering, with Senior and the navigation sharing a text baseline on desktop. Its wallet button uses blue with white text, the landing’s square corners and a larger gap after Portfolio; other routes keep their existing header presentation. The page shows the requested 5% target rate as marketing copy; it is not passed to the widget as realized APR. The widget reads live metadata, balances and limits. Both routes are excluded from search indexing through page metadata.

## Waterfall animation

The “It’s consistent.” diagram adapts `ProfitFlow` and its SVG stroke-dash and
CSS fill sequence from [w84april/yTranche PR #1](https://github.com/w84april/yTranche/pull/1),
revision `738fdccc1727ead380ada7f000f0f9f7c6cbf579`. It uses two positions, Senior
and Junior, with yield and loss views showing their respective priority orders.
The illustration uses the landing palette, square corners and ordinary case labels.
It is not a balance or return simulation. Playback can be paused, pauses offscreen,
and becomes a static illustration under reduced-motion preferences. No new runtime
or dependencies were added. The existing deposit contracts and execution are unchanged.

The loss view reverses the visual flow: the vault sits at the bottom, Junior above
it, and Senior at the top. The SVG channels draw upward. Junior's backing drains
first; Senior only begins to drain after Junior is exhausted. The loss list retains
its logical absorption order for assistive technology. With reduced motion, the
static diagram shows Junior depleted and Senior backed, alongside the risk explanation.

## Hero character edit
The blue hero uses `elder-oak-grey-100.webp`, a built-in image_gen edit targeting Good ol’ Grey 100 (#F4F4F4) paper while preserving the oak, woman and engraving. The original `elder-oak-dress.webp` is preserved. The exact prompt and paper-color notes are saved in `public/senior/grey-paper-hero-prompt.json`. The Paper hero uses `meadow-canopy-white-extended.webp`, a built-in image_gen continuation of `meadow-canopy-dress.webp` with a finished upper canopy and neutral white paper. The Paper hero lifts the copy and canopy together, allowing foliage to crop above the frame while keeping the meadow anchored at the bottom. The original Paper artwork is preserved for comparison. The continuation prompt and input role are recorded in `public/senior/paper-canopy-continuation-prompt.json`. Paper backgrounds, including the introduction, priority, data, footer and deposit panel, use white.
The seated figure now has a short bob, a round-neck puff-sleeve gathered dress
and a simple straw sun hat, following the supplied character reference. The
original engraved landscapes and resting pose are preserved. The previous
`elder-oak.webp` and `meadow-canopy.webp` remain available as source versions.
Both edits were made with the built-in image_gen tool; their exact prompts
and input roles are saved in `public/senior/character-edit-prompts.json`.

## Control design

Controls follow the sharp treatment in https://yearnfi-git-feat-landing-page-yearn.vercel.app/: square corners, flat surfaces, regular-weight Aeonik and restrained hover motion. Hero actions use the Quiet classic pairing, with a black Deposit outline on Meadow; the open form uses quiet dividers, underlined action tabs and plain USDC labeling. The large tree crop stays curved as part of the illustration composition.

## Archived footer artwork

Asset: public/senior/resting-book.webp. Generated with the built-in image_gen tool using meadow-canopy.webp as a style and world reference. The closed-book illustration is retained as an unused source asset after removal of the closing section.

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

## Open form

Both editions use the selected, unframed Open form presentation. The blue form
sits in the left hero column without moving or resizing the illustration. The
Meadow form is centered within the hero, with a soft white layer behind it for
readability. On mobile, both forms fit beneath the shared header and scroll when
needed. The comparison toolbar and alternate widget designs have been removed;
`/senior/widgets` and `/senior/meadow/widgets` redirect to their main landing pages.

The form reuses `VaultWidget` and the existing ERC-4626 reader, live limits,
previews, approval/deposit/withdrawal execution, shared wallet and `maxLoss = 0`
policy. Closing/reopening preserves the action and entered amount. Transaction
overlays retain opaque surfaces in both color schemes. Closed information
overlays are unmounted to keep them out of the focus and scroll flow.
