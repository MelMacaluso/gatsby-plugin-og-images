const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const ogPages = []
const isPluginDevelopment = process.env.GATSBY_PLUGIN_DEVELOPMENT


exports.createPages = async ({ actions, graphql }, options, cb) => {
  const { createPage } = actions
  const { template } = options
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.error(errors)
    return console.error({...result.errors})
  }

  const posts = result.data.allMarkdownRemark.edges

  for (const edge of posts) {
    ogPages.push(`${edge.node.id}`)
    // const componentPath = isPluginDevelopment ? path.resolve( `src/templates/${template}.js`)
    //   : path.resolve( `src/templates/${template}.js`)

    createPage({
      path: `og-pages/${edge.node.id}`,
      component: path.resolve( `src/templates/${template}.js`),
      context: {
        id: edge.node.id,
      },
    })
   }

   cb()

}


exports.onPostBuild = async (_, options) => {
  const basePath = `${options.domain}og-pages`
  for (const ogPage of ogPages) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const ogPagePath = `${basePath}/${ogPage}/`
    console.log(ogPagePath)
    await page.setViewport({
      width: 640,
      height: 320,
    })
    await page.goto(ogPagePath,  { 'waitUntil' : 'networkidle2' })
    await fs.mkdir(path.resolve('./public/og-images/'), () => {})
    await page.screenshot({
      path: path.resolve(`./public/og-images/${ogPage}.png`),
      deviceScaleFactor: 2
    })
    await browser.close()
  }
}