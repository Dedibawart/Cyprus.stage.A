import { useState } from 'react'
import type { SubmitEvent } from 'react'

type ScrapedInfo = {
  title: string
  intro: string
  image?: string
  sections: string[]
  url: string
}

export default function App() {
  const [recherche, setRecherche] = useState('')
  const [info, setInfo] = useState<ScrapedInfo | null>(null)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const scraperWikipedia = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const terme = recherche.trim()
    if (!terme) return

    setInfo(null)
    setErreur('')
    setChargement(true)

    try {
      // 1. Récupérer le code HTML brut de la page Wikipédia (origin=* évite le blocage CORS)
      const apiUrl = `https://fr.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(terme)}&format=json&origin=*&redirects=1`

      const res = await fetch(apiUrl)
      const data = await res.json()

      if (data.error) {
        throw new Error('Article introuvable')
      }

      // 2. Transformer le texte HTML en vrai DOM manipulable
      const htmlBrut = data.parse.text['*']
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlBrut, 'text/html')

      // 3. Scraper les éléments précis dans le HTML (comme avec BeautifulSoup ou Cheerio)
      
      // Scraper le premier paragraphe valide (> 50 caractères)
      const paragraphes = Array.from(doc.querySelectorAll('p'))
      const premierParagraphe = paragraphes.find(
        (p) => p.textContent && p.textContent.trim().length > 50
      )

      // Scraper la première image de l'infobox ou de l'article
      const imgElement = doc.querySelector('.infobox img, .thumbimage') as HTMLImageElement | null
      const imageUrl = imgElement?.getAttribute('src')
        ? `https:${imgElement.getAttribute('src')}`
        : undefined

      // Scraper tous les titres de sections (h2)
      const sections = Array.from(doc.querySelectorAll('.mw-heading2 h2')).map(
        (h2) => h2.textContent?.trim() || ''
      )

      setInfo({
        title: data.parse.title,
        intro: premierParagraphe?.textContent?.trim() || 'Aucun texte trouvé.',
        image: imageUrl,
        sections,
        url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(data.parse.title)}`,
      })
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Erreur lors du scraping')
    } finally {
      setChargement(false)
    }
  }

  return (
    <main className="home">
      <section className="home__search" aria-labelledby="home-title">
        {/* <p className="home__eyebrow">Recherche Wikipédia</p> */}
        {/* <h2 id="home-title">Trouvez un article en quelques secondes</h2> */}
        {/* <p className="home__description">
          Saisissez un sujet pour afficher son résumé et les sections principales.
        </p> */}

        <form className="home__form" onSubmit={scraperWikipedia}>
          <label className="home__label" htmlFor="wiki-search">
            Sujet à rechercher
          </label>
          <input
            id="wiki-search"
            className="home__input"
            type="text"
            placeholder="Ex. : Les volcans"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <button className="home__button" type="submit" disabled={chargement}>
            {chargement ? 'Recherche…' : 'Rechercher'}
          </button>
        </form>
      </section>

      <div className="home__content" aria-live="polite">
        {erreur && (
          <p className="home__message home__message--error" role="alert">
            {erreur}
          </p>
        )}

        {!info && !erreur && !chargement && (
          <p className="home__message">
            Votre résultat apparaîtra ici.
          </p>
        )}

        {chargement && (
          <p className="home__message">Recherche en cours…</p>
        )}

        {info && (
          <article
            className={`home__result${info.image ? ' home__result--with-image' : ''}`}
          >
            <div className="home__result-main">
              <p className="home__eyebrow">Article trouvé</p>
              <h1 className="home__result-title">{info.title}</h1>
              <p className="home__intro">{info.intro}</p>
              <a
                className="home__link"
                href={info.url}
                target="_blank"
                rel="noreferrer"
              >
                Lire l’article complet
              </a>
            </div>

            {info.image && (
              <img className="home__image" src={info.image} alt={info.title} />
            )}

            {info.sections.length > 0 && (
              <section className="home__sections" aria-labelledby="sections-title">
                <h2 id="sections-title">Dans cet article</h2>
                <ul>
                  {info.sections.map((section, index) => (
                    <li key={`${section}-${index}`}>{section}</li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        )}
      </div>
    </main>
  )
}
