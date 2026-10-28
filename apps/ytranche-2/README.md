# yTranche 2

A separate yTranche app (`@yearn/ytranche-2`) with a full-bleed “Clock out” hero: copy on the left,
the working USDC deposit/withdraw widget on the right, and the shared Yearn header above one continuous landscape.
On mobile, the copy sits above the widget. The page reuses the private `@yearn/site-header`,
`@yearn/vault-widget`, and `@yearn/wallet-ui` packages with its own Wagmi and TanStack Query providers.

The new Still variant and Meadow Light are the defaults. The landscape selector also offers Field Breeze and Coastal Flow.
All three use locally hosted, muted video loops with poster fallbacks for reduced motion and blocked autoplay.
The pause control stops ambient motion, and playback pauses while the tab is hidden.
Switching scenery keeps the widget mounted. Earlier illustrated studies remain in the source but are not in the selector.

The footer’s “Hero message” selector keeps the earlier options: “Clock out.”, “One less thing to watch.”,
and “Less chasing. More earning.” with their supporting copy. The headline remains largest, followed by a
uniform “5% APY” line and a smaller deposit link. The offer is labeled as fixed yield on USDC with an annual target.
Message and landscape selections are independent; changing either keeps the widget mounted.
This is marketing copy for the requested 5% offering, not a live onchain rate or realized APY; update it if the offering changes.
“How Fixed works” explains the yield/loss order, configurable target, and liquidity limitations.
The new “Still” option adds the Yearn | Still masthead, “Your USDC has a job. You have a life.”,
and “Earn 5% Fixed APY on USDC”. Its single hero link scrolls to the product explanation from
the supplied Miro reference: product, interactive yield/loss order, terms, and three expandable questions.
Native anchor scrolling respects reduced motion. The existing hero options retain their original links.
Still is a presentation name; the deployed vault/share identifiers are unchanged.

The widget opts into the shared `appearance="calm"` presentation: a warm ivory surface,
smaller action tabs, a larger amount field, and one wallet prompt. A receive estimate appears
for entered amounts, with share and approval information in a native Details disclosure.
The existing transaction review, approval, deposit, and withdrawal flows are retained.
Annual-return estimates are omitted until a realized APR is supplied.

From the workspace root:

```sh
bun install
bun run dev:ytranche-2
bun run tslint:ytranche-2
bun run build:ytranche-2
bun run preview:ytranche-2
```

Open http://127.0.0.1:3006. The widget is at `/`; `/earn-centered` redirects
to `/`, and `/deposit` redirects to `/#earn`. Live product data remains available
at `/api/products/usd-fixed`.
Copy `.env.example` to `.env.local` in this directory to customize Ethereum RPC
or enable WalletConnect. Injected wallets work without a WalletConnect project ID.

Deposits accept USDC on Ethereum into the senior Fixed tranche, `yvUSD-A`
(`0x2D4F47208853a3D20EADCbdA0F03900771C6Eba3`). Token routing and staking are
disabled. Withdrawals use explicit four-argument withdraw/redeem overloads with
`maxLoss = 0`, preserving the source app's loss policy. The controller target
is distinct from realized APR. The product endpoint exposes live tranche data.
Spot prices use the same public Yearn API adapter as yBOLD.

For Vercel, set Root Directory to `apps/ytranche-2` and enable access to files
outside the root directory. Use the detected Next.js build and output defaults.


## Fork preview deployment

The fork uses the separate `ytranche-2-preview` project in `w84aprils-projects`,
connected to `w84april/yearn.fi`. Its Root Directory is `apps/ytranche-2`;
source files outside that directory are enabled for the shared packages.
The project uses Node.js 22, `bun install --frozen-lockfile`, and `bun run build`.

Vercel’s Git integration creates Preview deployments for non-main branches,
including `codex/ytranche-2`. Automatic deployments from `main` are disabled,
so this setup does not publish a production deployment. No Yearn Doppler or
GitHub deployment secrets are needed for this preview.

The inherited Yearn, yBOLD, and ERC-4626 deployment jobs, their change detector,
and Yearn Telegram notification jobs run only in `yearn/yearn.fi`. Normal fork
checks remain enabled.

The project retains its existing Vercel sign-in protection. Use the branch’s
Preview URL from the [Vercel project dashboard](https://vercel.com/w84aprils-projects/ytranche-2-preview),
not the production project alias, which may have no deployment.
