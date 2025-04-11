import flash from "./flash"
import { siteSearch } from "./search"
// import snow from "./particles"

const consent = localStorage.getItem("consent")

flash(consent)

// snow(document.querySelector("header"), false, 200)

// if (consent) {
//     toggleMode(consent);
// }

if (consent) {
  const storedTheme = localStorage.getItem("theme")
  if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme)
  }

  const toggleButton = document.getElementById("toggleMode")

  toggleButton.addEventListener("click", (ev) => {
    ev.preventDefault()
    const theme = document.documentElement.getAttribute("data-theme")
    const newTheme = theme === "light" ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  })
}

window.addEventListener("DOMContentLoaded", () => {
  siteSearch()
})
