'use client'

import styles from '@pages/senior/SeniorLiveData.module.css'
import { type KeyboardEvent, type PointerEvent, useState } from 'react'
import { Curve } from 'recharts'
import type { TLiveHistory } from '@/server/senior/liveData'

type TPoints = TLiveHistory['points']
type TChartUnit = 'percent' | 'usdc' | 'sharePrice'

const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })
const usdc = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const dayMs = 86_400_000

function formatValue(value: number, unit: TChartUnit) {
  if (unit === 'percent') return percent.format(value)
  return unit === 'usdc' ? compact.format(value) : value.toFixed(4)
}

function formatReadout(value: number | null | undefined, unit: TChartUnit, currency: 'USD' | 'USDC') {
  if (value == null) return '—'
  if (unit === 'sharePrice') return value.toFixed(6) + ' ' + currency
  if (unit === 'usdc') return usdc.format(value) + ' ' + currency
  return formatValue(value, unit)
}

export function HistoryChart({
  days,
  series,
  label,
  unit,
  currency = 'USDC',
  eventDay,
  inspect = false,
  showLegend = false,
  performance = false
}: {
  days: string[]
  series: { name: string; values: (number | null | undefined)[] }[]
  label: string
  unit: TChartUnit
  currency?: 'USD' | 'USDC'
  eventDay?: string
  inspect?: boolean
  showLegend?: boolean
  performance?: boolean
}) {
  const [selectedIndex, select] = useState<number | null>(null)
  const values = series.flatMap(({ values }) => values.filter((value) => value != null))
  const firstDay = days[0]
  const lastDay = days.at(-1)
  if (!values.length || !firstDay || !lastDay) {
    return <p className={styles.empty}>Daily observations will appear here when available.</p>
  }

  const start = Date.parse(firstDay)
  const duration = Math.max(Date.parse(lastDay) - start, dayMs)
  const x = (day: string) => Number((6 + ((Date.parse(day) - start) / duration) * 588).toFixed(2))
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const padding = (maximum - minimum || Math.abs(maximum) || 1) * 0.1
  const low = performance && unit === 'usdc' && minimum >= 0 ? Math.max(0, minimum - padding) : minimum - padding
  const high = maximum + padding
  const levels = performance ? [16, 46, 76, 106, 136] : [16, 76, 136]
  // Round subpixel coordinates so server and browser math produce the same SVG attributes.
  const y = (value: number) => Number((136 - ((value - low) / (high - low)) * 120).toFixed(2))
  const marker = eventDay && eventDay >= firstDay && eventDay <= lastDay ? x(eventDay) : null

  const selectedDay = selectedIndex == null ? null : days[selectedIndex]
  const selectedX = selectedDay ? x(selectedDay) : null

  function selectDate(event: PointerEvent<SVGSVGElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect()
    if (!width) return
    const cursor = ((event.clientX - left) / width) * 600
    const index = days.reduce<number | null>((nearest, day, index) => {
      if (!series.some(({ values }) => values[index] != null)) return nearest
      return nearest == null || Math.abs(x(day) - cursor) < Math.abs(x(days[nearest]) - cursor) ? index : nearest
    }, null)
    select(index)
  }

  function stepDate(event: KeyboardEvent<SVGSVGElement>) {
    const current = selectedIndex ?? days.length - 1
    const keys: Record<string, number> = {
      ArrowLeft: Math.max(current - 1, 0),
      ArrowRight: Math.min(current + 1, days.length - 1),
      Home: 0,
      End: days.length - 1
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
  }

  return (
    <figure className={styles.figure} data-performance={performance || undefined}>
      {showLegend && (
        <div className={styles.chartLegend}>
          <ul className={styles.legend}>
            {series.map(({ name }) => (
              <li key={name} data-tranche={name}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.chart}>
        <div className={styles.axis} aria-hidden="true">
          {levels.map((level) => (
            <span key={level}>{formatValue(high - ((level - 16) / 120) * (high - low), unit)}</span>
          ))}
        </div>
        <div className={styles.plot}>
          <svg
            viewBox="0 0 600 152"
            preserveAspectRatio="none"
            role="img"
            aria-label={inspect ? label + '. Use the arrow keys to inspect dates.' : label}
            tabIndex={inspect ? 0 : undefined}
            className={inspect ? styles.inspectable : undefined}
            onPointerMove={inspect ? selectDate : undefined}
            onPointerDown={inspect ? selectDate : undefined}
            onPointerLeave={inspect ? () => select(null) : undefined}
            onBlur={inspect ? () => select(null) : undefined}
            onKeyDown={inspect ? stepDate : undefined}
          >
            {levels.map((level) => (
              <line key={level} x1="0" x2="600" y1={level} y2={level} className={styles.guide} />
            ))}
            {marker !== null && (
              <line x1={marker} x2={marker} y1="16" y2="136" className={styles.settlementMarker}>
                <title>Mock settlement</title>
              </line>
            )}
            {selectedX !== null && (
              <line x1={selectedX} x2={selectedX} y1="16" y2="136" className={styles.chartCursor} />
            )}
            {series.map(({ name, values }) => {
              const coordinates = days.map((day, index) => {
                const value = values[index]
                // Curve treats non-finite coordinates as gaps.
                return { x: x(day), y: value == null ? Number.NaN : y(value) }
              })
              const selectedValue = selectedIndex == null ? null : values[selectedIndex]
              return (
                <g key={name}>
                  <Curve
                    points={coordinates}
                    type={performance ? 'monotoneX' : 'linear'}
                    className={name === 'Junior' ? styles.lineJunior : styles.line}
                    vectorEffect="non-scaling-stroke"
                  />
                  {days.map((day, index) => {
                    const value = values[index]
                    return value != null && values[index - 1] == null && values[index + 1] == null ? (
                      <circle
                        key={day}
                        cx={x(day)}
                        cy={y(value)}
                        r="3"
                        className={name === 'Junior' ? styles.pointJunior : styles.point}
                      />
                    ) : null
                  })}
                  {selectedX !== null && selectedValue != null && (
                    <circle
                      cx={selectedX}
                      cy={y(selectedValue)}
                      r="3.5"
                      className={name === 'Junior' ? styles.pointJunior : styles.point}
                    />
                  )}
                </g>
              )
            })}
          </svg>
          {selectedDay && selectedIndex !== null && (
            <div className={styles.chartTooltip} data-side={(selectedX ?? 0) < 300 ? 'right' : 'left'}>
              <time dateTime={selectedDay}>{monthDay.format(new Date(selectedDay))}</time>
              <dl className={styles.legend}>
                {series.map(({ name, values }) => {
                  const value = values[selectedIndex]
                  return (
                    <div key={name} data-tranche={name}>
                      <dt>{name}</dt>
                      <dd>{formatReadout(value, unit, currency)}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          )}
        </div>
      </div>
      <figcaption className={styles.dates}>
        <span>{monthDay.format(new Date(firstDay))}</span>
        {performance &&
          duration >= 4 * dayMs &&
          [0.25, 0.5, 0.75].map((fraction) => (
            <span key={fraction} className={styles.intermediateDate}>
              {monthDay.format(start + duration * fraction)}
            </span>
          ))}
        {marker !== null && eventDay && (
          <span className={styles.settlementDate}>{monthDay.format(new Date(eventDay))} · Mock settlement</span>
        )}
        <span>{monthDay.format(new Date(lastDay))}</span>
      </figcaption>
    </figure>
  )
}

const performanceMetrics = [
  { label: 'APY', senior: 'seniorApy', junior: 'juniorApy', unit: 'percent' },
  { label: 'Share price', senior: 'seniorPps', junior: 'juniorPps', unit: 'sharePrice' },
  { label: 'TVL', senior: 'seniorTvl', junior: 'juniorTvl', unit: 'usdc' }
] as const

export function PerformanceHistory({ points, illustrative }: { points: TPoints; illustrative: boolean }) {
  const end = Date.parse(points.at(-1)?.day ?? '')
  const visible = points.filter(({ day }) => Date.parse(day) >= end - 29 * dayMs)
  const [metric, setMetric] = useState(
    () =>
      performanceMetrics.find(({ senior, junior }) =>
        visible.some((point) => point[senior] != null || point[junior] != null)
      ) ?? performanceMetrics[0]
  )
  const currency = illustrative ? 'USD' : 'USDC'
  const series = [
    { name: 'Senior', values: visible.map((point) => point[metric.senior]) },
    { name: 'Junior', values: visible.map((point) => point[metric.junior]) }
  ].filter(({ values }) => values.some((value) => value != null))
  const label =
    series.map(({ name }) => name).join(' and ') +
    ' ' +
    metric.label +
    (metric.unit === 'percent' ? '' : ' in ' + currency)

  return (
    <>
      <div className={styles.sectionTitle}>
        <h2 id="senior-performance">Senior performance</h2>
      </div>
      <fieldset aria-label="History metric" className={styles.performanceSwitch}>
        {performanceMetrics.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={metric.label === option.label}
            onClick={() => setMetric(option)}
          >
            {option.label}
          </button>
        ))}
      </fieldset>
      <HistoryChart
        key={metric.label}
        days={visible.map((point) => point.day)}
        series={series}
        label={label}
        unit={metric.unit}
        currency={currency}
        inspect
        showLegend
        performance
      />
    </>
  )
}

export function ProtectionHistory({
  points,
  settlement
}: {
  points: TPoints
  settlement?: TLiveHistory['mockSettlement']
}) {
  const [unit, setUnit] = useState<'usdc' | 'percent'>('usdc')
  const isUsdc = unit === 'usdc'
  const coverage = points.at(-1)?.seniorCoverage
  const settlementCoverage = points.find((point) => point.day === settlement?.day)?.seniorCoverage
  const label = isUsdc ? 'Daily loss buffer in USDC' : 'Daily loss buffer as a percentage of attributable vault assets'

  return (
    <section aria-labelledby="protection-history">
      <div className={styles.protectionHeader}>
        <h3 id="protection-history">Protection history</h3>
        <fieldset aria-label="Loss buffer units" className={styles.unitSwitch}>
          <button type="button" aria-pressed={isUsdc} onClick={() => setUnit('usdc')}>
            USDC
          </button>
          <button type="button" aria-pressed={!isUsdc} onClick={() => setUnit('percent')}>
            %
          </button>
        </fieldset>
      </div>
      <div className={styles.chartHeader}>
        <p className={styles.source}>{label}</p>
        <p className={styles.source}>
          Senior tranche coverage · {coverage == null ? '—' : percent.format(coverage)} on latest chart date
        </p>
      </div>
      <HistoryChart
        days={points.map(({ day }) => day)}
        series={[
          {
            name: 'Loss buffer',
            values: points.map((point) => (isUsdc ? point.lossHeadroom : point.lossHeadroomRatio))
          }
        ]}
        label={label}
        unit={unit}
        eventDay={settlement?.day}
        inspect
      />
      {settlement && (
        <div className={styles.settlement}>
          <p>
            <strong>
              Mock settlement · <time dateTime={settlement.day}>{monthDay.format(new Date(settlement.day))}</time>
            </strong>
          </p>
          <p>
            Junior absorbed {usdc.format(settlement.juniorLoss)} USDC. Senior absorbed{' '}
            {usdc.format(settlement.seniorLoss)} USDC.
            {settlementCoverage != null && (
              <> Senior tranche claim coverage was {percent.format(settlementCoverage)}.</>
            )}
          </p>
          {settlement.bufferBefore != null && settlement.bufferAfter != null && (
            <p className={styles.source}>
              Loss buffer before and after: {usdc.format(settlement.bufferBefore)} →{' '}
              {usdc.format(settlement.bufferAfter)} USDC.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
