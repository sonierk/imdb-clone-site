// api keys and urls 
const apiKey = "69e30e44698b88a72cd3e9bbd31ddcad";
const apiBaseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";


const homeButton = document.querySelector("#home-button");
const searchBox = document.querySelector("#search-box");
const goToFavouriteButton = document.querySelector("#goto-favourites-button");
const movieCardContainer = document.querySelector("#movie-card-container");



// create movie cards using elemenats of currentMovieStack array
function renderList(actionForButton) {
  movieCardContainer.innerHTML = "";

  for (let i = 0; i < currentMovieStack.length; i++) {
    // creating div element for movie card and setting class and id to it
    let movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    // templete for movie card with image, title and rating of the render movie
    movieCard.innerHTML = `
		<img src="${imageBaseUrl + currentMovieStack[i].poster_path}" alt="${currentMovieStack[i].title}" class="movie-poster">
		<div class="movie-title-container">
			<span>${currentMovieStack[i].title}</span>
			<div class="rating-container">
			<i class="fa-regular fa-star"></i>
				<span>${currentMovieStack[i].vote_average}</span>
			</div>
		</div>

		<button id="${currentMovieStack[i].id}" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>
		<button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button" data-id="${
      currentMovieStack[i].id
    }" >
			<i class="fa-solid fa-bookmark"></i>
			<span>${actionForButton}</span>
		</button>
		`;
    movieCardContainer.append(movieCard); //appending card to the movie container view
  }
}

// initializing the movie list
let currentMovieStack = [];

// gets now playing movies from the api and renders as movie cards
function fetchMoviesPlayingNow() {
  const movies = fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      currentMovieStack = data.results;
      renderList("favourite");
    })
    .catch((err) => console.log(err));
}
fetchMoviesPlayingNow();

// when we clicked on home button this fetches trending movies and renders on web-page
homeButton.addEventListener("click", fetchMoviesPlayingNow);

// search box event listner check for any key press and search the movie according and show on web-page
searchBox.addEventListener("keyup", () => {
  let searchString = searchBox.value;

  if (searchString.length > 0) {
    let searchStringURI = encodeURI(searchString);
    const searchResult = fetch(
      `${apiBaseUrl}/search/movie?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${searchStringURI}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        currentMovieStack = data.results;
        renderList("favourite");
      })
      .catch((err) => printError(err));
  }
});

// function to add movie into favourite section
function favourite(element) {
  let id = element.dataset.id;
  for (let i = 0; i < currentMovieStack.length; i++) {
    if (currentMovieStack[i].id == id) {
      let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

      if (favouriteMovies == null) {
        favouriteMovies = [];
      }

      favouriteMovies.push(currentMovieStack[i]);
      localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));

      alert(currentMovieStack[i].title + " added to favourite");
      return;
    }
  }
}

// when Favourites movie button click it shows the favourite moves
goToFavouriteButton.addEventListener("click", () => {
  let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  if (favouriteMovies == null || favouriteMovies.length < 1) {
    alert("Favourite List Empty");
    return;
  }

  currentMovieStack = favouriteMovies;
  renderList("remove");
});

// remove movies from favourite section
function remove(element) {
  let id = element.dataset.id;
  let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  let newFavouriteMovies = [];
  for (let i = 0; i < favouriteMovies.length; i++) {
    if (favouriteMovies[i].id == id) {
      continue;
    }
    newFavouriteMovies.unshift(favouriteMovies[i]);
  }

  localStorage.setItem("favouriteMovies", JSON.stringify(newFavouriteMovies));
  currentMovieStack = newFavouriteMovies;
  renderList("remove");
}

// renders movie details on web-page
function renderMovieInDetail(movie) {
  console.log(movie);
  movieCardContainer.innerHTML = "";

  let movieDetailCard = document.createElement("div");
  movieDetailCard.classList.add("detail-movie-card");

  movieDetailCard.innerHTML = `
		<img src="${imageBaseUrl + movie.backdrop_path}" class="detail-movie-background">
		<div class="detail-movie-title">
			<span>${movie.title}</span>
			<div class="detail-movie-rating">
			<i class="fa-regular fa-star"></i>
			<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="detail-movie-plot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>	
			<p>production_countries : ${movie.production_countries[0].name}</p>	

				

		</div>
	`;

  movieCardContainer.append(movieDetailCard);
}

// fetch the defails of of move and send it to renderMovieDetails to display
function getMovieInDetail(element) {
  fetch(`${apiBaseUrl}/movie/${element.getAttribute("id")}?api_key=${apiKey}&language=en-US`)
    .then((response) => response.json())
    .then((data) => renderMovieInDetail(data))
    .catch((err) => console.log(err));
}

