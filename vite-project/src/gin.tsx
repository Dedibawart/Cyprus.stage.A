
import { useState } from 'react'

// Informations Wikipédia
type Info = {
  title: string
  description?: string
  extract: string
  thumbnail?: { source: string }
  content_urls: { desktop: { page: string } }
}

export default function App() {
  const [recherche, setRecherche] = useState('')
  const [info, setInfo] = useState<Info | null>(null)
  const [erreur, setErreur] = useState('')

  const chercher = () => {
    setInfo(null)
    setErreur('')

    fetch('https://fr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(recherche))
      .then((res) => {
        if (!res.ok) throw new Error('Article introuvable')
        return res.json()
      })
      .then((data: Info) => setInfo(data))
      .catch((err: Error) => setErreur(err.message))
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>

      <input
        type="text"
        placeholder="Rechercher..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      <button onClick={chercher}>
        Chercher
      </button>

      {erreur && <p>{erreur}</p>}

      {!info && !erreur && <p>Écris quelque chose à rechercher.</p>}

      {info && (
        <div>
          <h1>{info.title}</h1>

          {info.description && <p><i>{info.description}</i></p>}

          {info.thumbnail && (
            <img src={info.thumbnail.source} alt={info.title} width={200} />
          )}

          <p>{info.extract}</p>

          <a href={info.content_urls.desktop.page} target="_blank" rel="noreferrer">
            Lire l'article complet
          </a>
        </div>
      )}

    </div>
  )
}
