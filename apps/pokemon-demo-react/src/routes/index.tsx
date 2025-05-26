import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { PokemonListResponse } from '@/types/api/pokemon.types'
import { gunsole } from '@/utils/gunsole'

export const Route = createFileRoute('/')({
  component: App,
})

async function queryFn() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
  if (!response.ok) throw new Error('Failed to fetch Pokémon')
  return response.json()
}

function App() {
  const { data, isLoading, error } = useQuery<PokemonListResponse>({
    queryKey: ['pokemon'],
    queryFn,
  })

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">Error loading Pokémon</div>
    )
  }

  const handleClick = () => {
    gunsole.send('log', {
      type: 'log',
      time: new Date().toISOString(),
      message: 'Hello, world!',
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Pokémon Explorer</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data?.results.map((pokemon, index) => {
          const id = index + 1
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          return (
            <button
              key={pokemon.name}
              className="p-4 border rounded shadow text-center"
              onClick={handleClick}
            >
              <img
                src={imageUrl}
                alt={pokemon.name}
                className="mx-auto w-20 h-20"
              />
              <p className="mt-2 capitalize font-medium">{pokemon.name}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
