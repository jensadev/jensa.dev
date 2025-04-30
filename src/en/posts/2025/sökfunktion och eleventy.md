---
title: Search function and Eleventy
emphasis: 0
date: 2025-04-30
draft: true
summary: "I've used a search function based on Duncan McDougall's blog post, but it stopped working with Eleventy 3. This blog post describes how I fixed it, and I hope I can give something back for something that really helped me."
tags: [ 'eleventy', 'elasticlunr']
---

So when I first created this site I used a search function that I based on an blog post, [eleventy search](https://www.belter.io/eleventy-search/) written by [Duncan McDougall](https://www.belter.io/), it was a great post and it solved something that I wanted for my site. It was a basic search function and it worked. Essentially it parsed all the pages on the site and created a JSON file with all the content that could be searched using [elasticlunr](http://elasticlunr.com/).

Fast forward to [Eleventy 3](https://www.11ty.dev/) and it no longer worked. It kept spitting errors during the build process. This was due to the process being asynchronous and it didn't wait for it to finish before moving on to the next step.