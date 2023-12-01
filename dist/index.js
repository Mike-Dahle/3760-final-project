// Your RAWG API key
const apiKey = 'f2f05023867c43febff4928653fdd52f';

// Base URL for the RAWG API
const baseURL = 'https://api.rawg.io/api/';

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

    if (searchTerm.length > 2) { // Trigger search for queries longer than 2 characters
        searchGames(searchTerm);
    }
});

async function searchGames(query) {
    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayResults(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(games) {
    const dropbox = document.getElementById('dropbox');
    dropbox.innerHTML = ''; // Clear previous results

    games.forEach(game => {
        const p = document.createElement('p');
        p.className = 'border-b border-gray-400 hover:bg-gray-100 cursor-pointer w-full p-2';
        p.textContent = game.name; // Adjust as needed to display the desired game info
        dropbox.appendChild(p);
    });
}