import React from 'react'
import Helmet from "react-helmet"

const OgImage = ({id}) => {
  const domain = process.env.GATSBY_DOMAIN
  return (
    <Helmet
      meta={[
        {
          property: "og:image",
          content: `${domain}/og-images/${id}.png`
        },
        {
          property: "og:image:secure_url",
          content: `${domain}/og-images/${id}.png`
        },
        {
          property: "og:image:type",
          content: `image/png`
        }
      ]}
    />
  )
}

export default OgImage