// Component library page: built for local and staging review, never published to production.
export default {
  eleventyExcludeFromCollections: true,
  isiMode: "full",
  layout: "layouts/page.njk",
  eleventyComputed: {
    permalink: (data) => (data.env.isProduction ? false : "/styleguide/index.html"),
  },
};
