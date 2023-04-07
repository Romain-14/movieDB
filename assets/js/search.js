import { API_KEY, BASE_IMG_URL, BASE_FETCH_URL } from "./const.js";


function searchHandler(e) {
    e.preventDefault();
    if(e.target.value){
        fetch(`${BASE_FETCH_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${e.target.value}&page=1&include_adult=false>`)
                .then(res=> res.json())
                .then(res=> displayMoviesList(res.results))
                .catch(err=>console.log(err))
    } else {
        // si on efface le contenu de l'input -> vider la liste 
        const ul = document.getElementById("list");
        ul.innerHTML = "";
    }
    
}

function displayMoviesList(movies){
    //afficher sous forme de liste les films retournés par le fetch
    const ul = document.getElementById("list");
    // vider la liste pour éviter la concaténation
    ul.innerHTML = "";
    movies.forEach(movie => {
        //creation des éléments HTML (une liste ul li + a)
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = "#";
        a.textContent = movie.original_title;
        // injection des éléments dans le DOM
        ul.append(li, a);
    
    });
    // placer des écouteurs sur les "a" nouvellement créés
    document.querySelectorAll("#list a").forEach(a=>{
        a.addEventListener("click", getDetail);
    });
}

function getDetail(e){
    e.preventDefault();
    
    // on va encoder notre uri pour "échapper" les caractères
    const uri = `${BASE_FETCH_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${e.target.textContent}&page=1&include_adult=false`;
    const encodedURI = encodeURI(uri);

    fetch(encodedURI)
        .then(res => res.json())
        .then(res => displaySearchDetail(res.results[0]))
        .catch(err => console.log(err))
}

function displaySearchDetail(detail){
    const articleDOM     = document.getElementById("detail");
    articleDOM.innerHTML = "";
    const newTitle       = document.createElement("h2");
    const newImg         = document.createElement("img");
    const newVoteCount   = document.createElement("p");
    const newVoteAvg     = document.createElement("p");
    const newReleaseDate = document.createElement("p");
    const newOverview    = document.createElement("p");

    // insertion de contenu dans chaque élément HTML
    newTitle.textContent = detail.original_title;
    newImg.src           = BASE_IMG_URL + detail.poster_path;
    newVoteCount.textContent = `vote count : ${detail.vote_count}`;
    newVoteAvg.textContent   = `vote average : ${detail.vote_average}`;
    newReleaseDate.textContent = new Date(detail.release_date).toLocaleDateString();
    newOverview.textContent    = detail.overview;
    
    // injection des éléments dans le DOM
    articleDOM.append(newTitle,
                      newImg,
                      newVoteCount,
                      newVoteAvg,
                      newReleaseDate,
                      newOverview);

    // afficher maintenant la liste des "companies" 
    // vérifier si elles "existent", prévenir le cas échéant l'utilisateur qu'il n 'y en a pas
    fetch(`${BASE_FETCH_URL}/movie/${detail.id}?api_key=${API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(res => getCompanies(articleDOM, res.production_companies))
        .catch(err => console.log(err))
}

function getCompanies(articleDOM, companies){
    
    if(!companies.length){
        const companyEl = document.createElement("p");
        companyEl.textContent = "No companies";
        articleDOM.append(companyEl);
    } else {        
        const ul = document.createElement("ul");
        for (const company of companies) {
            fetch(`${BASE_FETCH_URL}/company/${company.id}?api_key=${API_KEY}`)
                .then(res => res.json())
                .then(res => displayCompanies(articleDOM, ul, res))
                .catch(err => console.log(err))
        }
    }
}

function displayCompanies(articleDOM, ul, company){
    const li = document.createElement("li");
    let a = null;

    if(company.homepage) {
        a  = document.createElement("a");
        a.href   = company.homepage;
        a.target = "_blank";
        a.textContent = company.name;
        ul.append(li, a);
    } else {
        li.textContent = company.name + " " + "(no website)";
        ul.append(li);
    }               

    articleDOM.append(ul);    
}

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("search-input").addEventListener("input", searchHandler);
});