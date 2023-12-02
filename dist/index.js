// Your RAWG API key
const apiKey = 'f2f05023867c43febff4928653fdd52f';

// Base URL for the RAWG API
const baseURL = 'https://api.rawg.io/api/';

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
                <div class="rounded-md overflow-hidden shadow-lg bg-gray-900 w-64 h-full">
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
    console.log(game);
    main.innerHTML = `
        <div class="min-h-full w-full pr-6">
            <h1 class="text-[64px] font-bold text-white">${game.name}</h1>
            <div class="h-64 w-full bg-cover bg-center" style="background-image: url(${game.background_image})"></div>
        </div>
    `;  
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