'use client'

import styles from '@pages/senior/SeniorLanding.module.css'
import AppHeader from '@shared/components/Header'
import { YearnVaultWidgetRuntimeProvider } from '@shared/contexts/YearnVaultWidgetRuntimeProvider'
import { MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { type MouseEvent, type ReactNode, useRef, useState } from 'react'
import { AppProviders } from '@/AppProviders'

type TSeniorLandingProps = { edition: 'blue' | 'paper' }

const SeniorDepositWidget = dynamic(() => import('@pages/senior/SeniorDepositWidget'), {
  ssr: false,
  loading: () => <p role="status">Loading the deposit widget…</p>
})

const SENIOR_CONTRACT = 'https://etherscan.io/address/0x2D4F47208853a3D20EADCbdA0F03900771C6Eba3#readContract'
const MAIN_VAULT = 'https://etherscan.io/address/0xDa87123895a043Ed3610155550177C54ce8ba49B#readContract'
const CONTROLLER = 'https://etherscan.io/address/0xF0145433E5289dd10712650dCd28333FA317eF36#readContract'
const MAIN_VAULT_PAGE = 'https://yearn.fi/vaults/1/0xDa87123895a043Ed3610155550177C54ce8ba49B'
const TRANCHE_DASHBOARD = 'https://ytranche-git-separate-ui-w84aprils-projects.vercel.app/institutions'
const AUDIT = 'https://www.chainsecurity.com/security-audit/yearn-ytranche'
const YIP_91 = 'https://gov.yearn.fi/t/yip-91-ytranche/14659'

const resources = [
  {
    title: 'Tranche dashboard',
    detail: 'Explore tranche balances, supporting capital, coverage and deposit capacity.',
    label: 'Live dashboard',
    href: TRANCHE_DASHBOARD
  },
  {
    title: 'Senior vault',
    detail: 'Inspect the vault, shares and transactions on Ethereum.',
    label: 'Etherscan',
    href: SENIOR_CONTRACT
  },
  {
    title: 'Underlying vault',
    detail: 'Follow the Yearn vault that puts the capital to work.',
    label: 'Etherscan',
    href: MAIN_VAULT
  },
  {
    title: 'Priority & accounting',
    detail: 'Read the controller behind targets, allocations and losses.',
    label: 'Etherscan',
    href: CONTROLLER
  },
  {
    title: 'Yearn live activity',
    detail: 'Explore the wider Yearn V3 transaction dashboard.',
    label: 'Live dashboard',
    href: 'https://live.yearn.dev/'
  }
]

const questions = [
  {
    question: 'What is Senior?',
    answer:
      'Senior is one of two positions in this yTranche structure, alongside Junior. You deposit USDC on Ethereum and receive shares representing your position. The shared Yearn V3 vault puts those funds to work across strategies on Ethereum and Layer 2 networks.'
  },
  {
    question: 'What does “senior” mean?',
    answer:
      'It describes your place in the order. Available yield goes to Senior first, up to its target. Junior capital sits beneath Senior and absorbs losses before it. That supporting capital is limited and changes over time. Senior does not mean insured or guaranteed.'
  },
  {
    question: 'Is the 5% rate guaranteed?',
    answer:
      'No. 5% is an annual target, not a guaranteed APY. The underlying vault earns variable yield, and yTranche gives Senior priority for available returns up to that target. Actual returns depend on vault performance, available backing and the current configuration. The target rate can change.'
  },
  {
    question: 'When can I withdraw?',
    answer:
      'Senior has no lockup or tranche withdrawal cooldown. You can request a withdrawal whenever you want, subject to available vault liquidity, withdrawal limits and protocol controls. Unforeseen market conditions may cause temporary periods of illiquidity. Check the available withdrawal amount in the widget.'
  },
  {
    question: 'What are the fees?',
    answer:
      'A 10% performance fee applies to earned yield in the underlying Yearn V3 vault. Review the current fees and terms on the underlying vault page before depositing.'
  },
  {
    question: 'Can I lose my USDC?',
    answer:
      'Yes. Losses can reach Senior if supporting capital and any available reserve are insufficient. Smart contract failures, strategy losses, governance changes, liquidity constraints and USDC losing its dollar peg are also risks. Independent review and a first-loss buffer do not remove those risks.'
  },
  {
    question: 'Where can I check the details myself?',
    answer:
      'Open the tranche dashboard above for live balances, supporting capital, claim coverage and capacity. It calls Senior “Fixed.” You can also inspect the deployed contracts, read the ChainSecurity assessment and review YIP-91. Yearn’s live activity dashboard shows wider V3 activity rather than dedicated Senior performance.'
  }
]

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d={down ? 'M12 4v16m-6-6 6 6 6-6' : 'M5 19 19 5M5 5h14v14'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Brand({ markOnly = false }: { markOnly?: boolean }) {
  const mark = (
    <>
      <span className={styles.wordmark} aria-hidden="true" />
      <span className={styles.brandDivider} />
      <span className={styles.brandName}>Senior</span>
    </>
  )

  return markOnly ? (
    <span className={styles.brand}>{mark}</span>
  ) : (
    <a href="#top" className={styles.brand} aria-label="Yearn Senior — back to top">
      {mark}
    </a>
  )
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Adapted from ProfitFlow in w84april/yTranche PR #1 (738fdccc): SVG channels and timed CSS fills.
function FlowChannel() {
  return (
    <svg
      className={styles.flowChannel}
      viewBox="0 0 100 52"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.flowTrack} d="M50 0V52" vectorEffect="non-scaling-stroke" />
      <path className={styles.flowStream} d="M50 0V52" pathLength={1} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function PriorityDiagram() {
  const [scenario, setScenario] = useState<'yield' | 'loss'>('yield')
  const [paused, setPaused] = useState(false)
  const diagram = useRef<HTMLDivElement>(null)
  const inView = useInView(diagram, { amount: 0.15 })
  const isYield = scenario === 'yield'
  const positions = isYield
    ? [
        { name: 'Senior', kind: 'senior', label: 'First in order', detail: '5% annual target' },
        { name: 'Junior', kind: 'junior', label: 'After the Senior target', detail: 'Remaining yield' }
      ]
    : [
        { name: 'Junior', kind: 'junior', label: 'First to absorb losses', detail: 'Supporting capital' },
        { name: 'Senior', kind: 'senior', label: 'If the buffer is exhausted', detail: 'Capital remains at risk' }
      ]

  return (
    <div ref={diagram} className={styles.priorityDemo} data-running={inView && !paused}>
      <fieldset className={styles.scenarioButtons} aria-label="Explore the priority order">
        <button type="button" aria-pressed={isYield} onClick={() => setScenario('yield')}>
          When there is yield <span aria-hidden="true">↗</span>
        </button>
        <button type="button" aria-pressed={!isYield} onClick={() => setScenario('loss')}>
          When there is a loss <span aria-hidden="true">↘</span>
        </button>
      </fieldset>
      <figure
        className={styles.profitFlow}
        data-scenario={scenario}
        aria-labelledby="flow-title"
        aria-describedby="flow-note"
        key={scenario}
      >
        <figcaption className={styles.flowCaption}>
          <span id="flow-title">{isYield ? 'Profit waterfall' : 'Loss absorption'}</span>
          <button
            className={styles.animationToggle}
            type="button"
            aria-label={paused ? 'Play animation' : 'Pause animation'}
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        </figcaption>
        <div className={styles.flowStage}>
          <div className={styles.flowSource}>
            <div>
              <span>{isYield ? 'Available yield' : 'Vault loss'}</span>
              <strong>Yearn V3 vault</strong>
            </div>
            <span className={styles.flowSourceMark} aria-hidden="true">
              V3
            </span>
          </div>
          <ol
            className={styles.flowSequence}
            aria-label={isYield ? 'Yield distribution order' : 'Loss absorption order'}
          >
            {positions.map((position) => (
              <li key={position.kind}>
                <FlowChannel />
                <div className={styles.flowNode} data-kind={position.kind}>
                  <span>{position.label}</span>
                  <strong>{position.name}</strong>
                  <em>{position.detail}</em>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className={styles.diagramNote} id="flow-note" aria-live="polite" aria-atomic="true">
          {isYield
            ? 'Available yield goes to Senior first, up to its target. Junior receives the remaining yield. The target is not guaranteed.'
            : 'Losses are absorbed from the bottom up: Junior first, after any available reserve. Senior is affected only if that backing runs out.'}
          <span>Illustrative sequence, not live balances.</span>
        </p>
      </figure>
      <a
        href="https://github.com/yearn/ytranche#settlement"
        target="_blank"
        rel="noreferrer"
        className={styles.textLink}
      >
        Read the full settlement rules <Arrow />
      </a>
    </div>
  )
}

export default function SeniorLanding({ edition }: TSeniorLandingProps) {
  const isBlue = edition === 'blue'
  const [depositState, setDepositState] = useState<'idle' | 'open' | 'closed'>('idle')
  const depositTrigger = useRef<HTMLElement | null>(null)
  const closeDepositButton = useRef<HTMLButtonElement | null>(null)
  const reduceMotion = useReducedMotion()
  const isDepositOpen = depositState === 'open'

  const openDeposit = (event: MouseEvent<HTMLButtonElement>) => {
    depositTrigger.current = event.currentTarget
    setDepositState('open')
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    requestAnimationFrame(() => closeDepositButton.current?.focus({ preventScroll: true }))
  }

  const closeDeposit = () => {
    setDepositState('closed')
    requestAnimationFrame(() => depositTrigger.current?.focus())
  }

  return (
    <AppProviders>
      <YearnVaultWidgetRuntimeProvider>
        <MotionConfig reducedMotion="user">
          <div
            className={`${styles.site} ${isBlue ? styles.blueEdition : styles.paperEdition}`}
            data-deposit-open={isDepositOpen}
          >
            <a className={styles.skipLink} href="#how-it-works" tabIndex={isDepositOpen ? -1 : 0} inert={isDepositOpen}>
              Skip to content
            </a>
            <div className={styles.sharedHeader} inert={isDepositOpen}>
              <AppHeader showStatus={false} variant="senior" brandContent={<Brand markOnly />} />
            </div>
            <main inert={isDepositOpen}>
              <section className={styles.hero} id="top" aria-labelledby="hero-title">
                <div className={styles.heroArt}>
                  <Image
                    src={isBlue ? '/senior/elder-oak-dress.webp' : '/senior/meadow-canopy-white-extended.webp'}
                    alt="An old oak above a quiet meadow, with a woman in a gathered dress and straw hat resting at its roots."
                    fill
                    unoptimized
                    sizes={isBlue ? '(max-width: 760px) 100vw, 65vw' : '100vw'}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <motion.div
                  className={styles.heroContent}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: isDepositOpen ? 0 : 1, x: isDepositOpen ? '-110vw' : 0, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={isDepositOpen}
                  inert={isDepositOpen}
                >
                  <h1 id="hero-title">Let it rest</h1>
                  <p className={styles.heroSubtitle}>
                    Earn on USDC
                    <br />
                    With Senior priority
                  </p>
                  <p className={styles.heroRate}>
                    <strong>5%</strong> target APY on USDC
                  </p>
                  <p className={styles.heroDescription}>
                    No lockups or cooldowns.
                    <br />
                    Protected from drawdowns through{' '}
                    <a href={YIP_91} target="_blank" rel="noreferrer">
                      yTranche
                    </a>{' '}
                    system.
                  </p>
                  <div className={styles.heroActionGroup}>
                    <div className={styles.heroActions}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={openDeposit}
                        aria-controls="senior-deposit"
                        aria-expanded={isDepositOpen}
                      >
                        Deposit <Arrow />
                      </button>
                      <a href="#onchain" className={`${styles.primaryButton} ${styles.secondaryButton}`}>
                        Live data <Arrow />
                      </a>
                    </div>
                    {isBlue && (
                      <p className={styles.learnMore}>
                        <span>Learn more</span>
                        <Arrow down />
                      </p>
                    )}
                  </div>
                </motion.div>
                {!isBlue && (
                  <p className={`${styles.primaryButton} ${styles.canopyCue}`} aria-hidden={isDepositOpen}>
                    <span>Learn more</span>
                    <Arrow down />
                  </p>
                )}
              </section>

              <section className={`${styles.section} ${styles.intro}`} id="how-it-works" aria-labelledby="intro-title">
                <Reveal className={styles.introHeading}>
                  <h2 id="intro-title">It’s easy.</h2>
                </Reveal>
                <Reveal className={styles.introCopy}>
                  <p className={styles.lead}>One deposit. Yearn takes care of the strategies.</p>
                  <p>
                    Start with USDC on Ethereum. Your shares represent your position, while Yearn handles the
                    allocation.
                  </p>
                  <a className={styles.textLink} href={MAIN_VAULT_PAGE} target="_blank" rel="noreferrer">
                    View the underlying vault <Arrow />
                  </a>
                </Reveal>
                <Reveal className={styles.steps}>
                  {[
                    [
                      'Deposit USDC',
                      'Choose an amount and confirm the deposit from your wallet. You receive shares in Senior.'
                    ],
                    [
                      'Yearn puts your funds to work',
                      'The shared Yearn V3 vault allocates funds across strategies on Ethereum and Layer 2 networks.'
                    ],
                    [
                      'Withdraw anytime',
                      'No lockups or cooldowns. Withdraw when you need to, subject to available vault liquidity and protocol controls.'
                    ]
                  ].map(([title, detail]) => (
                    <div className={styles.step} key={title}>
                      <h3>{title}</h3>
                      <p>{detail}</p>
                    </div>
                  ))}
                </Reveal>
              </section>

              <section
                className={`${styles.section} ${styles.priority}`}
                id="priority"
                aria-labelledby="priority-title"
              >
                <Reveal className={styles.priorityCopy}>
                  <h2 id="priority-title">It’s consistent.</h2>
                  <p>One vault. Two positions. A clear order.</p>
                  <p>
                    Senior receives available yield first, up to its 5% target. Junior receives the remaining yield and
                    provides supporting capital that absorbs losses before Senior.
                  </p>
                  <p className={styles.finePrint}>
                    5% is an annual target, not a guaranteed return. The target rate can change.
                  </p>
                </Reveal>
                <Reveal>
                  <PriorityDiagram />
                </Reveal>
              </section>

              <section className={`${styles.section} ${styles.terms}`} aria-labelledby="terms-title">
                <Reveal>
                  <h2 id="terms-title">It’s secure.</h2>
                  <p className={styles.lead}>Built in layers. Open to inspection.</p>
                  <p className={styles.securityNote}>
                    Supporting capital is limited. Strategy losses, smart contract failures and USDC losing its dollar
                    peg can affect your deposit. An audit is not a guarantee. Capital remains at risk.
                  </p>
                </Reveal>
                <Reveal className={styles.termsList}>
                  {[
                    {
                      title: 'First in the waterfall',
                      detail: 'Senior receives available vault yield before the other positions, up to its target.'
                    },
                    {
                      title: 'Under the canopy.',
                      detail:
                        'Junior capital stands behind your position, absorbing losses before Senior and giving your USDC a layer of protection.'
                    },
                    {
                      title: 'Independently reviewed',
                      detail:
                        'ChainSecurity reviewed the yTranche core contracts and published the scope and findings.',
                      href: AUDIT
                    }
                  ].map(({ title, detail, href }) => (
                    <div key={title}>
                      <h3>{title}</h3>
                      <p>{detail}</p>
                      {href && (
                        <a className={styles.textLink} href={href} target="_blank" rel="noreferrer">
                          Read the assessment <Arrow />
                        </a>
                      )}
                    </div>
                  ))}
                </Reveal>
              </section>

              <section className={`${styles.section} ${styles.onchain}`} id="onchain" aria-labelledby="onchain-title">
                <Reveal className={styles.onchainHeading}>
                  <h2 id="onchain-title">Learn deeper.</h2>
                </Reveal>
                <Reveal className={styles.resourceList}>
                  {resources.map((resource) => (
                    <a
                      className={styles.resource}
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                      key={resource.href}
                    >
                      <span className={styles.resourceCopy}>
                        <strong>{resource.title}</strong>
                        <span>{resource.detail}</span>
                      </span>
                      <span className={styles.resourceLabel}>{resource.label}</span>
                      <Arrow />
                    </a>
                  ))}
                </Reveal>
                <div className={styles.resourceFoot}>
                  <a href={YIP_91} target="_blank" rel="noreferrer" className={styles.textLink}>
                    YIP-91 <Arrow />
                  </a>
                  <a href={AUDIT} target="_blank" rel="noreferrer" className={styles.textLink}>
                    Read the audit <Arrow />
                  </a>
                  <a
                    href="https://github.com/yearn/ytranche"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.textLink}
                  >
                    Explore the source <Arrow />
                  </a>
                </div>
              </section>

              <section className={`${styles.section} ${styles.faq}`} id="questions" aria-labelledby="faq-title">
                <Reveal>
                  <h2 id="faq-title">Good questions.</h2>
                  <a href="https://docs.yearn.fi/" target="_blank" rel="noreferrer" className={styles.textLink}>
                    Yearn documentation <Arrow />
                  </a>
                </Reveal>
                <Reveal className={styles.questions}>
                  {questions.map(({ question, answer }) => (
                    <details key={question} name="senior-questions">
                      <summary>
                        {question}
                        <span aria-hidden="true">+</span>
                      </summary>
                      <p>{answer}</p>
                    </details>
                  ))}
                </Reveal>
              </section>
            </main>
            {depositState !== 'idle' && (
              <motion.dialog
                open
                id="senior-deposit"
                className={styles.depositPanel}
                aria-labelledby="senior-deposit-title"
                aria-modal={true}
                aria-hidden={!isDepositOpen}
                inert={!isDepositOpen}
                initial={{ x: 'calc(-100% - 8vw)', opacity: 0 }}
                animate={{ x: isDepositOpen ? 0 : 'calc(-100% - 8vw)', opacity: isDepositOpen ? 1 : 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                onKeyDown={(event) => {
                  if (!event.currentTarget.contains(event.target as Node)) return
                  if (event.key === 'Escape') {
                    event.stopPropagation()
                    closeDeposit()
                  }
                  if (event.key === 'Tab') {
                    const controls = Array.from(
                      event.currentTarget.querySelectorAll<HTMLElement>(
                        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
                      )
                    ).filter((element) => element.getClientRects().length > 0)
                    const first = controls.at(0)
                    const last = controls.at(-1)
                    if ((event.shiftKey && event.target === first) || (!event.shiftKey && event.target === last)) {
                      event.preventDefault()
                      ;(event.shiftKey ? last : first)?.focus()
                    }
                  }
                }}
              >
                <div className={styles.depositPanelHeader}>
                  <div>
                    <h2 id="senior-deposit-title">Deposit into Senior</h2>
                    <p>USDC on Ethereum</p>
                  </div>
                  <button
                    ref={closeDepositButton}
                    type="button"
                    onClick={closeDeposit}
                    aria-label="Close deposit widget"
                  >
                    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <SeniorDepositWidget />
                <p className={styles.depositRisk}>
                  The target rate can change. Returns are not guaranteed. Capital is at risk.
                </p>
              </motion.dialog>
            )}
            <footer className={styles.footer} inert={isDepositOpen}>
              <Brand />
              <div className={styles.footerLinks}>
                <a href="https://docs.yearn.fi/" target="_blank" rel="noreferrer">
                  Docs <Arrow />
                </a>
                <a href="https://github.com/yearn/ytranche" target="_blank" rel="noreferrer">
                  Source <Arrow />
                </a>
                <Link href={isBlue ? '/senior/meadow' : '/senior'}>
                  {isBlue ? 'Paper edition' : 'Blue edition'} <Arrow />
                </Link>
              </div>
              <p>Built on Yearn. Rooted in transparency.</p>
            </footer>
          </div>
        </MotionConfig>
      </YearnVaultWidgetRuntimeProvider>
    </AppProviders>
  )
}
