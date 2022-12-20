const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const mila = require('markdown-it-link-attributes');
const mia = require('markdown-it-attrs');
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const fs = require('fs');
const { format, parseISO } = require('date-fns');
const { sv } = require('date-fns/locale');
const Image = require('@11ty/eleventy-img');
const markdownItAnchor = require('markdown-it-anchor');
const htmlmin = require('html-minifier');
const eleventyPluginTOC = require('@thedigitalman/eleventy-plugin-toc-a11y');

// filters and shortcodes

const getSvgContent = (file, classList) => {
    let relativeFilePath = `./src/_includes/assets/icons/${file}`;
    let data = fs.readFileSync(relativeFilePath, (err, contents) => {
        if (err) return err;
        return contents;
    });
    if (classList) {
        return (
            data.toString('utf8').slice(0, 4) +
            ` class="${classList}" ` +
            data.toString('utf8').slice(4)
        );
    } else {
        return data.toString('utf8');
    }
};

const year = () => {
    return `${new Date().getFullYear()}`;
};
const imageShortcode = async (
    src,
    alt,
    title,
    sizes = '(min-width: 30em) 50vw, 100vw'
) => {
    const metadata = await Image(src, {
        widths: [400, 800, null],
        outputDir: './public/img/',
    });

    const imageAttributes = {
        alt,
        title,
        sizes,
        loading: 'lazy',
        decoding: 'async',
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes, {
        whitespaceMode: 'inline',
    });
};

const readableDate = (dateObj) => {
    if (typeof dateObj === 'string') {
        dateObj = parseISO(dateObj);
    }
    return format(dateObj, 'PPP', { locale: sv });
};

const frontDate = (dateObj) => {
    if (typeof dateObj === 'string') {
        dateObj = parseISO(dateObj);
    }
    return format(dateObj, 'MMM yyyy', { locale: sv });
    // let arr = temp.split(' ');
    // return `<span>${arr[0]}</span><span> ${arr[1]} ${arr[2]}</span>`;
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
const htmlDateString = (dateObj) => {
    if (typeof dateObj === 'string') {
        dateObj = parseISO(dateObj);
    }
    return format(dateObj, 'yyyy-MM-dd');
};

const yearString = (dateObj) => {
    if (typeof dateObj === 'string') {
        dateObj = parseISO(dateObj);
    }
    return format(dateObj, 'yyyy');
};

const tagCountCss = (count) => {
    const prefix = 'tag-cloud__item--';
    if (count < 2) {
        return `${prefix}100`;
    } else if (count < 4) {
        return `${prefix}200`;
    } else {
        return `${prefix}300`;
    }
};

const filterTagList = (tags) => {
    return (tags || []).filter(
        (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1
    );
};

const randomColor = () => {
    const colors = [
        'orange',
        'red',
        'blue',
        'yellow',
        'magenta',
        'green',
        'cyan',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const splitHeading = (str) => {
    let arr = [];
    let first = '';
    let middle = '';
    let last = '';
    if (str.includes(',')) {
        arr = str.split(',');
        first = arr.shift() + ',';
        if (arr[0] !== undefined) {
            let temp = arr[0].trim().split(' ');
            for (let i = 0; i < temp.length; i++) {
                if (i === temp.length - 1) {
                    last = temp[i];
                } else {
                    middle = middle + ' ' + temp[i];
                }
            }
        }
    } else {
        arr = str.split(' ');
        first = arr.shift();
        for (let i = 0; i < arr.length; i++) {
            if (i === arr.length - 1) {
                last = arr[i];
            } else {
                middle = middle + ' ' + arr[i];
            }
        }
    }
    if (last.length <= 3) {
        middle += ' ' + last;
        last = '';
    }
    if (middle.length < 1) {
        middle = last;
        last = '';
    }
    return [first, middle, last];
};
module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(rssPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.addPlugin(eleventyPluginTOC, {
        headingText: 'På den här sidan',
        tags: ['h2', 'h3', 'h4'],
    });

    eleventyConfig.addWatchTarget('./src/sass/');
    eleventyConfig.addWatchTarget('./src/js/');

    // Filters

    eleventyConfig.addFilter('getDemo', function (demos, title) {
        return demos.find((demo) => demo.data.title === title);
    });

    eleventyConfig.addFilter('randomColor', randomColor);
    eleventyConfig.addFilter('splitHeading', splitHeading);
    eleventyConfig.addFilter('tagCountCss', tagCountCss);
    eleventyConfig.addFilter('readableDate', readableDate);
    eleventyConfig.addFilter('frontDate', frontDate);
    eleventyConfig.addFilter('yearString', frontDate);
    eleventyConfig.addFilter('htmlDateString', htmlDateString);
    eleventyConfig.addFilter('linebreak', (str) => str.split(' ').join('\n'));

    // Shortcodes

    eleventyConfig.addShortcode('year', year);
    eleventyConfig.addShortcode('svg', getSvgContent);
    eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);

    eleventyConfig.addFilter('filterTagList', filterTagList);

    // Create an array of all tags
    eleventyConfig.addCollection('tagList', (collection) => {
        const tagSet = new Set();
        collection.getAll().forEach((item) => {
            (item.data.tags || []).forEach((tag) => tagSet.add(tag));
        });
        return filterTagList([...tagSet]);
    });

    // collections

    // Get only content that matches a tag
    eleventyConfig.addCollection('demos', function (collectionApi) {
        return collectionApi.getFilteredByTag('demos');
    });

    eleventyConfig.addCollection('orderedDemos', function (collectionApi) {
        return collectionApi.getFilteredByTag('demos').sort((a, b) => {
            return a.data.order - b.data.order;
        });
    });

    eleventyConfig.addCollection('pages', (collectionApi) =>
        collectionApi
            .getFilteredByGlob(['src/pages/*.md', 'src/projects/index.*'])
            .sort((a, b) => b.data.order - a.data.order)
    );

    eleventyConfig.addCollection('posts', (collectionApi) =>
        collectionApi.getFilteredByGlob('src/posts/*.md').reverse()
    );

    eleventyConfig.addCollection('projects', (collectionApi) =>
        collectionApi.getFilteredByGlob('src/projects/*.md').reverse()
    );

    eleventyConfig.addCollection('resources', (collectionApi) =>
        collectionApi.getAll().filter((item) => item.data.category === 'resurs')
    );

    eleventyConfig.addCollection('feed', (collectionApi) =>
        [...collectionApi.getFilteredByGlob('src/posts/*.md')]
            .reverse()
            .slice(0, 5)
    );

    const markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
    })
        .use(markdownItAnchor, {
            permalink: markdownItAnchor.permalink.linkInsideHeader({
                symbol: `<span class="anchor" aria-hidden="true">#</span>`,
                placement: 'before',
            }),
            level: [1, 2, 3, 4],
            slugify: (s) =>
                s
                    .trim()
                    .toLowerCase()
                    .replace(/[\s+~\/]/g, '-')
                    .replace(/[().`,%·'"!?¿:@*]/g, ''),
        })
        .use(mila, {
            pattern: /^https:/,
            attrs: {
                target: '_blank',
                rel: 'noopener',
            },
        })
        .use(mia, {
            allowedAttributes: ['id', 'class'],
        });

    eleventyConfig.setLibrary('md', markdownLibrary);

    // 404
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, bs) {
                bs.addMiddleware('*', (req, res) => {
                    const content_404 = fs.readFileSync('public/404.html');
                    // Add 404 http status code in request header.
                    res.writeHead(404, {
                        'Content-Type': 'text/html; charset=UTF-8',
                    });
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            },
        },
    });

    // Minify
    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        if (outputPath && outputPath.indexOf('.html') > -1) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
            });
            return minified;
        }
        return content;
    });

    eleventyConfig.addPassthroughCopy('src/robots.txt');
    eleventyConfig.addPassthroughCopy('./src/js');
    eleventyConfig.addPassthroughCopy('./src/favicon.ico');
    eleventyConfig.addPassthroughCopy('./src/assets/');

    return {
        dir: {
            input: 'src',
            output: 'public',
        },
        passthroughFileCopy: true,
    };
};
