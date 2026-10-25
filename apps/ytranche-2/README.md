# yTranche 2

A separate minimal yTranche app (`@yearn/ytranche-2`): the shared Yearn header and a USDC deposit/withdraw
widget centered within nine switchable backgrounds. The page reuses the private
`@yearn/site-header`, `@yearn/vault-widget`, and `@yearn/wallet-ui` packages.
It has its own Wagmi and TanStack Query providers;
Reown AppKit, Ethers, and the prototype transaction implementation are not used.

Blossom Flow is the default study: three water-lily pools represent Fixed,
Levered, and Equity. The “Read the flow” disclosure explains target accrual,
surplus allocation, and loss priority using the protocol settlement model.
Use the bottom selector to compare it with Cloud Falls, Ribbon River,
Floating Pools, Peach Cascade, Moonwater, Coastal Flow, Field Breeze, and Meadow Light.
The three video options use locally hosted, muted loops with still-frame fallbacks for reduced motion. The pause control stops ambient motion, and the
scenes respect reduced-motion preferences and pause while the tab is hidden.
Switching scenery keeps the widget mounted.

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
