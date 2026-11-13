// Defaults for every page in src/pages. A page's own front matter overrides these.
export default {
  layout: "layouts/page.njk",
  isiMode: "full",
  date: "git Last Modified",
  // src/pages/treatment/fictiva-dosing.md → /treatment/fictiva-dosing.html
  permalink: (data) => data.page.filePathStem.replace(/^\/pages/, "") + ".html",
};
