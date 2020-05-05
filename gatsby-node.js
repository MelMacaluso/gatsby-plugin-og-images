const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const ogPages = []

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
  const { NETLIFY, URL } = process.env
  const { debug, width, height } = options
  const domain = NETLIFY ? URL : options.domain
  const basePath = `${domain}/og-pages`
  const viewPortWidth = width || 640;
  const viewPortHeight = height || 320;

  if(debug) {
    console.info('The following og images have been generated:')
  }

  for (const ogPage of ogPages) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const ogPagePath = `${basePath}/${ogPage}/`
    await page.setViewport({
      width,
      height
    })
    await page.goto(ogPagePath,  { 'waitUntil' : 'networkidle2' })
    await fs.mkdir(path.resolve('./public/og-images/'), () => {})
    await page.screenshot({
      path: path.resolve(`./public/og-images/${ogPage}.png`),
      deviceScaleFactor: 2
    })
    await browser.close()

    if(debug) {
      console.info(`${domain}/og-images/${ogPage}.png`)
    }
  }
}