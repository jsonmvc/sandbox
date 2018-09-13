const chroma = require('chroma-js')

/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.


|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// let defaultConfig = require('tailwindcss/defaultConfig')()


/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
*/

/*
Guidelines for color palette:
60% is your dominant hue, 30% is secondary color and 10% is for accent color.

Accent:
Use to emphasize actions and highlighted information: text, call-to-action, floating button ( see material design ), progress bars, selection controls, special buttons, slider, links

Neutrals:
White, black or gray schemes.

Charts:
Categorical: contains multiple colors which contrast to each other and arrange as a specific order. This set presents different types of data ( bar chart, line chart, … ). Set different hues next to each other, not same hue but different saturation. Because when you look at the data, you want to present the audience the contrast between blue and green line, not blue line and some-kind-of-blue line, right? Special note: red and green are 2 meaningful colors in general ( green up, red down,… ), use them wise!
Sequential: fixed, incremental changes ( heat map, tree map, … ). Make the contrast strong from light to dark, never stop in the middle.
Polarize : a series of two extremes ( mostly heat map ). Tip: never use gradient with 2 opposite colors, always make stepping stone(s) between them.
https://blog.prototypr.io/basic-ui-color-guide-7612075cc71a
// error
// success
// alert
// information
http://gka.github.io/chroma.js/#cubehelix
HUE (cubehelix().start)
red yellow green  blue  purple  pink   red
0     60    120   180    240     300   360
*/

/**
 * Dynamic Typography
 * https://developer.apple.com/ios/human-interface-guidelines/visual-design/typography/
 */

let primary = [
  'blue',
]

let accent = [
  'pink',
]

let neutral = [
  '#FFFFFF',
  '#F2F2F2',
  '#D9D9D9',
  '#A8A8A8',
  '#878787',
  '#666666',
  '#4C4C4C',
  '#262626',
  '#0D0D0D',
  '#000000',
]


let danger = [
  'red',
]

let text = chroma
  .cubehelix()
    .start(250)
    .rotations(0)
    .gamma(2)
    .hue(0)
    .lightness([0.98, 0.3])
  .scale()
  .colors(7)

let warning = [
  'yellow',
]

let success = [
  'green',
]

let colors = {
  'transparent': 'transparent',
  'fg-white': 'white',
  'fg-black': 'black',
  'black-40': 'rgba(0, 0, 0, 0.4)'
}

let bgColors = {
  'transparent': 'transparent',
  'white': 'white',
  'black': 'black',
  'black-40': 'rgba(0, 0, 0, 0.4)'
}

let bfgColors = {
  'white': ['white', primary[4]],
  'black': ['black', '#fefefe']
}


function getContrastingText(color) {
  let w = text[0]
  let b = text[6]
  let cw = chroma.contrast(color, w)
  let cb = chroma.contrast(color, b)

  // Create incremental contrasting in one direction
  // or the other (based on initial constrast)
  // in order to reach an AAA state otherwise
  // give a A11y error 

  if (cw >= cb) {
    return w
  } else {
    return b
  }
}

let v = ['1', '2', '3', '4', '5', '6', '7']

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (primary[i]) {
    colors['fg-p' + name] = primary[i]
    bgColors['p' + name] = primary[i]
    bfgColors['p' + name] = [primary[i], getContrastingText(primary[i])]
  }
}

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (neutral[i]) {
    colors['fg-n' + name] = neutral[i]
    bgColors['n' + name] = neutral[i]
    bfgColors['n' + name] = [neutral[i], getContrastingText(neutral[i])]
  }
}

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (danger[i]) {
    colors['fg-d' + name] = danger[i]
    bgColors['d' + name] = danger[i]
    bfgColors['d' + name] = [danger[i], getContrastingText(danger[i])]
  }
}

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (warning[i]) {
    colors['fg-w' + name] = warning[i]
    bgColors['w' + name] = warning[i]
    bfgColors['w' + name] = [warning[i], getContrastingText(warning[i])]
  }
}

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (success[i]) {
    colors['fg-s' + name] = success[i]
    bgColors['s' + name] = success[i]
    bfgColors['s' + name] = [success[i], getContrastingText(success[i])]
  }
}

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (accent[i]) {
    colors['fg-a' + name] = accent[i]
    bgColors['a' + name] = accent[i]
    bfgColors['a' + name] = [accent[i], getContrastingText(accent[i])]
  }
}

for (let i = 0; i < v.length; i += 1) {
  let name = v[i]
  if (text[i]) {
    colors['fg' + name] = text[i]
  }
}

let linkBlue = '#0052CC'
colors['fg-link'] = linkBlue
colors['fg-link-active'] = chroma(linkBlue).darken(2).hex()

let heights = {
  '-auto': 'auto',
  '-inherit': 'inherit',
  '-px': '1px',
  '-2px': '2px',
  '-3px': '3px',
  '1': '1rem',
  '2': '2rem',
  '3': '4rem',
  '4': '8rem',
  '5': '16rem',
  '6': '24rem',
  '7': '32rem',
  '-10': '10%',
  '-20': '20%',
  '-25': '25%',
  '-30': '30%',
  '-40': '40%',
  '-50': '50%',
  '-60': '60%',
  '-70': '70%',
  '-75': '75%',
  '-80': '80%',
  '-90': '90%',
  '-100': '100%',
  'vh-10': '10vh',
  'vh-20': '20vh',
  'vh-30': '30vh',
  'vh-40': '40vh',
  'vh-25': '25vh',
  'vh-50': '50vh',
  'vh-60': '60vh',
  'vh-70': '70vh',
  'vh-75': '75vh',
  'vh-80': '80vh',
  'vh-90': '90vh',
  'vh-100': '100vh'
}

let textSizes = {
  '-subheadline': '5rem',
  '-headline': '6rem',
  '-5': '5rem',
  '-6': '6rem'
}

let textScale = [0.75, 0.875, 1, 1.25, 1.5, 2.25, 3]
let lh = 1.15
let fs = 16

textScale.forEach((v, i, arr) => {
  let len = arr.length - i
  textSizes[len] = v + 'rem'
})

textScale.forEach((v, i, arr) => {
  let len = arr.length - i
  heights['-f' + len] = v + 'rem' // Math.floor(v * fs) + 'px'
})

module.exports = {
  library: 'tachyons',
  colors: colors,
  screens: {
    's': { max: '30em' },
    'ns': '30em',
    'm': '48em',
    'l': '60em',
    'xl': '75em'
  },
  fonts: {
    'sans-serif': [
      '-apple-system',
      'BlinkMacSystemFont',
      'Lato',
      'avenir next',
      'avenir',
      'helvetica',
      'helvetica neue',
      'ubuntu',
      'roboto',
      'noto',
      'segoe ui',
      'arial',
      'sans-serif',
    ],
    'serif': [
      'georgia',
      'times',
      'serif',
    ],
    'system-sans-serif': [
      'sans-serif',
    ],
    'system-serif': [
      'serif',
    ],
    'code': [
      'Consolas',
      'monaco',
      'monospace'
    ],
    'courier': [
      'Courier Next',
      'courier',
      'monospace',
    ],
    'helvetica': [
      'helvetica neue',
      'helvetica',
      'sans-serif'
    ],
    'avenir': [
      'avenir next',
      'avenir',
      'sans-serif',
    ],
    'athelas': [
      'athelas',
      'georgia',
      'serif',
    ],
    'georgia': [
      'georgia',
      'serif'
    ],
    'times': [
      'times',
      'serif',
    ],
    'bodoni': [
      'Bodoni MT',
      'serif'
    ],
    'calisto': [
      'Calisto MT',
      'serif'
    ],
    'garamond': [
      'garamond',
      'serif',
    ],
    'baskerville': [
      'baskerville',
      'serif',
    ],
  },
  textSizes: textSizes,
  fontWeights: {
    '1': 100,
    '2': 200,
    '3': 300,
    '4': 400,
    '5': 500,
    '6': 600,
    '7': 700,
    '8': 800,
    '9': 900,
  },
  leading: {
    'none': 0,
    'fixed': 0.5,
    'solid': 1,
    'title': 1.25,
    'copy': 1.5,
    'loose': 2,
  },
  tracking: {
    'tight': '-.05em',
    'normal': '.1em',
    'mega': '.25em',
  },
  textColors: colors,
  typography: {
    measure: '30em',
    measureWide: '34em',
    measureNarrow: '20em',
    indent: '1em',
  },
  backgroundColors: Object.assign({ inherit: 'inherit'}, bgColors),
  backgroundForegroundColors: Object.assign({ inherit: 'inherit'}, bfgColors),
  rotate: {
    '45': '45deg',
    '90': '90deg',
    '135': '135deg',
    '180': '180deg',
    '225': '225deg',
    '270': '270deg',
    '315': '315deg',
  },
  borderWidths: {
    default: '1px',
    '0': '0',
    '1': '.125rem',
    '2': '.25rem',
    '3': '.5rem',
    '4': '1rem',
    '5': '2rem',
  },
  borderColors: Object.assign({
    default: bgColors['n2'],
    inherit: 'inherit',
  }, bgColors),
  borderRadius: {
    default: '.125rem',
    '0': '0',
    '1': '.125rem',
    '2': '.25rem',
    '3': '.5rem',
    '4': '1rem',
    '-100': '100%',
    '-pill': '9999px',
  },
  width: {
    '-auto': 'auto',
    '-px': '1px',
    '1': '1rem',
    '2': '2rem',
    '3': '4rem',
    '4': '8rem',
    '5': '16rem',
    '6': '24rem',
    '7': '32rem',
    '-10': '10%',
    '-15': '15%',
    '-20': '20%',
    '-25': '25%',
    '-30': '30%',
    '-33': '33%',
    '-34': '34%',
    '-35': '35%',
    '-40': '40%',
    '-45': '45%',
    '-50': '50%',
    '-55': '55%',
    '-60': '60%',
    '-65': '65%',
    '-70': '70%',
    '-75': '75%',
    '-80': '80%',
    '-85': '85%',
    '-90': '90%',
    '-95': '95%',
    '-100': '100%',
    '-third': 'calc(100% / 3)',
    '-two-thirds': 'calc(100% / 1.5)',
    '-screen': '100vw'
  },
  height: heights,
  minWidth: {
    '0': '0',
    'full': '100%',
  },
  minHeight: {
    '0': '0',
    '100': '100%',
    'vh100': '100vh'
  },
  maxWidth: {
    '1': '1rem',
    '2': '2rem',
    '3': '4rem',
    '4': '8rem',
    '5': '16rem',
    '6': '32rem',
    '7': '48rem',
    '8': '64rem',
    '9': '86rem',
    '10': '96rem',
    '-none': 'none',
    '-100': '100%'
  },
  maxHeight: {
    'full': '100%',
    'screen': '100vh',
  },
  padding: {
    'px': '1px',
    '0': '0',
    '1': '.25rem',
    '2': '.5rem',
    '3': '1rem',
    '4': '2rem',
    '5': '4rem',
    '6': '8rem',
    '7': '16rem',
  },
  margin: {
    '-px': '1px',
    '0': '0',
    '1': '.25rem',
    '2': '.5rem',
    '3': '1rem',
    '4': '2rem',
    '5': '4rem',
    '6': '8rem',
    '7': '16rem',
    '-auto': 'auto',
  },
  position: {
    '0': '0',
    '1': '.25rem',
    '2': '.5rem',
    '3': '1rem',
    '4': '2rem',
    '5': '4rem',
    '6': '8rem',
    '7': '16rem',
    '50': '50%',
    '100': '100%',
    '-50': '-50%',
    '-100': '-100%',
    '-1': '-.25rem',
    '-2': '-.5rem',
    '-3': '-1rem',
    '-4': '-2rem',
    '-5': '-4rem',
    '-6': '-8rem',
    '-7': '-16rem',
  },
  negativeMargin: {
    'px': '1px',
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '1rem',
    '4': '2rem',
    '5': '4rem',
    '6': '8rem',
    '7': '16rem',
  },
  shadows: {
    '1': '0px 0px 4px 2px rgba( 0, 0, 0, 0.2 )',
    '2': '0px 0px 8px 2px rgba( 0, 0, 0, 0.2 )',
    '3': '2px 2px 4px 2px rgba( 0, 0, 0, 0.2 )',
    '4': '2px 2px 8px 0px rgba( 0, 0, 0, 0.2 )',
    '5': '4px 4px 8px 0px rgba( 0, 0, 0, 0.2 )',
    'none': 'none',
  },
  zIndex: {
    'auto': 'auto',
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '999': 999,
    '9999': 9999,
    'max': 2147483647,
    'inherit': 'inherit',
    'initial': 'initial',
    'unset': 'unset',
  },
  opacity: {
    '0': '0',
    '025': '.025',
    '05': '.05',
    '10': '.1',
    '20': '.2',
    '30': '.3',
    '40': '.4',
    '50': '.5',
    '60': '.6',
    '70': '.7',
    '80': '.8',
    '90': '.9',
    '100': '1',
  },
  aspectRatios: {
    '16x9': '56.25%',
    '9x16': '177.77%',
    '4x3': '75%',
    '3x4': '133.33%',
    '6x4': '66.6%',
    '4x6': '150%',
    '8x5': '62.5%',
    '5x8': '160%',
    '7x5': '71.42%',
    '5x7': '140%',
    '1x1': '100%'
  },
  cms: {
    'copyLineHeight': '1.5',
    'headlineLineHeight': '1.5',
    'copyIndent': '1em',
    'copySeparator': '1.5em',
  },
  svgFill: {
    'current': 'currentColor',
  },
  svgStroke: {
    'current': 'currentColor',
  },
  stripes: {
    'light-silver': colors['light-silver'],
    'moon-gray': colors['moon-gray'],
    'light-gray': colors['light-gray'],
    'near-white': colors['near-white'],
  },

  /*
  |-----------------------------------------------------------------------------
  | Modules                  https://tailwindcss.com/docs/configuration#modules
  |-----------------------------------------------------------------------------
  |
  | Here is where you control which modules are generated and what variants are
  | generated for each of those modules.
  |
  | Currently supported variants: 'responsive', 'hover', 'focus'
  |
  | To disable a module completely, use `false` instead of an array.
  |
  */

  modules: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'active'],
    backgroundForegroundColors: ['responsive', 'hover', 'active'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borders: ['responsive'],
    borderColors: ['responsive', 'hover'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidths: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    flexbox: ['responsive'],
    float: ['responsive'],
    fonts: ['responsive'],
    fontWeights: ['responsive', 'hover'],
    height: ['responsive'],
    leading: ['responsive'],
    lists: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    negativeMargin: ['responsive'],
    opacity: ['responsive', 'hover'],
    overflow: ['responsive', 'hover'],
    padding: ['responsive'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    shadows: ['responsive'],
    svgFill: [],
    svgStroke: [],
    textAlign: ['responsive'],
    textColors: ['responsive', 'hover', 'active'],
    textSizes: ['responsive'],
    textStyle: ['responsive', 'hover', 'active'],
    tracking: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    zIndex: ['responsive'],
    aspectRatios: ['responsive'],
    rotate: ['responsive'],
    boxSizing: [],
    outline: ['responsive'],
    cms: [],
    typography: ['responsive'],
    debug: [],
    interactive: [],
    reset: [],
    stripes: []
  },

}
