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
                    <div class="h-2/3">
                        <img src="${game.background_image}" alt="${game.name}" class="w-full">
                    </div>
                    <div class="platforms"></div>
                    <h2 class="font-bold text-xl text-white p-2">${game.name}</h2>
                    <div class="p-2 flex flex-wrap gap-2 genre">    
                    </div>
                </div> 
            `;
            const genresDiv = gameElement.querySelector('.genre');
            const platformsDiv = gameElement.querySelector('.platforms');
            game.genres.forEach((genre) => {
                genresDiv.innerHTML += `<span class="inline-block bg-white rounded-full px-4 mb-4 text-sm text-gray-700">#${genre.name}</span>`;
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