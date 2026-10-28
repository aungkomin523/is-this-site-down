import { useEffect } from 'react'

// Sets the tab title, meta description and canonical URL for one page,
// and puts the originals back when the user leaves the page.
export function usePageMeta({ title, description, canonical }) {
  useEffect(() => {
    const descriptionTag = document.querySelector('meta[name="description"]')
    const canonicalTag = document.querySelector('link[rel="canonical"]')

    const previous = {
      title: document.title,
      description: descriptionTag?.getAttribute('content'),
      canonical: canonicalTag?.getAttribute('href'),
    }

    if (title) document.title = title
    if (description) descriptionTag?.setAttribute('content', description)
    if (canonical) canonicalTag?.setAttribute('href', canonical)

    return () => {
      document.title = previous.title
      if (previous.description) descriptionTag?.setAttribute('content', previous.description)
      if (previous.canonical) canonicalTag?.setAttribute('href', previous.canonical)
    }
  }, [title, description, canonical])
}
