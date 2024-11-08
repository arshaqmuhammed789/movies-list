const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';

let page = 1;
let pageDiv = document.querySelector(".page");
let isLoading = false; 
const searchInput = document.querySelector(".searchInput");
const row = document.querySelector(".row");  


function loadNewData(page, query) {
    setTimeout(() => {
        console.log("Data loaded!");
        getMovies(page, query);
    }, 1000);
}

function checkScrollPosition() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition + windowHeight >= documentHeight - 75 && !isLoading) {
        isLoading = true;
        page++;
        loadNewData(page);
    }
}

function getMovies(page, query = '') {
    let url = query ? `${SEARCH_API}${query}&page=${page}` : `${API_URL}page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {            
            if (page === 1) {
                row.innerHTML = '';
            }

            data.results.forEach(post => {
                const postElement = document.createElement("div");
                const postImage = document.createElement("img");
                const titleDiv = document.createElement("div");
                const title = document.createElement("p");
                const rating = document.createElement("p"); 
                const overviewDiv = document.createElement("div"); 
                const overviewTitle = document.createElement("h4");
                const overview = document.createElement("p");

                postElement.classList.add("col-md-3", "p-0", "m-3", "movie-tile", "rounded");
                postImage.setAttribute("src", IMG_PATH + post.poster_path);
                titleDiv.classList.add("movie-title-div");
                title.classList.add("movie-title");
                rating.classList.add("rating");
                overviewDiv.classList.add("overview", "p-3");

                title.textContent = post.title;
                rating.textContent = post.vote_average.toFixed(1);
                overviewTitle.textContent = "Overview";
                overview.textContent = post.overview;

                overviewDiv.appendChild(overviewTitle);
                overviewDiv.appendChild(overview);
                postElement.appendChild(overviewDiv);
                postElement.appendChild(postImage);
                titleDiv.appendChild(title);
                titleDiv.appendChild(rating);
                postElement.appendChild(titleDiv);
                row.appendChild(postElement);                
            });
            isLoading = false;
        })
        .catch(error => {
            console.log('Error:', error);
            isLoading = false;
        });
};

searchInput.addEventListener('keydown', (e) => {
    const query = e.target.value.trim();

        if (query) {
            page = 1;              
            loadNewData(page, query);
        } else {
            page = 1;
            loadNewData(page);
        }  
});
window.addEventListener('scroll', checkScrollPosition);

window.onload = function() {
    getMovies(page);  
};