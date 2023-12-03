// Your RAWG API key
const apiKey = 'f2f05023867c43febff4928653fdd52f';

// Base URL for the RAWG API
const baseURL = 'https://api.rawg.io/api/';

let gameLibrary = [];
let bookaredGames = [];
let userRating = [];

document.getElementById('homeBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const main = document.querySelector('.main-content');
    main.innerHTML = '';
    fetchGames();
});

document.getElementById('default-search').addEventListener('focusout', function(e) {
    setTimeout(() => {
        document.getElementById('dropbox').innerHTML = '';
    }, 200);
});

async function fetchGames() {
    try {
        const response = await fetch(`${baseURL}games?key=${apiKey}&page_size=40`);
        const data = await response.json();
        console.log(data);
        const mainSection = document.querySelector('.main-content');

        data.results.forEach((game) => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game-item'; 
            gameElement.innerHTML = `
                <div class="rounded-md overflow-hidden shadow-lg bg-gray-900 w-64 h-full cursor-pointer hover:ring-1 ring-white">
                    <div class="h-32 bg-cover bg-center" style="background-image: url(${game.background_image})">
                        <!-- Buttons here -->
                    </div>
                    <div class="platforms"></div>
                    <h2 class="font-bold text-xl text-white px-2 pt-2">${game.name}</h2>
                    <p class="text-gray-300 text-[12px] px-2">Release Date: ${formatDate(game.released)}</p>
                    <div class="p-2 flex flex-wrap gap-1 genre">    
                    </div>
                </div> 
            `;

            gameElement.addEventListener('click', () => displaySearchResult(game));

            const genresDiv = gameElement.querySelector('.genre');
            const platformsDiv = gameElement.querySelector('.platforms');
            game.genres.forEach((genre) => {
                genresDiv.innerHTML += `<span class="inline-block text-[12px] font-bold text-gray-100">#${genre.name}</span>`;
            });

            /* 
            game.platforms.forEach((platform) => {
                platformsDiv.innerHTML += `<span class="inline-block bg-gray-200 rounded-full mb-4 text-sm font-semibold text-gray-700">#${platform.image_background}</span>`;
            }); 
            */

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

async function displaySearchResult(game) {
        const main = document.querySelector('.main-content');
        let details = await fetchGameDetails(game.id);
        let gameTrailerId = await fetchYouTubeTrailer(game.name);
        let gameTrailer = `https://www.youtube.com/embed/${gameTrailerId}?si=njS2mhwdffLo9fBI`

        main.innerHTML = '';
        console.log(game.name);

        main.innerHTML = `
        <div class="h-[32rem] w-full bg-cover bg-top brightness-50" style="background-image: url(${game.background_image})"></div>
        <div class="flex items-center mt-2">
            <button class="bg-red-500 hover:bg-red-700 hover:ring-1 ring-white text-white px-3 py-1 rounded-full mr-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="18" viewBox="0 -960 960 960" width="18"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                Add to Library
            </button>
            <button class="bg-red-500 hover:bg-red-700 hover:ring-1 ring-white text-white px-3 py-1 rounded-full mr-4 flex items-center gap-1">
                    <svg stroke-width="3" fill="currentColor" height="18" viewBox="0 -960 960 960" width="18">
                    <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
                    </svg>
                    Bookmark
            </button>
            <h2 class="text-white mr-4">Game Released: ${formatDate(game.released)}</h2>
            <div class="flex items-center genres">
                <p class="text-white mr-2">Genres:</p>
                
            </div>
        </div>
        <div class="w-3/4 mx-auto">
            <h1 class="text-[64px] font-bold text-white border-b-2 mb-4">${game.name}</h1>
            <iframe class="w-full h-full" src="${gameTrailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <h2 class="text-white text-xl font-bold mt-8 border-b-2 mb-2">ABOUT THIS GAME</h2>
            <div class="text-white mt-2">${details}</div>
            <div>
                <h3></h3>
            </div>
        </div>
        `;  

        game.genres.forEach(genre => {
            let genreDiv = document.querySelector('.genres');
            let genreElement = document.createElement('span');
            genreElement.innerHTML = `<span class="text-[12px] font-bold text-gray-800 bg-white py-1 px-2 mr-2 rounded-full">#${genre.name}</span>`;
            genreDiv.appendChild(genreElement);
    });
}


async function fetchYouTubeTrailer(gameName) {
    const videoKey = 'AIzaSyBDWW82oKtmEwwpK_jynuT7QfUT0p5R_Rk'; 
    const searchQuery = `${gameName} game trailer`;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${videoKey}&q=${searchQuery}&type=video&part=snippet&maxResults=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const firstResult = data.items[0];

        if (firstResult) {
            const videoId = firstResult.id.videoId;
            return videoId;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return null;
    }
}

async function fetchGameDetails(gameId) {
    const url = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gameDetails = await response.json();

        // Accessing the description
        const gameDescription = gameDetails.description;
        console.log(gameDescription); // Output the description
        return gameDescription;
    } catch (error) {
        console.error('Error fetching game details:', error);
    }
}

/* async function fetchStoreLinks(gameId) {
    const url = `https://api.rawg.io/api/games/${gameId}/stores?key=${apiKey}`;
    /games/{game_pk}/stores
} */