// Your RAWG API key
const apiKey = 'f2f05023867c43febff4928653fdd52f';

// Base URL for the RAWG API
const baseURL = 'https://api.rawg.io/api/';

let gameLibrary = [];
let bookaredGames = [];
let userRating = [];

document.getElementById('default-search').addEventListener('focusout', function(e) {
    setTimeout(() => {
        document.getElementById('dropbox').innerHTML = '';
    }, 200);
});

// Function to fetch games
async function fetchGames() {
    try {
        const response = await fetch(`${baseURL}games?key=${apiKey}`);
        const data = await response.json();
        console.log(data);
        // Process the data as needed
        const mainSection = document.querySelector('.main-content');
        data.results.forEach((game) => {
            const gameElement = document.createElement('div');
            gameElement.innerHTML = `
                <div class="rounded-md overflow-hidden shadow-lg bg-gray-900 w-64 h-full" onClick="displaySearchResult(game)">
                    <div class="h-32 bg-cover bg-center" style="background-image: url(${game.background_image})">
                        <button class="bg-red-500 hover:bg-red-700 p-1 rounded-full float-right mr-2 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="18" viewBox="0 -960 960 960" width="18"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        </button>
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full float-right mr-2 mt-2">
                            <svg stroke-width="1.5" fill="currentColor" height="18" viewBox="0 -960 960 960" width="18">
                            <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="platforms"></div>
                    <h2 class="font-bold text-xl text-white px-2 pt-2">${game.name}</h2>
                    <p class="text-gray-300 text-[12px] px-2">Release Date: ${formatDate(game.released)}</p>
                    <div class="p-2 flex flex-wrap gap-1 genre">    
                    </div>
                </div> 
            `;
            const genresDiv = gameElement.querySelector('.genre');
            const platformsDiv = gameElement.querySelector('.platforms');
            game.genres.forEach((genre) => {
                genresDiv.innerHTML += `<span class="inline-block text-[12px] font-bold text-gray-100">#${genre.name}</span>`;
            });
            /* game.platforms.forEach((platform) => {
                platformsDiv.innerHTML += `<span class="inline-block bg-gray-200 rounded-full mb-4 text-sm font-semibold text-gray-700">#${platform.image_background}</span>`;
            }); */
            mainSection.appendChild(gameElement);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

// Call the function
fetchGames();

document.getElementById('default-search').addEventListener('input', function(e) {
    const searchTerm = e.target.value;
    const dropbox = document.getElementById('dropbox');

    searchTerm.length > 0 ? searchGames(searchTerm) : dropbox.innerHTML = '';
});

async function searchGames(query) {
    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        displayResults(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(games) {
    const dropbox = document.getElementById('dropbox');
    dropbox.innerHTML = ''; // Clear previous results
    games.forEach(game => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <div class="flex items-center gap-2 p-2 border-b border-gray-400 hover:bg-gray-100 cursor-pointer" id="${game.id}">
                <img src="${game.background_image}" class="w-10 h-10 rounded-md">
                <p class="text-sm font-bold">${game.name}</p>
            </div>
        `
        resultDiv.addEventListener('click', function(e) {
            games.filter(game => game.id === parseInt(e.target.id)).forEach(game => {
                displaySearchResult(game);
            })
        });
        dropbox.appendChild(resultDiv);
    });
}

function displaySearchResult(game) {
    const main = document.querySelector('.main-content');
    main.innerHTML = ''
    //console.log(game);
    main.innerHTML = `
    <div class="h-[32rem] w-full bg-cover bg-top brightness-50" style="background-image: url(${game.background_image})"></div>
    <div class="flex items-center mt-2">
      <button class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-full mr-2 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="18" viewBox="0 -960 960 960" width="18"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        Add to Library
      </button>
      <button class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-full mr-4 flex items-center gap-1">
          <svg stroke-width="3" fill="currentColor" height="18" viewBox="0 -960 960 960" width="18">
          <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
          </svg>
          Bookmark
      </button>
      <h2 class="text-white mr-4">Game Released: ${formatDate(game.released)}</h2>
      <div class="flex items-center">
        <p class="text-white mr-2">Genres:</p>
        <span class="text-[12px] font-bold text-gray-800 bg-white py-1 px-2 rounded-full">#Fun</span>
      </div>
    </div>
    <div class="w-3/4 mx-auto">
      <h1 class="text-[64px] font-bold text-white border-b-2 mb-4">${game.name}</h1>
      <iframe class="w-full h-full" src="${fetchGameTrailer(game.id)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      <h2 class="text-white text-xl font-bold mt-8 border-b-2 mb-2">ABOUT THIS GAME</h2>
      <p class="text-white mt-2">Dark Souls is an action RPG developed by FromSoftware and published internationally by Bandai Namco. In Japan, the game was published by FromSoftware itself. It was initially released for the consoles only, but later on, the enhanced edition of the game, Dark Souls: Prepare to Die Edition, was released for the PC. The point behind the game was to entertain the players with a hardcore, challenging experience that was not a cakewalk even for the most skilled players. The game features a world of dark fantasy setting, like the majority of other FromSoftware games. The plot follows a characterless protagonist, who is known as the Chosen Undead, who has to fight his way through the world that is on the brink of extinction. The protagonist ends up in the Undead Asylum, where he must get out and travel to the Lordran, the land of the ancient lords. To achieve this, he must get the souls of the lords and kindle the flame in the fire.</p>
      <div>
        <h3></h3>
      </div>
    </div>
    `;  
}

async function fetchGameTrailer(gameId) {
    const url = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gameDetails = await response.json();
        
        // Assuming the trailer URL is in a property named 'clip'
        const trailerUrl = gameDetails.clip?.clip || 'No trailer available';
        console.log(trailerUrl); // Use or display the trailer URL as needed
        return trailerUrl;
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
}

/* {slug: 'dark-souls', name: 'Dark Souls', playtime: 48, platforms: Array(3), stores: Array(2), …}
added
: 
3205
added_by_status
: 
{yet: 135, owned: 2047, beaten: 615, toplay: 100, dropped: 268, …}
background_image
: 
"https://media.rawg.io/media/games/582/582b5518a52f5086d15dde128264b94d.jpg"
clip
: 
null
dominant_color
: 
"0f0f0f"
esrb_rating
: 
{id: 4, name: 'Mature', slug: 'mature', name_en: 'Mature', name_ru: 'С 17 лет'}
genres
: 
(2) [{…}, {…}]
id
: 
5538
metacritic
: 
89
name
: 
"Dark Souls"
parent_platforms
: 
(3) [{…}, {…}, {…}]
platforms
: 
(3) [{…}, {…}, {…}]
playtime
: 
48
rating
: 
4.34
rating_top
: 
5
ratings
: 
(4) [{…}, {…}, {…}, {…}]
ratings_count
: 
889
released
: 
"2011-09-22"
reviews_count
: 
896
reviews_text_count
: 
6
saturated_color
: 
"0f0f0f"
score
: 
"66.58681"
short_screenshots
: 
(7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
slug
: 
"dark-souls"
stores
: 
(2) [{…}, {…}]
suggestions_count
: 
671
tags
: 
(5) [{…}, {…}, {…}, {…}, {…}]
tba
: 
false
updated
: 
"2023-11-29T19:20:57"
user_game
: 
null
[[Prototype]]
: 
Object */