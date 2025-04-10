const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

let page = 1;
let currentURL = API_URL + `&page=${page}`;
let loading = false;

async function getMovies(url) {
  loading = true;
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
  loading = false;
}

function createSlug(title, year) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace spaces and symbols with dashes
      .replace(/(^-|-$)+/g, "") + // Trim dashes at the start/end
    "-" +
    year
  );
}

function showMovies(movies) {
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, release_date } = movie;
    const year = release_date ? release_date.slice(0, 4) : "";
    const slug = createSlug(title, year);
    const flixUrl = `https://theflixertv.to/search/${encodeURIComponent(slug)}`;

    const movieEl = document.createElement("a");
    movieEl.classList.add("movie");
    movieEl.href = flixUrl;
    movieEl.target = "_blank";

    movieEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
    `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) return "green";
  if (vote >= 5) return "orange";
  return "red";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  main.innerHTML = "";
  page = 1;
  currentURL = SEARCH_API + searchTerm;
  if (searchTerm) getMovies(currentURL + `&page=${page}`);
});

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loading
  ) {
    page++;
    getMovies(currentURL + `&page=${page}`);
  }
});

getMovies(currentURL);
