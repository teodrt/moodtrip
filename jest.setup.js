import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
      },
      status: 'authenticated',
    }
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    img: 'img',
    section: 'section',
    article: 'article',
    header: 'header',
    footer: 'footer',
    nav: 'nav',
    main: 'main',
    aside: 'aside',
    ul: 'ul',
    ol: 'ol',
    li: 'li',
    a: 'a',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
    fieldset: 'fieldset',
    legend: 'legend',
    table: 'table',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    th: 'th',
    td: 'td',
    caption: 'caption',
    figure: 'figure',
    figcaption: 'figcaption',
    blockquote: 'blockquote',
    cite: 'cite',
    code: 'code',
    pre: 'pre',
    em: 'em',
    strong: 'strong',
    small: 'small',
    sub: 'sub',
    sup: 'sup',
    mark: 'mark',
    del: 'del',
    ins: 'ins',
    u: 'u',
    s: 's',
    q: 'q',
    abbr: 'abbr',
    address: 'address',
    bdo: 'bdo',
    kbd: 'kbd',
    samp: 'samp',
    var: 'var',
    dfn: 'dfn',
    time: 'time',
    progress: 'progress',
    meter: 'meter',
    details: 'details',
    summary: 'summary',
    dialog: 'dialog',
    menu: 'menu',
    menuitem: 'menuitem',
    command: 'command',
    output: 'output',
    canvas: 'canvas',
    svg: 'svg',
    path: 'path',
    circle: 'circle',
    rect: 'rect',
    line: 'line',
    polyline: 'polyline',
    polygon: 'polygon',
    ellipse: 'ellipse',
    g: 'g',
    defs: 'defs',
    clipPath: 'clipPath',
    mask: 'mask',
    pattern: 'pattern',
    linearGradient: 'linearGradient',
    radialGradient: 'radialGradient',
    stop: 'stop',
    image: 'image',
    text: 'text',
    tspan: 'tspan',
    textPath: 'textPath',
    foreignObject: 'foreignObject',
    switch: 'switch',
    use: 'use',
    symbol: 'symbol',
    marker: 'marker',
    view: 'view',
    animate: 'animate',
    animateMotion: 'animateMotion',
    animateTransform: 'animateTransform',
    set: 'set',
    mpath: 'mpath',
    feBlend: 'feBlend',
    feColorMatrix: 'feColorMatrix',
    feComponentTransfer: 'feComponentTransfer',
    feComposite: 'feComposite',
    feConvolveMatrix: 'feConvolveMatrix',
    feDiffuseLighting: 'feDiffuseLighting',
    feDisplacementMap: 'feDisplacementMap',
    feDistantLight: 'feDistantLight',
    feDropShadow: 'feDropShadow',
    feFlood: 'feFlood',
    feFuncA: 'feFuncA',
    feFuncB: 'feFuncB',
    feFuncG: 'feFuncG',
    feFuncR: 'feFuncR',
    feGaussianBlur: 'feGaussianBlur',
    feImage: 'feImage',
    feMerge: 'feMerge',
    feMergeNode: 'feMergeNode',
    feMorphology: 'feMorphology',
    feOffset: 'feOffset',
    fePointLight: 'fePointLight',
    feSpecularLighting: 'feSpecularLighting',
    feSpotLight: 'feSpotLight',
    feTile: 'feTile',
    feTurbulence: 'feTurbulence',
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useTransform: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useAnimation: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  })),
  useInView: jest.fn(() => true),
  useReducedMotion: jest.fn(() => false),
  useSpring: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useScroll: jest.fn(() => ({
    scrollX: { get: jest.fn(), set: jest.fn() },
    scrollY: { get: jest.fn(), set: jest.fn() },
  })),
  useVelocity: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useAnimationControls: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  })),
  useDragControls: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
  useElementScroll: jest.fn(() => ({
    scrollX: { get: jest.fn(), set: jest.fn() },
    scrollY: { get: jest.fn(), set: jest.fn() },
  })),
  useIsPresent: jest.fn(() => true),
  useLayoutEffect: jest.fn(),
  usePresence: jest.fn(() => [true, jest.fn()]),
  useCycle: jest.fn(() => [jest.fn(), jest.fn()]),
  useViewportScroll: jest.fn(() => ({
    scrollX: { get: jest.fn(), set: jest.fn() },
    scrollY: { get: jest.fn(), set: jest.fn() },
    scrollXProgress: { get: jest.fn(), set: jest.fn() },
    scrollYProgress: { get: jest.fn(), set: jest.fn() },
  })),
  useTransform: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useMotionValueEvent: jest.fn(),
  useAnimate: jest.fn(() => [jest.fn(), jest.fn()]),
  useMotionTemplate: jest.fn(() => ''),
  useTime: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useVelocity: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useWillChange: jest.fn(() => 'auto'),
  useDragControls: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
  useElementScroll: jest.fn(() => ({
    scrollX: { get: jest.fn(), set: jest.fn() },
    scrollY: { get: jest.fn(), set: jest.fn() },
  })),
  useIsPresent: jest.fn(() => true),
  useLayoutEffect: jest.fn(),
  usePresence: jest.fn(() => [true, jest.fn()]),
  useCycle: jest.fn(() => [jest.fn(), jest.fn()]),
  useViewportScroll: jest.fn(() => ({
    scrollX: { get: jest.fn(), set: jest.fn() },
    scrollY: { get: jest.fn(), set: jest.fn() },
    scrollXProgress: { get: jest.fn(), set: jest.fn() },
    scrollYProgress: { get: jest.fn(), set: jest.fn() },
  })),
  useTransform: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useMotionValueEvent: jest.fn(),
  useAnimate: jest.fn(() => [jest.fn(), jest.fn()]),
  useMotionTemplate: jest.fn(() => ''),
  useTime: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useVelocity: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })),
  useWillChange: jest.fn(() => 'auto'),
}))

// Mock Prisma (commented out to avoid module resolution issues)
// jest.mock('@/lib/prisma', () => ({
//   prisma: {
//     idea: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//     user: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//     group: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//     image: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       createMany: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//     vote: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       upsert: jest.fn(),
//       delete: jest.fn(),
//     },
//     comment: {
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//   },
// }))

// Mock Socket.io
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = jest.fn()

// Mock performance
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    mark: jest.fn(),
    measure: jest.fn(),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
})

// Mock navigator
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn(),
})

// Mock URL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mocked-uuid'),
  },
})

// Suppress console warnings in tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
  
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})
