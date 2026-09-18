/** Geometry of the auth mockups, normalised against the 941 x 1672 source art. */

export const PROTOTYPE_SIZE = { width: 941, height: 1672 } as const

export interface PrototypeSpot {
  x: number
  y: number
  w: number
  h: number
}

/** An input line also carries the vertical centre of the mockup glyphs. */
export interface FieldSpot extends PrototypeSpot {
  line: number
}

export interface AuthLayout {
  tabLogin: PrototypeSpot
  tabRegister: PrototypeSpot
  email: FieldSpot
  code?: FieldSpot
  sendCode?: PrototypeSpot
  password: FieldSpot
  confirm?: FieldSpot
  forgot?: PrototypeSpot
  agreeBox?: PrototypeSpot
  agreeText?: PrototypeSpot
  submit: PrototypeSpot
  message: PrototypeSpot
}

const TAB_LEFT = { x: 10.1, y: 38.3, w: 38.8, h: 6 }
const TAB_RIGHT = { x: 50.05, y: 38.3, w: 39.7, h: 6 }

export const LOGIN_LAYOUT = {
  tabLogin: TAB_LEFT,
  tabRegister: TAB_RIGHT,
  email: { x: 23.2, y: 46.6, w: 63.4, h: 5.5, line: 49.34 },
  password: { x: 23.2, y: 54.5, w: 63.4, h: 5.5, line: 57.21 },
  forgot: { x: 69.1, y: 60.4, w: 20.7, h: 3.6 },
  submit: { x: 10.5, y: 67.5, w: 78.9, h: 6.8 },
  message: { x: 9.6, y: 74.9, w: 80.8, h: 3 },
} satisfies AuthLayout

export const REGISTER_LAYOUT = {
  tabLogin: TAB_LEFT,
  tabRegister: TAB_RIGHT,
  email: { x: 23.1, y: 46.3, w: 63.6, h: 5.5, line: 49.1 },
  code: { x: 21.7, y: 53.7, w: 38.5, h: 5.5, line: 56.4 },
  sendCode: { x: 61.6, y: 53.3, w: 26.6, h: 5.8 },
  password: { x: 23.1, y: 61.2, w: 63.6, h: 5.5, line: 63.97 },
  confirm: { x: 23.2, y: 68.6, w: 63.4, h: 5.5, line: 71.32 },
  agreeBox: { x: 10.6, y: 75.9, w: 8.5, h: 4.5 },
  agreeText: { x: 21.3, y: 75.9, w: 67, h: 4.5 },
  submit: { x: 10.3, y: 81.4, w: 79.4, h: 7 },
  message: { x: 9.6, y: 89.1, w: 80.8, h: 3 },
} satisfies AuthLayout

/** Injection key used by AuthStage to tell AuthSpot to draw its debug outline. */
export const authDebugKey = Symbol('auth-debug') as import('vue').InjectionKey<import('vue').ComputedRef<boolean>>
