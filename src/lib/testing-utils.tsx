// src/lib/testing-utils.tsx

import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/AdvancedThemeProvider'

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
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
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
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
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

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    group: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    image: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    vote: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

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

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Test utilities
export const testUtils = {
  // Mock data generators
  createMockIdea: (overrides = {}) => ({
    id: 'test-idea-id',
    title: 'Test Idea',
    prompt: 'Test prompt for idea',
    summary: 'Test summary',
    tags: ['test', 'idea'],
    palette: ['#ff0000', '#00ff00', '#0000ff'],
    status: 'COMPLETED',
    budgetLevel: 'MEDIUM',
    monthHint: 6,
    kids: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'test-user-id',
    groupId: 'test-group-id',
    ...overrides,
  }),

  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  createMockGroup: (overrides = {}) => ({
    id: 'test-group-id',
    name: 'Test Group',
    slug: 'test-group',
    description: 'Test group description',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  createMockImage: (overrides = {}) => ({
    id: 'test-image-id',
    url: 'https://example.com/image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
    ideaId: 'test-idea-id',
    createdAt: new Date(),
    ...overrides,
  }),

  // Mock functions
  mockFetch: (response: any, status = 200) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      })
    ) as jest.Mock
  },

  mockLocalStorage: () => {
    const store: Record<string, string> = {}
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
    }
  },

  mockIntersectionObserver: () => {
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
  },

  mockResizeObserver: () => {
    const mockResizeObserver = jest.fn()
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.ResizeObserver = mockResizeObserver
  },

  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock router
  mockRouter: {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  },

  // Mock session
  mockSession: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
    status: 'authenticated' as const,
  },
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
export { testUtils as utils }
