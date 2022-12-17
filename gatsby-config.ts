import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      __key: `pages`,
      options: {
        "name": `pages`,
        "path": `./src/pages/`,
      },
      resolve: `gatsby-source-filesystem`,
    },
  ],
  siteMetadata: {
    siteUrl: `https://mastodon-lists-manager.huey.xyz`,
    title: `Mastodon Lists Manager`,
  },
}

export default config
