import { format, parseISO } from "date-fns"
import { sv } from "date-fns/locale"
import slugify from "slugify"

const readableDate = (dateObj) => {
  if (typeof dateObj === "string") {
    dateObj = parseISO(dateObj)
  }
  return format(dateObj, "PPP", { locale: sv })
}

const frontDate = (dateObj) => {
  if (typeof dateObj === "string") {
    dateObj = parseISO(dateObj)
  }
  return format(dateObj, "dd MMMM yyyy", { locale: sv })
}

const htmlDateString = (dateObj) => {
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  if (typeof dateObj === "string") {
    dateObj = parseISO(dateObj)
  }
  return dateObj.toISOString().split("T")[0]
}

const yearString = (dateObj) => {
  if (typeof dateObj === "string") {
    dateObj = parseISO(dateObj)
  }
  return dateObj.getFullYear()
}

const getProject = (projects, title) => {
  return projects.find((project) => project.title === title)
}

const tagFilter = (posts, tag) => {
  return posts.filter((item) => item.data.tags.includes(tag))
}

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

const limit = (arr, limit) => {
  return arr.slice(0, limit)
}

const getYears = (arr) => {
  const years = []
  arr.forEach((item) => {
    const year = item.data.date.getFullYear()
    if (!years.includes(year)) {
      years.push(year)
    }
  })
  return years
}

const getDemo = (demos, title) => {
  return demos.find((demo) => demo.data.title === title)
}

const slug = (str) => {
  if (!str) {
    return
  }

  return slugify(str, {
    lower: true,
    strict: true,
    remove: /["]/g,
  })
}

function getMatchingLink(page, localeLinks) {
  const urlSegments = page.url.split('/');
  const lastNonEmptyIndex = urlSegments.reduce((lastIndex, segment, index) => {
    return segment ? index : lastIndex;
  }, -1);

  const lastSegment = urlSegments[lastNonEmptyIndex];
  // console.log(lastSegment);

  const matchingLink = localeLinks.find(link => link.url.includes(lastSegment));
  // console.log(matchingLink);

  if (matchingLink) {
    return matchingLink;
  }
}


export {
  frontDate,
  getDemo,
  getProject,
  getYears,
  htmlDateString,
  limit,
  readableDate,
  shuffleArray,
  slug,
  slugify,
  tagFilter,
  yearString,
  getMatchingLink
}
