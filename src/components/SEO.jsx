// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async'

function SEO({ title, description, canonical, og = {} }) {
  const siteName = 'This&That'
  const defaultDesc = 'Best Academic Institution in Moradabad.'
  const defaultUrl = 'localhost:5173'

  return (
    <Helmet>
      {/* Primary */}
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={canonical || defaultUrl} />

      {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content={og.type || 'website'} />
      <meta property="og:title" content={og.title || title || siteName} />
      <meta property="og:description" content={og.description || description || defaultDesc} />
      <meta property="og:url" content={og.url || canonical || defaultUrl} />
      <meta property="og:site_name" content={siteName} />
      {og.image && <meta property="og:image" content={og.image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={og.title || title || siteName} />
      <meta name="twitter:description" content={og.description || description || defaultDesc} />
      {og.image && <meta name="twitter:image" content={og.image} />}
    </Helmet>
  )
}

export default SEO