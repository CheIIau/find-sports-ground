export interface SportsGround {
  marker: Marker
  description?: string
  fileUrls?: string[]
}
export interface SportsGroundWithKey extends SportsGround {
  sportsGroundKey: string
}

export interface Comment {
  username: string
  body: string
  time: number
}

export type Marker = [number, number]
