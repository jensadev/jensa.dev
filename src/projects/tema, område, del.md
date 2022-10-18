---
title: Tema, område, del
layout: layouts/project.njk
project:
    start: 2021-05-31
    end: ?
    status: Aktivt
    title: TOD
    url: https://github.com/jensnti/tod
    licens: CC BY-NC 4.0
    tech: ['11ty', 'javascript', 'sass']
    hosting: "[Netlify](https://netlify.com/)"
    description: "En webb-template för att du, jag eller andra ska kunna bygga kurswebbar utifrån en pedagogiska tanke om att dela upp ett ämne i teman, områden och delar." 
templateEngineOverride: njk, md
tags: ['node', '11ty', 'javascript']
---

{% image "./src/images/toddump-1.png", "Skärmdump av sidan programmering skapad med TOD",  "Skärmdump av sidan programmering skapad med TOD" %}

## Vad
{{ project.description }}

Webbplatser skapade med TOD:
* [Programmering](https://programmering.jensa.xyz/)
* [Webbutveckling](https://webbutveckling.jensa.xyz/)

## Hur

Sidan är skapad med {{ project.tech.join(", ") }} och hostad med {{ project.hosting }}.

## Status

Väldigt aktiv och sidan för webbutveckling har fått en hel del nytt material. Tod för programmering ligger lite i träda eftersom jag inte undervisar Programmering 1 längre. Det finns dock en tanke att göra om upplägget för programmering och börja med kod som gör något och sedan leda in vägen på variabler osv.