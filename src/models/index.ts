export interface SportsGround {
  marker: Marker
  description?: string
  fileUrls?: string[]
}
export interface SportsGroundWithKey extends SportsGround {
  sportsGroundKey: string
}

export interface Comment {
  userName: string
  body: string
  time: string
}

export type Marker = [number, number]
