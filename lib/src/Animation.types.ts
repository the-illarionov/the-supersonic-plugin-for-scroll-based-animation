export type Constructor = {
  id: string
  animation: CSSAnimation
}

export type Selector = |
  string |
  {
    selector: string
    animations: string[]
  }

export type Render = {
  driverProgress: number
}
