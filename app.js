
const BASE_URL = "https://api.themoviedb.org/3"
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=16d88adebf2cbd3eb12ae86a69e43fc4'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=16d88adebf2cbd3eb12ae86a69e43fc4&query="'
const API_KEY = "api_key=16d88adebf2cbd3eb12ae86a69e43fc4"

const closeBtn = document.getElementById("closebtn")
const nextBtn = document.getElementById("next")
const prevBtn = document.getElementById("prev")
const currentPageContainer = document.getElementById("current")
var currentPage = 1
var totalPages = 1
const tagsEl = document.getElementById("tags")
const tagsTitle = document.getElementById("tags-title")
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const genres = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }];


//Function for genres 
var selectedGenre = []
getGenres()
function getGenres() {
    tagsEl.innerHTML = '';
    genres.forEach(function (genre) {
        const tag = document.createElement("div");
        tag.classList.add("tag");
        tag.id = genre.id
        tag.innerHTML = genre.name
        tag.addEventListener("click", function () {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id)
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach(function (id, idx) {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1 /* 1 - айди, 2 - только 1 елемент*/)
                        }
                    })
                } else {
                    selectedGenre.push(genre.id)
                }
            }
            getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(',')))
            clickedGenre();
        })
        tagsEl.append(tag)
    })
}

// Picked genres array
const clickedGenre = () => {
    const tags = document.querySelectorAll(".tag")
    tags.forEach(function (tag) {
        tag.classList.remove("selected")
    })
    clearBtn()
    deleteClearBtn()
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id)
            highlightedTag.classList.add("selected")

        })
    }


}

// Clear buttoon delete
const deleteClearBtn = () => {
    if (selectedGenre.length == 0) {
        clear.classList.remove("tag", "clearBtn", "fa-solid", "fa-xmark")
    }
    else {
        clear.classList.add("tag", "clearBtn", "fa-solid", "fa-xmark")

    }
}
// Clear button
const clearBtn = () => {
    let clearBtn = document.getElementById("clear")

    if (clearBtn) {
        clearBtn.classList.add("clearBtn")

    } else {
        let clear = document.createElement("div")
        clear.classList.add("tag", "clearBtn", "fa-solid", "fa-xmark")
        clear.id = "clear"
        clear.innerText = ""
        clear.addEventListener("click", function () {
            selectedGenre = [];
            clickedGenre()
            getMovies(API_URL)
        })
        tagsEl.append(clear)

    }

}




// Get initial movies
getMovies(API_URL, currentPage)
async function getMovies(url, page) {
    // lastUrl = url;
    const res = await fetch(url + `&page=${page}`)
    const data = await res.json()
    if (data.results.length !== 0) {
        showMovies(data.results)
        console.log(data);
        totalPages = data.total_pages
        // currentPage = data.page;
        // nextPage = currentPage + 1;
        // prevPage = currentPage - 1;
        // totalPages = data.total_pages;

        document.querySelector("footer").classList.remove("invisible")
        document.querySelector(".pagination").classList.remove("invisible")
    } else {
        main.innerHTML = `<h1>No Results Found</h1>`
        document.querySelector("footer").classList.add("invisible")
        document.querySelector(".pagination").classList.add("invisible")
    }

    console.log(data)



}



// Show movies on page
const showMovies = (movies) => {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, genre_ids, release_date, id } = movie
        let str = release_date.slice(0, 4)
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_PATH + poster_path : "https://cinemaone.net/images/movie_placeholder.png"}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
            <p class = "genres-film">${getGenresForInfo(genres, genre_ids)} | ${str} </p>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          
          ${overview}
          <br>
          <button class = "trailer-btn" id = ${id}>Watch Trailers</button>
        </div>
        `
        main.appendChild(movieEl)



        document.getElementById(id).addEventListener("click", function () {
            openNav(movie)
        })
    })
}

// Get genres in film info

const getGenresForInfo = (genresAll, genresId) => {
    const genres = [];
    // console.log(genresAll);
    // console.log(genresId);
    for (let i = 0; i < genresId.length; i++) {
        for (let j = 0; j < genresAll.length; j++) {
            if (genresAll[j]["id"] === genresId[i]) {
                genres.push(genresAll[j].name);
                break
            }
        }
    }
    if (genres.length > 2) {
        genres.length = 2
    }

    return genres.join(", ")
}

// Get the id of genres 
const getGenre = (id) => {
    if (id == genres.id) {
        return genres.name
    }
}

const getClassByRate = (vote) => {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    selectedGenre = []
    clickedGenre()
    const searchTerm = search.value

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)
        // search.value = ''
        currentPage = 1;
        currentPageContainer.textContent = currentPage
        tagsEl.style.display = "none"
        tagsTitle.style.display = "none"
    } else {
        window.location.reload()
    }
})

// To top button 

const toTop = document.querySelector(".to-top")
window.addEventListener("scroll", function () {
    if (window.pageYOffset > 100) {
        toTop.classList.add("active")
    } else {
        toTop.classList.remove("active")
    }
})


const overlayContent = document.getElementById("overlay-content")
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id = movie.id
    fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if (videoData) {
            document.getElementById("myNav").style.width = "100%";
            if (videoData.results.length > 0) {
                var embed = [];
                var dotsUnderVideos = []
                videoData.results.forEach((video, idx) => {
                    let { name, key, site } = video
                    embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

                     `)
                    dotsUnderVideos.push(`
                     <span class = "dot">${idx + 1}</span>
                     `)
                    if (dotsUnderVideos.length > 5) {
                        dotsUnderVideos.length = 5
                    }


                    if (embed.length > 4) {
                        embed.length = 5
                    }

                })
                var content = `
               <h1 style = "color: white; opacity: 0.7; letter-spacing: 2px;text-transform: uppercase;">${movie.original_title}</h1>
               <br>
                ${embed.join("")}
                <br>
                <div class = "dots" >${dotsUnderVideos.join("")}</div>
               `
                overlayContent.innerHTML = content
                activeSlide = 0;
                showVideos();

            } else {
                overlayContent.innerHTML = `<h1 style = "color: #fff;">No Results Found</h1>`
            }

        }
    })
}

// Show videos
var activeSlide = 0;
var totalVideos = 0;
function showVideos() {
    let embedClasses = document.querySelectorAll(".embed");
    let dots = document.querySelectorAll(".dot");

    totalVideos = embedClasses.length
    embedClasses.forEach((emberTag, idx) => {
        if (activeSlide == idx) {
            emberTag.classList.add("show")
            emberTag.classList.remove("hide")
        } else {
            emberTag.classList.add("hide")
            emberTag.classList.remove("show")
        }
    });
    dots.forEach((dot, idx) => {
        if (activeSlide == idx) {
            dot.classList.add("active")
        }
        else {
            dot.classList.remove("active")
        }
    })
}

const leftArrow = document.getElementById("left-arrow")
const rightArrow = document.getElementById("right-arrow")

leftArrow.addEventListener("click", () => {
    if (activeSlide > 0) {
        activeSlide--
    } else {
        activeSlide = totalVideos - 1
    }
    showVideos()
})
rightArrow.addEventListener("click", () => {
    if (activeSlide < (totalVideos - 1)) {
        activeSlide++
    } else {
        activeSlide = 0;
    }
    showVideos()
})

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    const iframes = document.getElementsByTagName('iframe');
    if (iframes !== null) {
        for (let i = 0; i < iframes.length; i++) {
            iframes[i].src = iframes[i].src; //causes a reload so it stops playing, music, video, etc.
        }
    }
}
closeBtn.addEventListener("click", closeNav)


// Pagination 
const togglePrevPage = () => {
    if (currentPage === 1) {
        prevBtn.setAttribute("disabled", "")
    }
    else {
        currentPage = currentPage - 1
        getMovies(API_URL, currentPage)
        currentPageContainer.textContent = `${currentPage}`
    }


}
const toggleNextPage = () => {
    if (search.value) {
        getMovies((SEARCH_API + search.value), currentPage + 1)
        currentPage = currentPage + 1

    } else {
        getMovies(API_URL, currentPage + 1)
        currentPage = currentPage + 1
    }
    prevBtn.removeAttribute("disabled")
    currentPageContainer.textContent = `${currentPage}`
}
prevBtn.addEventListener("click", togglePrevPage)
nextBtn.addEventListener("click", toggleNextPage)
