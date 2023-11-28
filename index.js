// Your RAWG API key
const apiKey = 'f2f05023867c43febff4928653fdd52f';

// Base URL for the RAWG API
const baseURL = 'https://api.rawg.io/api/';

// Example function to fetch games
async function fetchGames() {
    try {
        const response = await fetch(`${baseURL}games?key=${apiKey}`);
        const data = await response.json();
        console.log(data);
        // Process the data as needed
        const mainSection = document.querySelector('.main-content');
        data.results.forEach((game) => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('rounded-md', 'overflow-hidden', 'shadow-lg', 'bg-gray-900');
            gameElement.innerHTML = `
                    <img width="400px" class="" src="${game.background_image}" alt="${game.name}">
                    <div class="px-6 py-4">
                        <h2 class="font-bold text-xl mb-2">${game.name}</h2>
                    </div>
                    <div class="px-6 pt-4 pb-2 genre">
                        
                    </div> 
            `;
            const genresDiv = gameElement.querySelector('.genre');
            game.genres.forEach((genre) => {
                genresDiv.innerHTML += `<span class="inline-block bg-gray-200 rounded-full py-1 text-sm font-semibold text-gray-700 mr-6 mb-2">#${genre.name}</span>`;
            });
            mainSection.appendChild(gameElement);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function
fetchGames();
