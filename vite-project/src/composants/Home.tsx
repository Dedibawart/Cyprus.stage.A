import { useState } from 'react'

// Informations Wikipédia
type Info = {
  title: string
  description?: string
  extract: string
  thumbnail?: { source: string }
  content_urls: { desktop: { page: string } }
}

type PageRecherche = {
  title: string
}

type ReponseRecherche = {
  query?: { search?: PageRecherche[] }
}

export default function Home() {
  const [recherche, setRecherche] = useState('')
  const [infos, setInfos] = useState<Info[] | null>(null)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const chercher = async () => {
    const terme = recherche.trim()
    setErreur('')
    setInfos(null)

    if (!terme) {
      setErreur('Saisis un terme à rechercher.')
      setInfos([])
      return
    }

    setChargement(true)

    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: terme,
        srlimit: '5',
        format: 'json',
        origin: '*',
      })
      const searchResponse = await fetch(`https://fr.wikipedia.org/w/api.php?${params}`)

      if (!searchResponse.ok) throw new Error('La recherche a échoué.')

      const searchData: ReponseRecherche = await searchResponse.json()
      const pages = searchData.query?.search ?? []
      const resultats = await Promise.all(
        pages.map(async ({ title }) => {
          const summaryResponse = await fetch(
            'https://fr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title),
          )

          if (!summaryResponse.ok) throw new Error(`Impossible de charger l’article « ${title} ».`)

          return (await summaryResponse.json()) as Info
        }),
      )

      setInfos(resultats)
    } catch (err) {
      setInfos([])
      setErreur(err instanceof Error ? err.message : 'Une erreur est survenue pendant la recherche.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <input
        type="text"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !chargement) void chercher()
        }}
        placeholder="Rechercher"
        aria-label="Rechercher "
      />

      <button onClick={chercher} disabled={chargement}>
        {chargement ? 'Recherche…' : 'Chercher'}
      </button>

      {erreur && <p role="alert">{erreur}</p>}
      {chargement && <p>Recherche en cours…</p>}
      {infos === null && !chargement && !erreur && <p>ecrire un truc</p>}
      {infos?.length === 0 && !chargement && !erreur && <p>Aucun résultat trouvé.</p>}

      {infos?.map((info) => (
        <div key={info.title}>
          <h1>{info.title}</h1>
          {info.description && <p><i>{info.description}</i></p>}
          {info.thumbnail && <img src={info.thumbnail.source} alt={info.title} />}
          <p>{info.extract}</p>
          <a href={info.content_urls.desktop.page} target="_blank" rel="noreferrer">
            Lire plus
          </a>
        </div>
      ))}
    </div>
  )
}