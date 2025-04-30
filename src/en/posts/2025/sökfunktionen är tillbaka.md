---
title: The search function is back!
emphasis: 0
date: 2025-04-30
draft: false
summary: "I've used a search function based on Duncan McDougall's blog post, but it stopped working with Eleventy 3. This blog post describes how I fixed it, and I hope I can give something back for something that really helped me."
tags: [ 'eleventy', 'elasticlunr']
---

So when I first created this site I used a search function that I based on an blog post, [eleventy search](https://www.belter.io/eleventy-search/) written by [Duncan McDougall](https://www.belter.io/), it was a great post and it solved something that I wanted for my site. It was a basic search function and it worked. Essentially it parsed all the pages on the site and created a JSON file with all the content that could be searched using [elasticlunr](http://elasticlunr.com/).

## The problem

Fast forward to [Eleventy 3](https://www.11ty.dev/) and it no longer worked. It kept spitting errors during the build process. This was due to the process being asynchronous and it didn't resolve properly.

The error looked like this:
{% raw %}
```bash
[11ty] Unhandled rejection in promise:
[11ty] Unfortunately you’re using code that monkey patched some Eleventy internals and it isn’t async-friendly. Change your code to use the async `read()` method on the template instead!
[11ty]
[11ty] Original error stack trace: Error: Unfortunately you’re using code that monkey patched some Eleventy internals and it isn’t async-friendly. Change your code to use the async `read()` method on the template instead!
```
{% endraw %}

So Eleventy suggested a solution, and I didn't get it to work at the time. But I've now revisited the problem and sorted it out. So I thought I would share the solution here, in case someone else has the same problem.

## The solution

So the solution is indeed to use the async `read()` method on the template instead of the `page.template` object to read the content of the page. The `page.template` object was not async-friendly, and it was causing the error.

This is the updated code that I used to create the search index:

```javascript
import elasticlunr from "elasticlunr"

const searchFilter = async (collection) => {
    // what fields we'd like our index to consist of
    const index = elasticlunr(function () {
        this.addField("title")
        this.addField("summary")
        this.addField("tags")
        this.addField("category")
        this.setRef("id")
    })

    // loop through each page and add it to the index
    for (const page of collection) {
        const { data } = await page.template.read()

        // if the page is excluded from collections, skip it
        if (data.eleventyExcludeFromCollections) continue
        // if the page is not a post, skip it
        if (!page.url.includes("/posts/")) continue
        // if the page is not a markdown file, skip it
        if (!page.inputPath.endsWith(".md")) continue

        index.addDoc({
            id: page.url,
            title: data.title,
            summary: data.summary || "",
            tags: data.tags ? data.tags.toString() : "",
            category: data.category || "",
        })
    }

    return index.toJSON()
}

export { searchFilter }
```

So the code is mostly the same as before, but now we use `await page.template.read()` to get the data from the page. This is an async function that returns a promise, and it resolves to the data object that we need.
This means that we can now use the `data` object to get the properties we need for the search index.

Now it's just a case of using the `searchFilter` function to generate the search index and save it to a JSON file. I do this in the same way as in the original post, with a `search-index.json.njk` file.

{% raw %}
```njk
---
permalink: /search-index.json
---

{{ collections.search | searchFilter | dump | safe }}
```
{% endraw %}

## Conclusion

So that's it! I hope this helps someone else who is having the same problem. The search function is now working again, and I'm happy to have it back on my site.