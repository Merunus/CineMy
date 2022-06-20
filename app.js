const BASE_URL = "https://api.themoviedb.org/3"
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=16d88adebf2cbd3eb12ae86a69e43fc4'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=16d88adebf2cbd3eb12ae86a69e43fc4&query="'
const API_KEY = "api_key=16d88adebf2cbd3eb12ae86a69e43fc4"

var currentData = []
const favoriteFilms = []

const homeLink = document.querySelector(".home-link-btn")
const favoriteLink = document.querySelector(".favorites-link-btn")
const hr = document.getElementById("hr")
const closeBtn = document.getElementById("closebtn")
const nextBtn = document.getElementById("next")
const prevBtn = document.getElementById("prev")
const currentPageContainer = document.getElementById("current")
var currentPage = 1
var totalPages = 1
const tagsEl = document.getElementById("tags")
const tagsTitle = document.getElementById("tags-title")
const paginationContainer = document.querySelector(".pagination")
const main = document.getElementById('main')
const sectionFavorite = document.getElementById("section")
const form = document.getElementById('form')
const search = document.getElementById('search')
const genres = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }];

// For modal
const modalContainer = document.getElementById("modal-container")
const modalCloseBtn = document.getElementById("modal-close-btn")



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
        // console.log(data);
        totalPages = data.total_pages
        currentData = [...data.results]
        console.log(currentData);
        document.querySelector("footer").classList.remove("invisible")
        document.querySelector(".pagination").classList.remove("invisible")
    } else {
        main.innerHTML = `<h1>No Results Found</h1>`
        document.querySelector("footer").classList.add("invisible")
        document.querySelector(".pagination").classList.add("invisible")
    }

}


// Show movies on page
const showMovies = (movies) => {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, genre_ids, release_date, id } = movie
        if(release_date) {
            var str = release_date.slice(0, 4)
        }
        const movieEl = document.createElement('div')
        movieEl.setAttribute("id", id)
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_PATH + poster_path : "https://cinemaone.net/images/movie_placeholder.png"}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
            <p class = "genres-film">${getGenresForInfo(genres, genre_ids).splice(0, 2)} | ${str} </p>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          
          ${overview}
          <br>
          <div class = "movie-buttons-container">
            <button name = "details" class = "trailer-btn" id = ${id}>More information</button>
          </div>
          </div>
        `
        main.appendChild(movieEl)

        // document.getElementById(id).addEventListener("click", function () {
        //     openNav(movie)
        // })
        // trailerBtn.addEventListener("click", ()=>{
        //     openNav(movie)
        // })
    })
}



/////////////// <> 
///////////////  Single Movie
/////////////// <>



const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const voteSpan = document.querySelector(".modal-details-item-span-vote");
const votesSpan = document.querySelector(".modal-details-item-span-votes");
const popularitySpan = document.querySelector(".modal-details-item-span-popularity");
const originalTitleSpan = document.querySelector(".modal-details-item-span-original-title");
const releaseDateSpan = document.querySelector(".modal-details-item-span-release-date");
const originalLanguageSpan = document.querySelector(".modal-details-item-span-original-language");
const overviewModal = document.getElementById("modal-about")
const genresModal = document.querySelector(".modal-genres-span-one")
const trailerModalBtn = document.querySelector(".modal-button-trailer")
const favoriteModalBtn = document.querySelector(".modal-button-favorite")

const getSingleMovie = async (movieId) => {
    // const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=16d88adebf2cbd3eb12ae86a69e43fc4`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data);
    const { title, id, original_language, overview, popularity, release_date, vote_average, vote_count, poster_path, original_title, } = data

    const genres_ids = []
    data.genres.forEach((item) => {
        genres_ids.push(item.id)
    })

    // Replacing innerText of elements with newSingleMovieData
    modalTitle.textContent = title
    if (poster_path) {
        modalImage.setAttribute("src", `${IMG_PATH + poster_path}`)
    } else {
        modalImage.setAttribute("src", "https://cinemaone.net/images/movie_placeholder.png")
    }
    voteSpan.textContent = vote_average;
    votesSpan.textContent = vote_count;
    popularitySpan.textContent = popularity;
    originalTitleSpan.textContent = original_title;
    releaseDateSpan.textContent = release_date;
    originalLanguageSpan.textContent = original_language;
    overviewModal.textContent = overview
    genresModal.textContent = getGenresForInfo(genres, genres_ids).join(" , ")
    // console.log(voteSpan.textContent);


    // trailerModalBtn.addEventListener("click", openNav(data))
    trailerModalBtn.addEventListener("click", () => openNav(data))
    
    // favoriteModalBtn.addEventListener("click", ()=>{
    //     favoriteFilms.push(data)
    //     console.log(favoriteFilms);
    // })

}





// Favorite section

// homeLink.addEventListener("click", ()=>{
//     showElements()
//     homeLink.classList.add("links-active-btn")
//     favoriteLink.classList.remove("links-active-btn")
// })
// favoriteLink.addEventListener("click", ()=>{
//     hideElements()
//     homeLink.classList.remove("links-active-btn")
//     favoriteLink.classList.add("links-active-btn")
// })

// const updateFavoriteSection = () => {

// }


// Modal with single movie

var isModalOpen = false

const openModal = (e) => {
    e.preventDefault();
    if (e.target.name === "details") {
        getSingleMovie(e.target.id)
        modalContainer.classList.add("modal-container-active")
        isModalOpen = true
        toTop.style.opacity = 0

    }

}
const closeModal = (e) => {
    modalContainer.classList.remove("modal-container-active")
    isModalOpen = true
    toTop.style.opacity = 1
    modalCloseBtn.addEventListener("click", closeModal)
    window.removeEventListener("keydown", closeModalHandler)
    // favoriteModalBtn.removeEventListener("click", ()=>{
    //     favoriteFilms.push(data)
    //     console.log(favoriteFilms)
    // })


}

const closeModalHandler = (e) => {
    if (e.code === 'Escape') {
        closeModal()
    }
}

document.addEventListener("click", (e) => {
    if (e.target.id === "modal-container") {
        closeModal()
    }
})

window.addEventListener("keydown", closeModalHandler)
main.addEventListener("click", openModal)
modalCloseBtn.addEventListener("click", closeModal)



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
    // if (genres.length > 2) {
    //     genres.length = 2
    // }

    return genres
    // .join(", ")

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





const hideElements = () => {
    main.classList.add("main-hidden")
    tagsEl.classList.add("main-hidden")
    tagsTitle.classList.add("main-hidden")
    paginationContainer.classList.add("main-hidden")
    sectionFavorite.classList.remove("main-hidden")
    hr.classList.add("main-hidden")
    
}
const showElements = () => {
    main.classList.remove("main-hidden")
    tagsEl.classList.remove("main-hidden")
    tagsTitle.classList.remove("main-hidden")
    paginationContainer.classList.remove("main-hidden")
    hr.classList.remove("main-hidden")
    sectionFavorite.classList.add("main-hidden")
}
