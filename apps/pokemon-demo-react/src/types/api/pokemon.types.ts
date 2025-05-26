export interface PokemonListResponse {
  count: number
  next: string
  previous: null
  results: Array<Result>
}

interface Result {
  name: string
  url: string
}
