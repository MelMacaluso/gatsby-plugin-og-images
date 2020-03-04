# Gatsby Plugin OG images

## Description

Easly get dynamically generated open graph images for your markdown pages out of a custom template of your own and use the nifty component to pass to your pages SEO ready og images.

## How to install

1.  `yarn add gatsby-plugin-og-images` or `npm i gatsby-plugin-og-images`
2.  Place your config options in your main `gatsby-config.js` as mentioned below.

Sample `gatsby-config.js` configuration:

```js
plugins: [
  {
    resolve: 'gatsby-plugin-og-images',
    options: {
      template: 'og',
      domain: process.env.GATSBY_DOMAIN,
      debug: true
    }
  }
];
```

## Available options

| option   | value                                         | description                                                                                                           |
| -------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| template | _string_ (required)                           | Provide here the template you want to use as the OG image page (from the `/templates` folder                          |
| domain   | _string_ (required, unless hosted on Netlify) | Provide here the url of your website, you can obviously store it in a .env variable and ie. process.env.GATSBY_DOMAIN |
| debug    | _boolean_ (otional)                           | Log the generated og images                                                                                           |

## In-built SEO component

In combo with og image generation the plugin provides a component that in combo with `react-helmet` provides SEO friendly og:images.

To use it:

```jsx
...
import OgImage from  'gatsby-plugin-og-images'
....

const  Og = ({ data }) => {
	const { id } = data.markdownRemark
	return (
		<div>
			...
			<OgImage id={id}  />
		</div>
	)
}

export const og = graphql`
query og($id: String!) {
	markdownRemark(id: { eq: $id }) {
		id
	}
}`

```
