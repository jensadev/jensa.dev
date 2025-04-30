const siteSearch = () => {
    const toggleSearch = () => {
        const searchModal = document.querySelector("#search-modal")
        searchModal.classList.toggle("hidden")
        const searchInput = document.querySelector("#search-input")
        searchInput.focus()
    }

    document
        .querySelector("#toggleSearch")
        .addEventListener("click", toggleSearch)

    window.addEventListener("keydown", (e) => {
        if (e.key === "k" && e.ctrlKey) {
            e.preventDefault()
            toggleSearch()
        }
    })

    const search = (e) => {
        const results = window.searchIndex.search(e.target.value, {
            bool: "OR",
            expand: true,
        })

        const resultElement = document.querySelector("#search-results")

        let i = 0

        resultElement.innerHTML = ""
        if (results && results.length > 0) {
            resultElement.classList.remove("hidden")
            results.map((result) => {
                if (i > 10) return
                const { id, title, summary } = result.doc
                const li = document.createElement("li")
                // li.classList.add("search-modal-results-item")
                resultElement.appendChild(li)

                const a = document.createElement("a")
                a.setAttribute("href", id)
                a.textContent = title
                li.appendChild(a)

                const p = document.createElement("p")
                p.textContent = summary || ""
                li.appendChild(p)

                i += 1
            })
        } else if (results && results.length < 1) {
            resultElement.classList.add("hidden")
        } else {
            resultElement.classList.remove("hidden")
            resultElement.innerHTML =
                '<li class="search-modal-results-item--disabled">Hittade inga sökresultat, försök igen</li>'
        }
    }

    fetch("/search-index.json").then((response) =>
        response.json().then((rawIndex) => {
            // eslint-disable-next-line no-undef
            window.searchIndex = elasticlunr.Index.load(rawIndex)
            document.querySelector("#search-input").addEventListener("input", search)
        })
    )
}

export { siteSearch }
