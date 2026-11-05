'use client'

import styles from '@pages/senior/SeniorLanding.module.css'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { type MouseEvent, type ReactNode, useRef, useState } from 'react'

type TSeniorLandingProps = { edition: 'blue' | 'paper' }

const SeniorDepositWidget = dynamic(() => import('@pages/senior/SeniorDepositWidget'), {
  ssr: false,
  loading: () => <p role="status">Loading the deposit widget…</p>
})

const SENIOR_CONTRACT = 'https://etherscan.io/address/0x2D4F47208853a3D20EADCbdA0F03900771C6Eba3#readContract'
const MAIN_VAULT = 'https://etherscan.io/address/0xDa87123895a043Ed3610155550177C54ce8ba49B#readContract'
const CONTROLLER = 'https://etherscan.io/address/0xF0145433E5289dd10712650dCd28333FA317eF36#readContract'

const resources = [
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
    question: 'What am I actually depositing into?',
    answer:
      'USDC is a stablecoin designed to track the US dollar. Senior is a position in a shared Yearn vault. You deposit USDC and receive vault shares representing your position. The underlying vault allocates capital to strategies that seek yield. A controller keeps track of how returns and losses are assigned between positions.'
  },
  {
    question: 'What does “senior” mean?',
    answer:
      'It describes your place in the order. Senior has priority for its target return, while more junior positions absorb settlement losses before Senior. Those junior positions form a limited buffer. “Senior” does not mean insured or guaranteed.'
  },
  {
    question: 'Is the yield fixed or guaranteed?',
    answer:
      'No. A target rate is an accounting target, not a promise of future returns. Actual returns depend on the underlying vault, available backing, settlement and the current configuration. A target and a historical APY are different measures; neither guarantees what you will earn.'
  },
  {
    question: 'When can I withdraw?',
    answer:
      'Withdrawals depend on available underlying liquidity and the current vault limits. Some positions may also have a cooldown and a withdrawal window. Check the current terms and available withdrawal amount in the vault before depositing.'
  },
  {
    question: 'Can I lose my USDC?',
    answer:
      'Yes. Losses can reach Senior if the available buffer is exhausted. Smart contract failures, strategy losses and USDC losing its dollar peg are also risks. The tree represents a position with a buffer, not a guarantee that your capital is safe.'
  },
  {
    question: 'Where can I check the details myself?',
    answer:
      'Start with the onchain links above: the Senior vault, the underlying vault and the controller. The yTranche source explains the accounting and settlement rules. Yearn’s live activity dashboard shows wider V3 activity; it is not a dedicated Senior performance dashboard.'
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

function Brand() {
  return (
    <a href="#top" className={styles.brand} aria-label="Yearn Senior — back to top">
      <span className={styles.wordmark} aria-hidden="true" />
      <span className={styles.brandDivider} />
      <span className={styles.brandName}>Senior</span>
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

function PriorityDiagram() {
  const [scenario, setScenario] = useState<'yield' | 'loss'>('yield')
  const isYield = scenario === 'yield'

  return (
    <div className={styles.priorityDemo}>
      <fieldset className={styles.scenarioButtons} aria-label="Explore the priority order">
        <button type="button" aria-pressed={isYield} onClick={() => setScenario('yield')}>
          When there is yield <span aria-hidden="true">↗</span>
        </button>
        <button type="button" aria-pressed={!isYield} onClick={() => setScenario('loss')}>
          When there is a loss <span aria-hidden="true">↘</span>
        </button>
      </fieldset>
      <div className={styles.flow} data-scenario={scenario}>
        <div className={styles.flowSource}>
          <span className={styles.flowDot} />
          <span>{isYield ? 'Underlying vault returns' : 'Underlying vault loss'}</span>
        </div>
        <div className={styles.flowConnector} aria-hidden="true">
          ↓
        </div>
        <div className={styles.flowPosition}>
          <span className={styles.flowLabel}>{isYield ? 'First in order' : 'First to absorb'}</span>
          <strong>{isYield ? 'Senior' : 'Junior capital'}</strong>
          <span>{isYield ? 'Priority for the target return' : 'The available loss buffer'}</span>
        </div>
        <div className={styles.flowConnector} aria-hidden="true">
          ↓
        </div>
        <div className={styles.flowRemainder}>
          <span>{isYield ? 'Remaining returns' : 'If the buffer is exhausted'}</span>
          <strong>{isYield ? 'Allocated by the configured rules' : 'Losses can reach Senior'}</strong>
        </div>
      </div>
      <p className={styles.diagramNote} aria-live="polite" aria-atomic="true">
        {isYield
          ? 'Priority defines the order. It does not guarantee the target will be earned.'
          : 'Simplified order. Any available reserve may be drawn before junior capital absorbs losses.'}
      </p>
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
    depositTrigger.current = event.currentTarget.closest('details')?.querySelector('summary') ?? event.currentTarget
    setDepositState('open')
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    requestAnimationFrame(() => closeDepositButton.current?.focus({ preventScroll: true }))
  }

  const closeDeposit = () => {
    setDepositState('closed')
    requestAnimationFrame(() => depositTrigger.current?.focus())
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${styles.site} ${isBlue ? styles.blueEdition : styles.paperEdition}`}
        data-deposit-open={isDepositOpen}
      >
        <a className={styles.skipLink} href="#how-it-works" tabIndex={isDepositOpen ? -1 : 0} inert={isDepositOpen}>
          Skip to content
        </a>
        <main inert={isDepositOpen}>
          <section className={styles.hero} id="top" aria-labelledby="hero-title">
            <div className={styles.heroArt}>
              <Image
                src={isBlue ? '/senior/elder-oak-dress.webp' : '/senior/meadow-canopy-dress.webp'}
                alt="An old oak above a quiet meadow, with a woman in a gathered dress and straw hat resting at its roots."
                fill
                unoptimized
                sizes={isBlue ? '(max-width: 760px) 100vw, 65vw' : '100vw'}
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <header className={styles.header}>
              <Brand />
              <nav className={styles.nav} aria-label="Main navigation">
                <a href="#how-it-works">How Senior works</a>
                <a href="#onchain">Live data</a>
                <button
                  type="button"
                  className={styles.navCta}
                  onClick={openDeposit}
                  aria-controls="senior-deposit"
                  aria-expanded={isDepositOpen}
                >
                  Deposit <Arrow />
                </button>
              </nav>
              <details className={styles.mobileMenu}>
                <summary>
                  Menu <span aria-hidden="true">+</span>
                </summary>
                <nav
                  aria-label="Mobile navigation"
                  onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
                >
                  <a href="#how-it-works">How Senior works</a>
                  <a href="#onchain">Live data</a>
                  <a href="#questions">Questions</a>
                  <button
                    type="button"
                    onClick={openDeposit}
                    aria-controls="senior-deposit"
                    aria-expanded={isDepositOpen}
                  >
                    Deposit <Arrow />
                  </button>
                </nav>
              </details>
            </header>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: isDepositOpen ? 0 : 1, x: isDepositOpen ? '-110vw' : 0, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={isDepositOpen}
              inert={isDepositOpen}
            >
              <h1 id="hero-title">Let it rest.</h1>
              <p className={styles.heroSubtitle}>
                Your USDC has a job.
                <br />
                You have a life.
              </p>
              <p className={styles.heroRate}>
                <strong>5%</strong> target rate on USDC
              </p>
              <p className={styles.heroDescription}>
                Junior capital absorbs losses first.
                <br />
                The buffer is limited.
              </p>
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
                <a href="#how-it-works" className={styles.textLink}>
                  How it works <Arrow down />
                </a>
              </div>
            </motion.div>
            <div className={styles.heroFoot}>
              <span>Returns and principal remain at risk.</span>
            </div>
          </section>

          <section className={`${styles.section} ${styles.intro}`} id="how-it-works" aria-labelledby="intro-title">
            <Reveal className={styles.introHeading}>
              <h2 id="intro-title">
                A different place
                <br />
                in the same vault.
              </h2>
            </Reveal>
            <Reveal className={styles.introCopy}>
              <p className={styles.lead}>
                Your USDC goes to work in Yearn vaults. Senior defines where you stand when returns and losses are
                shared.
              </p>
              <p>
                You get priority for a target return. More junior positions take settlement losses before yours, in
                exchange for different return opportunities.
              </p>
              <p>
                That is what a <em>tranche</em> means: a position with a different place in the order.
              </p>
              <a className={styles.textLink} href="#priority">
                See the order <Arrow down />
              </a>
            </Reveal>
            <Reveal className={styles.steps}>
              {[
                ['Start with USDC', 'Deposit into the Senior vault and receive shares in your position.'],
                ['Yearn puts it to work', 'The underlying vault allocates capital to strategies that seek yield.'],
                ['Your position has priority', 'The controller assigns returns and losses according to the rules.']
              ].map(([title, detail]) => (
                <div className={styles.step} key={title}>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              ))}
            </Reveal>
          </section>

          <section className={`${styles.section} ${styles.priority}`} id="priority" aria-labelledby="priority-title">
            <Reveal className={styles.priorityCopy}>
              <h2 id="priority-title">
                First in line.
                <br />
                With a buffer
                <br />
                beneath you.
              </h2>
              <p>Like a canopy, junior capital provides a layer between Senior and losses. That layer has a limit.</p>
              <p className={styles.finePrint}>
                The buffer can change as capital, returns and losses change. It is not insurance.
              </p>
            </Reveal>
            <Reveal>
              <PriorityDiagram />
            </Reveal>
          </section>

          <section className={`${styles.section} ${styles.terms}`} aria-labelledby="terms-title">
            <Reveal>
              <h2 id="terms-title">
                A clearer view.
                <br />
                An informed choice.
              </h2>
            </Reveal>
            <Reveal className={styles.termsList}>
              {[
                [
                  'A target, not a promise.',
                  'Returns depend on the underlying vault and current configuration. A target rate is not a guaranteed APY.'
                ],
                [
                  'Liquidity has conditions.',
                  'Withdrawals depend on available liquidity, vault limits and any applicable cooldown. Review the current terms first.'
                ],
                [
                  'The risks are real.',
                  'Strategy losses, smart contract failures and USDC depegging can affect your capital. Losses can exceed the buffer.'
                ]
              ].map(([title, detail]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              ))}
            </Reveal>
          </section>

          <section className={`${styles.section} ${styles.onchain}`} id="onchain" aria-labelledby="onchain-title">
            <Reveal className={styles.onchainHeading}>
              <div>
                <h2 id="onchain-title">
                  Go as deep
                  <br />
                  as you like.
                </h2>
              </div>
              <p>
                The simple version is here.
                <br />
                The details live onchain.
              </p>
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
              <a href="https://github.com/yearn/ytranche" target="_blank" rel="noreferrer" className={styles.textLink}>
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

          <section className={styles.closing} id="explore" aria-labelledby="closing-title">
            <Image
              src="/senior/resting-book.webp"
              alt="A closed book and an oak leaf resting on a bench in the shade."
              fill
              unoptimized
              sizes="100vw"
              className={styles.closingArt}
            />
            <Reveal className={styles.closingContent}>
              <h2 id="closing-title">Take your time.</h2>
              <p>
                Read the terms. Understand your position.
                <br />
                Make the choice that works for you.
              </p>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={openDeposit}
                aria-controls="senior-deposit"
                aria-expanded={isDepositOpen}
              >
                Deposit <Arrow />
              </button>
              <a className={styles.textLink} href={SENIOR_CONTRACT} target="_blank" rel="noreferrer">
                View Senior onchain <Arrow />
              </a>
              <span className={styles.finePrint}>Capital is at risk. Returns are not guaranteed.</span>
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
              <button ref={closeDepositButton} type="button" onClick={closeDeposit} aria-label="Close deposit widget">
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
  )
}
