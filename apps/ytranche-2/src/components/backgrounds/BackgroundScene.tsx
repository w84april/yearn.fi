export const BACKGROUNDS = [
  { id: 'cloud-falls', name: 'Cloud Falls', color: '#568aff' },
  { id: 'ribbon-river', name: 'Ribbon River', color: '#32a9b5' },
  { id: 'floating-pools', name: 'Floating Pools', color: '#9690e9' },
  { id: 'peach-cascade', name: 'Peach Cascade', color: '#f1a489' },
  { id: 'moonwater', name: 'Moonwater', color: '#3e487d' },
  { id: 'blossom-flow', name: 'Blossom Flow', color: '#dca8c9' },
  {
    id: 'coastal-flow',
    name: 'Coastal Flow',
    color: '#5c9da5',
    video: '/backgrounds/coastal-flow.mp4',
    poster: '/backgrounds/coastal-flow.jpg'
  },
  {
    id: 'field-breeze',
    name: 'Field Breeze',
    color: '#8e9c54',
    video: '/backgrounds/field-breeze.mp4',
    poster: '/backgrounds/field-breeze.jpg'
  },
  {
    id: 'meadow-light',
    name: 'Meadow Light',
    color: '#758468',
    video: '/backgrounds/meadow-light.mp4',
    poster: '/backgrounds/meadow-light.jpg'
  }
] as const

export type TBackgroundId = (typeof BACKGROUNDS)[number]['id']

type TCloudProps = { x: number; y: number; scale?: number; delay?: number; tone?: 'near' | 'far' }

function Cloud({ x, y, scale = 1, delay = 0, tone = 'near' }: TCloudProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={`scene-cloud scene-cloud--${tone}`} style={{ animationDelay: `${delay}s` }}>
        <path d="M-32 74c-1-25 17-45 42-47C18-7 66-13 84 17c27-41 88-34 104 12 30-13 65 5 69 37 26-1 44 13 49 32H-44c0-10 5-19 12-24Z" />
        <path
          className="scene-cloud-edge"
          d="M-32 74c-1-25 17-45 42-47C18-7 66-13 84 17c27-41 88-34 104 12 30-13 65 5 69 37"
        />
      </g>
    </g>
  )
}

function Current({ d, width = 64, delay = 0 }: { d: string; width?: number; delay?: number }) {
  return (
    <g fill="none" strokeLinecap="butt" strokeLinejoin="round">
      <path className="scene-water-shadow" d={d} strokeWidth={width + 12} />
      <path className="scene-water" d={d} strokeWidth={width} />
      <path
        className="scene-water-inner"
        d={d}
        strokeWidth={width * 0.48}
        transform={`translate(${-width * 0.16} 0)`}
      />
      <path
        className="scene-current"
        d={d}
        strokeWidth={width * 0.065}
        strokeLinecap="round"
        strokeDasharray="25 165"
        transform={`translate(${-width * 0.24} 0)`}
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  )
}

function Pool({ x, y, radius = 160 }: { x: number; y: number; radius?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse className="scene-pool-shadow" cy={radius * 0.57} rx={radius * 0.66} ry={12} />
      <path
        className="scene-stone"
        d={`M${-radius} 0C${-radius * 0.94} ${radius * 0.72} ${radius * 0.94} ${radius * 0.72} ${radius} 0Z`}
      />
      <ellipse className="scene-stone-top" rx={radius} ry={radius * 0.27} />
      <ellipse className="scene-pool-water" rx={radius * 0.84} ry={radius * 0.18} />
      <ellipse className="scene-ripple" cx={-radius * 0.14} cy={-2} rx={radius * 0.42} ry={radius * 0.085} />
      <path className="scene-pool-glint" d={`M${-radius * 0.58} -8q${radius * 0.24} -13 ${radius * 0.53} -8`} />
    </g>
  )
}

function CloudFalls() {
  return (
    <>
      <circle className="scene-sun" cx="1252" cy="207" r="78" />
      <Cloud x={-80} y={112} scale={1.4} delay={-5} tone="far" />
      <Cloud x={1100} y={95} scale={1.7} delay={-12} tone="far" />
      <path
        className="scene-distant"
        d="M0 472c96-93 177-49 228-123 53-77 148-74 199-14l37 665H0ZM1600 225c-111-45-235 27-273 138-35 104-106 124-159 145l-34 492h466Z"
      />
      <path className="scene-cliff" d="M0 425h124c86 0 132 49 132 135v78h90c73 0 122 45 122 119v243H0Z" />
      <path className="scene-cliff-top" d="M0 425h124c86 0 132 49 132 135v30h-49v-24c0-60-34-91-95-91H0Z" />
      <path className="scene-cliff-shade" d="M0 770h260c104 0 159 42 208 122v108H0Z" />
      <path className="scene-cliff" d="M1600 294h-95c-93 0-149 43-149 137v70h-81c-79 0-124 40-124 115v384h449Z" />
      <path className="scene-cliff-top" d="M1600 294h-95c-93 0-149 43-149 137v19h44v-15c0-64 37-97 111-97h89Z" />
      <path className="scene-cliff-shade" d="M1600 705h-218c-116 0-183 73-231 171v124h449Z" />
      <Current d="M-80 454H102q98 0 98 98v65q0 75 76 75h35q91 0 91 91v89" width={67} />
      <Current d="M1670 319h-151q-116 0-116 116v64q0 68-68 68h-34q-89 0-89 89v194" width={84} delay={-2} />
      <Pool x={378} y={870} radius={188} />
      <Pool x={1237} y={864} radius={205} />
      <Cloud x={-90} y={824} scale={1.75} delay={-8} />
      <Cloud x={1295} y={780} scale={1.8} delay={-15} />
      <path
        className="scene-bottom-mist"
        d="M0 954c178-97 326-91 486-27 167 66 298 65 477 25 229-51 429-68 637-6v90H0Z"
      />
      <Cloud x={655} y={960} scale={1.05} delay={-3} />
      <g className="scene-birds" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M1039 197q10-9 20 0 10-9 20 0M1084 172q7-6 14 0 7-6 14 0" />
      </g>
    </>
  )
}

function RibbonRiver() {
  return (
    <>
      <circle className="scene-sun" cx="1341" cy="237" r="102" />
      <path
        className="scene-river-bank"
        d="M-170 36c423-89 642 47 582 232-45 140-270 140-268 284 2 139 229 131 241 270 8 87-78 182-229 224H-170ZM1652 190c-264-87-422 32-403 155 22 140 271 142 242 278-22 106-240 96-280 218-29 87 31 140 91 184h350Z"
      />
      <Current
        d="M-100 148c330-54 477 49 416 160-56 102-237 88-238 224-1 150 215 126 220 265 4 96-112 165-243 188"
        width={104}
        delay={-2}
      />
      <Current
        d="M1637 293c-233-51-356 20-304 134 42 94 214 97 209 216-6 139-252 86-279 226-16 82 80 138 170 159"
        width={90}
        delay={-5}
      />
      <path
        className="scene-ribbon-detail"
        d="M-80 138c287-37 366 21 347 98M1645 303c-175-37-291 7-279 73M125 545c8 79 121 84 159 159"
      />
      <Cloud x={-45} y={92} scale={1.25} delay={-6} />
      <Cloud x={1290} y={76} scale={1.6} delay={-12} />
      <Cloud x={153} y={872} scale={1.45} delay={-3} />
      <Cloud x={1200} y={842} scale={1.6} delay={-17} />
      <g className="scene-floating scene-pebbles">
        <ellipse cx="433" cy="624" rx="27" ry="17" transform="rotate(-27 433 624)" />
        <ellipse cx="1168" cy="458" rx="18" ry="12" transform="rotate(21 1168 458)" />
        <ellipse cx="1098" cy="873" rx="31" ry="19" transform="rotate(-13 1098 873)" />
      </g>
      <path className="scene-bottom-mist" d="M0 989c311-102 541-18 791-30 252-12 496-69 809 16v61H0Z" />
    </>
  )
}

function FloatingPools() {
  return (
    <>
      <circle className="scene-sun" cx="1215" cy="192" r="69" />
      <Cloud x={-75} y={168} scale={1.6} delay={-4} tone="far" />
      <Cloud x={1230} y={114} scale={1.5} delay={-14} tone="far" />
      <g className="scene-float-island">
        <Pool x={209} y={268} radius={176} />
        <Current d="M228 270v144q0 63 63 63h22q54 0 54 54v106" width={61} />
        <Pool x={348} y={637} radius={179} />
        <Current d="M324 639v167q0 80-80 80H80" width={67} delay={-3} />
      </g>
      <g className="scene-float-island scene-float-island--second">
        <Pool x={1446} y={200} radius={184} />
        <Current d="M1438 203v145q0 70-70 70h-43q-63 0-63 63v65" width={60} delay={-1} />
        <Pool x={1282} y={543} radius={175} />
        <Current d="M1283 546v162q0 77 77 77h30q66 0 66 66v104" width={74} delay={-4} />
        <Pool x={1456} y={947} radius={232} />
      </g>
      <Cloud x={-131} y={791} scale={2} delay={-11} />
      <Cloud x={1280} y={803} scale={1.6} delay={-2} />
      <path className="scene-bottom-mist" d="M0 959c281-105 431 32 661 12 313-28 556-85 939-12v77H0Z" />
      <g className="scene-sparkles">
        <path d="m425 151 5 12 12 5-12 5-5 12-5-12-12-5 12-5Zm720 218 4 10 10 4-10 4-4 10-4-10-10-4 10-4ZM525 831l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
      </g>
    </>
  )
}

function Blossom({
  x,
  y,
  radius,
  tier
}: {
  x: number
  y: number
  radius: number
  tier: 'fixed' | 'levered' | 'equity'
}) {
  return (
    <g transform={`translate(${x} ${y})`} className={`scene-blossom scene-blossom--${tier}`}>
      <g className="scene-blossom__petals">
        <path
          className="scene-petal-back"
          d={`M0 20C${-radius * 0.64} ${-radius * 0.23} ${-radius * 0.48} ${-radius * 0.68} 0 ${-radius * 0.9}C${radius * 0.48} ${-radius * 0.68} ${radius * 0.64} ${-radius * 0.23} 0 20Z`}
        />
        {[-1, 1].map((direction) => (
          <g key={direction} transform={`scale(${direction} 1)`}>
            <path
              className="scene-petal-mid"
              d={`M18 32C${-radius * 0.48} 42 ${-radius * 0.99} ${-radius * 0.16} ${-radius * 1.02} ${-radius * 0.55}C${-radius * 0.45} ${-radius * 0.57} ${radius * 0.08} ${-radius * 0.29} 18 32Z`}
            />
            <path
              className="scene-petal-light"
              d={`M0 30C${-radius * 0.56} 59 ${-radius * 1.12} 5 ${-radius * 1.21} ${-radius * 0.22}C${-radius * 0.59} ${-radius * 0.34} ${-radius * 0.11} ${-radius * 0.06} 0 30Z`}
            />
            <path
              className="scene-petal-vein"
              d={`M${-radius * 0.98} ${-radius * 0.18}Q${-radius * 0.42} ${-radius * 0.08} -4 30`}
            />
          </g>
        ))}
      </g>
      <Pool x={0} y={24} radius={radius * 0.94} />
      {[-1, 1].map((direction) => (
        <g key={direction} transform={`scale(${direction} 1)`}>
          <path
            className="scene-petal-front"
            d={`M${-radius * 0.94} 26Q${-radius * 0.55} 41 -8 30C${-radius * 0.08} ${radius * 0.41} ${-radius * 0.25} ${radius * 0.58} ${-radius * 0.45} ${radius * 0.62}C${-radius * 0.78} ${radius * 0.48} ${-radius * 0.97} ${radius * 0.19} ${-radius * 0.94} 26Z`}
          />
        </g>
      ))}
    </g>
  )
}

function BlossomFlow() {
  return (
    <>
      <circle className="scene-sun" cx="1170" cy="155" r="64" />
      <Cloud x={-100} y={93} scale={1.65} delay={-4} tone="far" />
      <Cloud x={1270} y={50} scale={1.4} delay={-15} tone="far" />
      <path className="scene-blossom__stem" d="M-100 1050C383 792 40 558 318 242M-50 801C107 764 227 769 330 638" />
      <path
        className="scene-lily-leaf"
        d="M80 890C-80 751-72 636-4 577 156 605 235 769 80 890ZM196 623C151 458 227 342 358 325 424 464 336 579 196 623Z"
      />
      <path className="scene-lily-vein" d="M79 878C71 750 43 689 1 603M201 607C250 465 277 424 341 345" />
      <path className="scene-petal-light" d="M-80 469C116 497 269 421 303 260 116 227-32 271-80 469Z" />
      <path className="scene-petal-mid" d="M-70 393C77 411 158 340 158 214 17 238-49 284-70 393Z" />
      <Current d="M-90 184C103 115 274 108 416 115" width={37} delay={-4} />
      <path className="scene-water-source" d="M416 115C626 126 900 92 1118 138q61 12 121 18" />
      <g className="scene-float-island">
        <Blossom x={1450} y={310} radius={145} tier="fixed" />
        <Current d="M1432 340v68q0 58-58 58h-46q-58 0-58 58v80" width={53} delay={-1} />
        <Blossom x={1270} y={580} radius={145} tier="levered" />
        <Current d="M1280 610v54q0 64 64 64h42q64 0 64 64v72" width={58} delay={-3} />
        <Blossom x={1450} y={840} radius={160} tier="equity" />
      </g>
      <path
        className="scene-water-source"
        d="M1457 325c40-12 67-41 83-76M1277 596c-43-6-70-25-84-59M1459 865c34 6 54 19 78 47"
      />
      <g className="scene-blossom__loose-petals">
        <path
          className="scene-petal-mid"
          d="M320 126c4 28 37 40 65 20-4-28-35-42-65-20ZM432 728c-5 25 20 47 50 37 6-27-18-49-50-37Z"
        />
        <path
          className="scene-petal-light"
          d="M103 531c2 26 32 41 58 23-1-25-30-42-58-23ZM1062 825c-5 20 13 35 35 29 4-21-12-38-35-29Z"
        />
      </g>
      <Cloud x={-95} y={845} scale={1.7} delay={-12} />
      <Cloud x={1310} y={887} scale={1.25} delay={-4} />
      <path className="scene-bottom-mist" d="M0 966c260-86 459 39 723 8 327-39 560-42 877-9v71H0Z" />
    </>
  )
}

function PeachCascade() {
  return (
    <>
      <circle className="scene-sun" cx="1249" cy="239" r="137" />
      <circle className="scene-sun-halo" cx="1249" cy="239" r="176" />
      <Cloud x={950} y={176} scale={1.85} delay={-6} tone="far" />
      <Cloud x={-160} y={181} scale={2.1} delay={-12} tone="far" />
      <path
        className="scene-distant"
        d="M1600 353c-200-139-359-73-424 52-28 54-60 71-110 112v483h534ZM0 577c117-113 279-167 433-86l33 509H0Z"
      />
      <path className="scene-cliff" d="M1600 431h-125c-85 0-129 39-129 118v80h-87c-87 0-136 49-136 136v235h477Z" />
      <path className="scene-cliff-top" d="M1600 431h-125c-85 0-129 39-129 118v23h48v-21c0-55 29-78 90-78h116Z" />
      <path className="scene-cliff-shade" d="M1462 629h138v371h-477V856c67-89 104-100 188-100 85 0 151-39 151-127Z" />
      <Current d="M1671 458h-153q-114 0-114 114v59q0 67-67 67h-42q-79 0-79 79v79" width={82} delay={-1} />
      <Pool x={1240} y={859} radius={225} />
      <Current d="M-61 604h154q111 0 111 111v56q0 78 78 78h83" width={86} delay={-3} />
      <Pool x={324} y={851} radius={190} />
      <Cloud x={-108} y={724} scale={1.9} delay={-7} />
      <Cloud x={1287} y={815} scale={1.5} delay={-16} />
      <path
        className="scene-bottom-mist"
        d="M0 935c185-70 320-14 451 15 222 50 353 19 543-18 240-46 414-24 606 25v79H0Z"
      />
      <g className="scene-birds" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M384 276q11-9 22 0 11-9 22 0M429 252q7-6 14 0 7-6 14 0" />
      </g>
    </>
  )
}

function Moonwater() {
  return (
    <>
      <g className="scene-stars">
        {[
          [145, 154],
          [387, 262],
          [1162, 140],
          [1456, 359],
          [1039, 285],
          [282, 486],
          [1129, 766],
          [1355, 698],
          [509, 128],
          [869, 186],
          [73, 666]
        ].map(([x, y], index) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={index % 3 === 0 ? 2.5 : 1.5}
            style={{ animationDelay: `${-index}s` }}
          />
        ))}
      </g>
      <circle className="scene-moon-halo" cx="1272" cy="215" r="114" />
      <circle className="scene-moon" cx="1272" cy="215" r="66" />
      <Cloud x={-130} y={164} scale={1.65} delay={-9} tone="far" />
      <Cloud x={1270} y={273} scale={1.55} delay={-16} tone="far" />
      <path
        className="scene-distant"
        d="M0 598c99-202 282-193 415-64l48 466H0ZM1600 471c-206-92-365 15-426 163l-50 366h476Z"
      />
      <path className="scene-cliff" d="M0 610h163q116 0 116 116v77h104q80 0 80 80v117H0Z" />
      <path className="scene-cliff-top" d="M0 610h163q116 0 116 116v22h-42v-20q0-76-78-76H0Z" />
      <Current d="M-58 638h191q94 0 94 94v53q0 71 71 71h63" width={64} delay={-3} />
      <Pool x={361} y={858} radius={200} />
      <Pool x={1446} y={494} radius={210} />
      <Current d="M1416 495v149q0 76-76 76h-44q-72 0-72 72v99" width={71} />
      <Pool x={1235} y={892} radius={200} />
      <Cloud x={-147} y={816} scale={1.8} delay={-5} />
      <Cloud x={1320} y={840} scale={1.6} delay={-14} />
      <path className="scene-bottom-mist" d="M0 956c271-66 488 23 726 1 283-26 556-75 874 0v79H0Z" />
    </>
  )
}

const SCENES = {
  'cloud-falls': CloudFalls,
  'ribbon-river': RibbonRiver,
  'floating-pools': FloatingPools,
  'peach-cascade': PeachCascade,
  moonwater: Moonwater,
  'blossom-flow': BlossomFlow
}

export function BackgroundScene({ variant }: { variant: keyof typeof SCENES }) {
  const Scene = SCENES[variant]
  return (
    <div className="background-scene" aria-hidden="true">
      <div className="background-scene__glow" />
      <svg
        className="background-scene__art"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <Scene />
      </svg>
      <svg className="background-scene__mobile-top" viewBox="0 0 1600 1000" fill="none" focusable="false">
        <circle className={variant === 'moonwater' ? 'scene-moon' : 'scene-sun'} cx="1240" cy="240" r="80" />
        <Cloud x={-70} y={150} scale={1.8} tone="far" delay={-9} />
        <Cloud x={1100} y={130} scale={1.7} tone="far" delay={-15} />
        <Cloud x={1250} y={370} scale={1.2} delay={-3} />
      </svg>
    </div>
  )
}
