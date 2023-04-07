import { API_KEY, BASE_FETCH_URL, BASE_IMG_URL } from "./const.js";

const trendingMoviesCard = {
    poster_path : {tag : "img", prop: "src" },
    title : {tag :"h3", prop: "textContent"},
    vote_count : {tag :"p", prop: "textContent", text: "Vote count :"},
    vote_average : {tag :"p", prop: "textContent", text: "Vote avg :"},
    release_date : {tag :"p", prop: "textContent", text: "Release :"},
    overview : {tag :"p", prop: "textContent"},
};


function fetchDatas() {
    fetch(`${BASE_FETCH_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(res => injectTrendingMovies(res.results))
        .catch(err => console.log(err));
}

function injectTrendingMovies(movies) {
    const section = document.getElementById("trending-container");

    for (const movie of movies) {
        const newArticle = document.createElement("article");
        const article = section.appendChild(newArticle);

        for (const prop in trendingMoviesCard) {
            article
                .appendChild(document
                    .createElement(trendingMoviesCard[prop].tag))
                    // [trendingMoviesCard[prop].prop] --> correspond à src ou textContent
                        [trendingMoviesCard[prop].prop] = display(prop, movie); 
                            // version avec ternaire
                            //  trendingMoviesCard[prop].tag === "img" ? // ternaire -> condition ? true : condition ? true : condition ? true : false
                            //     BASE_IMG_URL + movie[prop] // poster_path
                            //     :
                            //     prop === "release_date" ?
                            //     trendingMoviesCard[prop].text + new Date(movie[prop]).toLocaleDateString() // release_date
                            //     :
                            //     trendingMoviesCard[prop].text ?
                            //     trendingMoviesCard[prop].text + movie[prop] // vote_count || vote_average
                            //     :
                            //     movie[prop] // title || overview
        }
    }
}

function display(prop, movie){
    if(trendingMoviesCard[prop].tag === "img")
        return BASE_IMG_URL + movie[prop];
    if(prop === "release_date")
        return trendingMoviesCard[prop].text + new Date(movie[prop]).toLocaleDateString();
    if(trendingMoviesCard[prop].text)
        return trendingMoviesCard[prop].text + movie[prop];        
    else return movie[prop];
}

// VERSION SIMPLE 
// function injectTrendingMovies(movies) {
//     const section = document.getElementById("trending-container");

//     for (const movie of movies) {
//         const newArticle     = document.createElement("article");
//         const newImg         = document.createElement("img");
//         const newTitle       = document.createElement("h3");
//         const newVoteCount   = document.createElement("p");
//         const newVoteAvg     = document.createElement("p");
//         const newReleaseDate = document.createElement("p");
//         const newOverview    = document.createElement("p");

//         newImg.src                 = BASE_IMG_URL + movie.poster_path;
//         newTitle.textContent       = movie.original_title;
//         newVoteCount.textContent   = "Vote count :" + movie.vote_count;
//         newVoteAvg.textContent     = "Vote avg :" + movie.vote_average;
//         newReleaseDate.textContent = "Release :" + new Date(movie.release_date).toLocaleDateString();
//         newOverview.textContent    = movie.overview;

//         section
//             .appendChild(newArticle)
//                 .append(newImg,
//                         newTitle,
//                         newVoteCount,
//                         newVoteAvg,
//                         newReleaseDate,
//                         newOverview
//                     );
//     }
// }

document.addEventListener("DOMContentLoaded", function () {
    fetchDatas();
});
