// Your RAWG API key
const apiKey = 'f2f05023867c43febff4928653fdd52f';

// Base URL for the RAWG API
const baseURL = 'https://api.rawg.io/api/';

let gameLibrary = [];
let bookmarkedGames = [];
let userRating = [];
let currentPage = 1;

// populate the select filters
async function fetchGenres() {
    const url = `${baseURL}genres?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        let genreSelect = document.getElementById('genre');
        data.results.forEach(genre => {
            let genreOption = document.createElement('option');
            genreOption.value = genre.slug;
            genreOption.innerText = genre.name;
            genreSelect.appendChild(genreOption);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchGenres();
async function fetchYears() {
    const url = `${baseURL}games?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
            data.filters.years.forEach(year => {
                const option = document.createElement('option');
                option.value = year.filter;
                option.textContent = `${year.from} - ${year.to}`
                document.getElementById('years').appendChild(option);
            });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchYears();
async function fetchplatforms() {
    const url = `${baseURL}platforms?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        let platformSelect = document.getElementById('platforms');
        data.results.forEach(platform => {
            let platformOption = document.createElement('option');
            platformOption.value = platform.id;
            platformOption.innerText = platform.name;
            platformSelect.appendChild(platformOption);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchplatforms();

document.getElementById('homeBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const main = document.querySelector('.main-content');
    main.innerHTML = '';
    currentPage = 1;
    fetchAllGames();
});
document.getElementById('default-search').addEventListener('focusout', function(e) {
    setTimeout(() => {
        document.getElementById('dropbox').innerHTML = '';
    }, 200);
});

async function fetchPageSelect(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        showGames(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fetch all games
async function fetchAllGames(page = currentPage) {
    try {
        const response = await fetch(`${baseURL}games?key=${apiKey}&page_size=40&page=${page}`);
        const data = await response.json();
        console.log(data);
        showGames(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Call the function
fetchAllGames();

// Display the games that are fetched
async function showGames(data) {
        const mainSection = document.querySelector('.main-content');
        document.querySelector('.paginate').classList.remove('hidden');
        mainSection.innerHTML = '';

        document.querySelector('.prevBtn').addEventListener('click', function(e) {
            if (data.previous != null) {
                const main = document.querySelector('.main-content');
                currentPage--;
                main.innerHTML = '';
                fetchPageSelect(data.previous);
            }
        });

        document.querySelector('.nextBtn').addEventListener('click', function(e) {
            if (data.next != null) {
                const main = document.querySelector('.main-content');
                currentPage--;
                main.innerHTML = '';
                fetchPageSelect(data.next);
            }
        });


        data.results.forEach((game) => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game-item'; 
            gameElement.innerHTML = `
                <div class="rounded-md overflow-hidden shadow-lg bg-gray-900 w-64 h-full cursor-pointer hover:ring-1 ring-white">
                    <div class="h-32 bg-cover bg-center flex justify-end p-2" style="background-image: url(${game.background_image})">
                        <div>
                            <button class="bg-red-500 hover:bg-red-700 drop-shadow-lg text-white px-1 py-1 rounded-full flex items-center mb-2" id="library">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="18" viewBox="0 -960 960 960" width="18"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                            </button>
                            <button class="bg-red-500 hover:bg-red-700 drop-shadow-lg text-white px-1 py-1 rounded-full flex items-center" id="bookmark">
                                    <svg stroke-width="3" fill="currentColor" height="18" viewBox="0 -960 960 960" width="18">
                                    <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
                                    </svg>
                            </button>
                        </div>
                    </div>
                    <div class="platforms"></div>
                    <h2 class="font-bold text-xl text-white px-2 pt-2">${game.name}</h2>
                    <p class="text-gray-300 text-[12px] px-2">Release Date: ${formatDate(game.released)}</p>
                    <div class="p-2 flex flex-wrap gap-1 genre">    
                    </div>
                </div> 
            `;

            gameElement.addEventListener('click', () => displayGamePage(game));
            libraryBtn = gameElement.querySelector('#library');
            bookmarkBtn = gameElement.querySelector('#bookmark');
            libraryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                gameLibrary.push(game);
                console.log(gameLibrary);
            });
            bookmarkBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                bookaredGames.push(game);
            
            });

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
}
// Format the release date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

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
                displayGamePage(game);
            })
        });
        dropbox.appendChild(resultDiv);
    });
}

async function displayGamePage(game) {
        const main = document.querySelector('.main-content');
        let details = await fetchGameDetails(game.id);
        let gameTrailerId = await fetchYouTubeTrailer(game.name);
        let gameTrailer = `https://www.youtube.com/embed/${gameTrailerId}?si=njS2mhwdffLo9fBI`
        document.querySelector('.paginate').classList.add('hidden');

        main.innerHTML = '';
        console.log(game.name);

        main.innerHTML = `
        <div class="h-[32rem] w-full bg-cover bg-top brightness-50" style="background-image: url(${game.background_image})">
        
        </div>
        <div class="flex items-center mt-2">
            <button class="bg-red-500 hover:bg-red-700 hover:ring-1 ring-white text-white px-3 py-1 rounded-full mr-2 flex items-center gap-1" id="library">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="18" viewBox="0 -960 960 960" width="18"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                Add to Library
            </button>
            <button class="bg-red-500 hover:bg-red-700 hover:ring-1 ring-white text-white px-3 py-1 rounded-full mr-4 flex items-center gap-1" id="bookmark">
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
            
            <div class="stores my-8">
             
            </div>
        </div>
        `;  

        const libraryBtn = document.getElementById('library');
        const bookmarkBtn = document.getElementById('bookmark');
        libraryBtn.addEventListener('click', function(e) {
            gameLibrary.push(game);
        });
        bookmarkBtn.addEventListener('click', function(e) {
            bookaredGames.push(game);
        });

        game.stores.forEach(location => {
            let storeDiv = document.querySelector('.stores');
            let storeElement = document.createElement('span');
            storeElement.innerHTML = `
            <a href="https://${location.store.domain}" target="_blank" class="w-1/2 mx-auto hover:ring-1 ring-white h-12 my-4 rounded-sm bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 flex items-center justify-between px-8 text-gray-100 font-bold">
                <h4>Buy ${game.name} from ${location.store.name}</h4>
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" viewBox="0 -960 960 960" width="24"><path d="M202.87-111.869q-37.783 0-64.392-26.609-26.609-26.609-26.609-64.392v-554.26q0-37.783 26.609-64.392 26.609-26.609 64.392-26.609H434.5q19.152 0 32.326 13.174T480-802.63q0 19.152-13.174 32.326T434.5-757.13H202.87v554.26h554.26V-434.5q0-19.152 13.174-32.326T802.63-480q19.153 0 32.327 13.174t13.174 32.326v231.63q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H202.87Zm554.26-581.848L427-363.587q-12.674 12.674-31.587 12.554-18.913-.119-31.587-12.793t-12.674-31.707q0-19.032 12.674-31.706L693.717-757.13H605.5q-19.152 0-32.326-13.174T560-802.63q0-19.153 13.174-32.327t32.326-13.174h242.631V-605.5q0 19.152-13.174 32.326T802.63-560q-19.152 0-32.326-13.174T757.13-605.5v-88.217Z"/></svg>
            </a>
            `;
            storeDiv.appendChild(storeElement);
        });

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
        //console.log(data);
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
        //console.log(gameDescription); // Output the description
        return gameDescription;
    } catch (error) {
        console.error('Error fetching game details:', error);
    }
}

let platforms = document.getElementById('platforms');
let genreFilter = document.getElementById('genre');
let yearFilter = document.getElementById('years');
platforms.addEventListener('change', function(e) {
    fetchGamesByFilter(e.target.value, 'platforms');
    e.target.value = '';
});
genreFilter.addEventListener('change', function(e) {
    fetchGamesByFilter(e.target.value, 'genres');
    e.target.value = '';
});
yearFilter.addEventListener('change', function(e) {
    fetchGamesByFilter(e.target.value, 'dates');
    e.target.value = '';
});

async function fetchGamesByFilter(value, filter) {
    const url = `https://api.rawg.io/api/games?key=${apiKey}&${filter}=${value}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        showGames(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//${baseURL}games?key=${apiKey}&page_size=40&page=${page}${filterParam}
