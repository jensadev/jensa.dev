import { JSDOM } from "jsdom";

const random = () => {
  const segment = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${segment()}-${segment()}-${segment()}`;
};

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getReadingTime = (text) => {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s/g).length;
  const readingTime = Math.ceil(numberOfWords / wordsPerMinute);
  if (readingTime > 1) {
    return `${readingTime} minuters läsning`;
  } else {
    return `${readingTime} minuts läsning`;
  }
};

const getPageLinks = (page) => {
  const DOM = new JSDOM(page, {
    resources: "usable",
  });
  const document = DOM.window.document;

  const articleLinks = [...document.querySelectorAll("a")];
  if (articleLinks.length) {
    return articleLinks
      .filter((link) => link.href.startsWith("http"))
      .map((link) => {
        return {
          url: link.href,
          title: link.textContent,
        };
      })
      .filter(
        (link, index, self) =>
          index === self.findIndex((t) => t.title === link.title)
      );
  }
};

/**
 * Returns back some attributes based on whether the
 * link is active or a parent of an active item.
 *
 * @param {String} itemUrl - The link in question.
 * @param {String} pageUrl - The page context.
 * @returns {String} - The attributes or empty.
 */

const getLinkActiveState = (itemUrl, pageUrl) => {
  let response = '';

  if (itemUrl === pageUrl) {
    response = ' aria-current="page"';
  }

  if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
    response += ' data-state="active"';
  }

  return response;
}

export { random, randInt, getReadingTime, getPageLinks, getLinkActiveState};
export default { random, randInt, getReadingTime, getPageLinks, getLinkActiveState };
