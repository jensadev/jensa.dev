import { EleventyI18nPlugin } from "@11ty/eleventy"
import rssPlugin from "@11ty/eleventy-plugin-rss"
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"
import emojiReadTime from "@11tyrocks/eleventy-plugin-emoji-readtime"
import lightningCSS from "@11tyrocks/eleventy-plugin-lightningcss"
import eleventyPluginTOC from "@thedigitalman/eleventy-plugin-toc-a11y"
import { minify as htmlmin } from "html-minifier-terser"

// Import collections
import {
    drafts,
    pages,
    postsAllLang,
    postsEn,
    postsSv,
    projects,
    resources,
    tagList,
} from "./src/_config/collections.js"
// Import filters
import {
    frontDate,
    getProject,
    getYears,
    htmlDateString,
    limit,
    readableDate,
    shuffleArray,
    slug,
    tagFilter,
    yearString,
    getMatchingLink
} from "./src/_config/filters/index.js"
import { searchFilter } from "./src/_config/filters/searchFilter.js"

// Plugins
import markdownLibrary from "./src/_config/plugins/markdown.js"
// Import shortcodes
import {
    getSvgContent,
    imageShortcode,
    year,
    youtube,
    codepen,
} from "./src/_config/shortcodes.js"

export default function (eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/assets/js/")

    // Plugins
    eleventyConfig.addPlugin(rssPlugin)
    eleventyConfig.addPlugin(syntaxHighlight)
    eleventyConfig.addPlugin(eleventyPluginTOC, {
        headingText: "Innehållsförteckning",
    })
    eleventyConfig.addPlugin(emojiReadTime, {
        emoji: "📕",
        showEmoji: false,
        label: "minuters läsning",
        wpm: 200,
        bucketSize: 3,
    })
    eleventyConfig.addPlugin(lightningCSS)
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "sv",
        errorMode: "allow-fallback",
    })

    // Filters
    eleventyConfig.addFilter("readableDate", readableDate)
    eleventyConfig.addFilter("frontDate", frontDate)
    eleventyConfig.addFilter("yearString", yearString)
    eleventyConfig.addFilter("htmlDateString", htmlDateString)
    eleventyConfig.addFilter("getProject", getProject)
    eleventyConfig.addFilter("tagFilter", tagFilter)
    eleventyConfig.addFilter("shuffle", shuffleArray)
    eleventyConfig.addFilter("limit", limit)
    eleventyConfig.addFilter("getYears", getYears)
    eleventyConfig.addFilter("slug", slug)
    eleventyConfig.addFilter("getMatchingLink", getMatchingLink)
    eleventyConfig.addFilter("searchFilter", searchFilter)

    // Shortcodes
    eleventyConfig.addShortcode("year", year)
    eleventyConfig.addShortcode("svg", getSvgContent)
    eleventyConfig.addShortcode("youtube", youtube)
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode)
    eleventyConfig.addShortcode("codepen", codepen)

    // Collections
    eleventyConfig.addCollection("tagList", tagList)
    eleventyConfig.addCollection("pages", pages)
    eleventyConfig.addCollection("posts", postsAllLang)
    eleventyConfig.addCollection("postsSv", postsSv)
    eleventyConfig.addCollection("postsEn", postsEn)
    eleventyConfig.addCollection("projects", projects)
    eleventyConfig.addCollection("resources", resources)
    eleventyConfig.addCollection("drafts", drafts)
    eleventyConfig.addCollection("search", collection => {
        return [...collection.getFilteredByGlob("./src/**/posts/**/*.md")];
    });
    eleventyConfig.setLibrary("md", markdownLibrary)

    // When `permalink` is false, the file is not written to disk
    eleventyConfig.addGlobalData("eleventyComputed.permalink", function () {
        return (data) => {
            // Always skip during non-watch/serve builds
            if (data.draft && !process.env.BUILD_DRAFTS) {
                return false
            }

            return data.permalink
        }
    })

    // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
    eleventyConfig.addGlobalData(
        "eleventyComputed.eleventyExcludeFromCollections",
        function () {
            return (data) => {
                // Always exclude from non-watch/serve builds
                if (data.draft && !process.env.BUILD_DRAFTS) {
                    return true
                }

                return data.eleventyExcludeFromCollections
            }
        },
    )

    eleventyConfig.on("eleventy.before", ({ runMode }) => {
        // Set the environment variable
        if (runMode === "serve" || runMode === "watch") {
            process.env.BUILD_DRAFTS = true
        }
    })

    // Minify
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath && outputPath.indexOf(".html") > -1) {
            let minified = htmlmin(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
            })
            return minified
        }
        return content
    })

    // markdown-it-attrs add class to code element rather than pre
    // this adds the popout class to the pre element
    // eleventyConfig.addTransform("addPreClass", function (content, outputPath) {
    //   if (outputPath && outputPath.endsWith(".html")) {
    //     const dom = new JSDOM(content)
    //     const document = dom.window.document
    //     const preElements = document.querySelectorAll("pre")
    //     preElements.forEach((pre) => {
    //       pre.classList.add("popout")
    //     })
    //     content = dom.serialize()
    //   }
    //   return content
    // })

    eleventyConfig.addPassthroughCopy("./src/robots.txt")
    eleventyConfig.addPassthroughCopy("./src/favicon.ico")
    eleventyConfig.addPassthroughCopy("./src/_redirects")
    eleventyConfig.addPassthroughCopy("./src/assets/fonts")
    eleventyConfig.addPassthroughCopy("./src/assets/thumbs")
    eleventyConfig.addPassthroughCopy("./src/assets/js/elasticlunr.min.js", "/assets/js/")

    return {
        templateFormats: ["njk", "md"],
        markdownTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "public",
        },
        passthroughFileCopy: true,
    }
}
