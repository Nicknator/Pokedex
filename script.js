let allPokemon = [];


// Init Onload abrufen
async function init() {
    for (let i = 1; i <= 28; i++) {
        let pokemon = await fetchPokemon(i);
        let species = await fetchPokemonSpecies(i);
        renderPokemon(pokemon, species);
        console.log(pokemon, species);
        allPokemon.push(pokemon);
    }
}



//Pokedex Daten abrufen, Herzstück des ganzen
async function fetchPokemon(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let data = await response.json();
    return data;
}

async function fetchPokemonSpecies(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    let data = await response.json();
    return data;
}



//Pokedex Daten anzeigen lassen

function renderPokemon(pokemon, species) {

    let content = document.getElementById("content");
    let image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    let bgColor = species.color.name;



    content.innerHTML += `
    <div class="pokemon-card" onclick="pokeDialog(${pokemon.id})">
        <h2>${pokemon.id} ${pokemon.name.toUpperCase()}</h2>
        <img src="${image}" class="pokeImgSet" style="background-color: ${bgColor}">

        <div class="type-icons">
            <img src="https://veekun.com/dex/media/types/en/${pokemon.types[0].type.name}.png" class="type-icon">

            ${pokemon.types[1] ? `
                <img src="https://veekun.com/dex/media/types/en/${pokemon.types[1].type.name}.png" class="type-icon">
            ` : ''}</div>

        

    </div>
    ${getPokeDialogTemplate(pokemon, bgColor)}
    
`;

}





function getPokeDialogTemplate(pokemon, bgColor) {

    let image = pokemon.sprites.other['official-artwork'].front_default;

    return `
    <dialog id="dialog-${pokemon.id}" class="poke-modal">
        <div class="dialog-content">
        <h2 class="dialogName">#${pokemon.id} ${pokemon.name.toUpperCase()}</h2>
        <div class="dialogField">
        <img src="${image}" class="dialog-img" style="background-color: ${bgColor}" >
        </div>

        <div class="type-icons">
            <img src="https://veekun.com/dex/media/types/en/${pokemon.types[0].type.name}.png" class="type-icon">

            ${pokemon.types[1] ? `
        <img src="https://veekun.com/dex/media/types/en/${pokemon.types[1].type.name}.png" class="type-icon">
            ` : ''}</div>
        
        <div class="dialog-buttons">
            <button onclick="showMain(${pokemon.id})">Main</button>
            <button onclick="showStats(${pokemon.id})">Stats</button>
            <button onclick="showEvoChain(${pokemon.id})">Evo Chain</button>
        </div>

        <div id="dialog-body-${pokemon.id}" class="dialog-body">
            
        </div>

        <button onclick="closePokeDialog(${pokemon.id})">
            Schließen
        </button>

       </div>
    </dialog>
    `;
}




function showMain(id) {
    let pokemon = allPokemon.find(p => p.id === id);

    let container = document.getElementById(`dialog-body-${id}`);

    container.innerHTML = `
        <p>Größe: ${pokemon.height / 10} m</p>
        <p>Gewicht: ${pokemon.weight / 10} kg</p>
        <p>Base experience: ${pokemon.base_experience}</p>
        <p>Ability: ${pokemon.abilities[0].ability.name}</p>
    `;
}

function showStats(id) {
    let pokemon = allPokemon.find(p => p.id === id);
    let container = document.getElementById(`dialog-body-${id}`);

    let stats = {};
    pokemon.stats.forEach(s => {
        stats[s.stat.name] = s.base_stat;
    });

    container.innerHTML = `
    ${Object.keys(stats).map(stat => `
        <div class="stat-row">
            <span class="stat-name">${stat.replace("-", " ")}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${stats[stat]}%"></div>
            </div>
            <span class="stat-value">${stats[stat]}</span>
        </div>
    `).join('')}
`;
}


async function fetchEvolutionChain(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}


async function showEvoChain(id) {
    let pokemon = allPokemon.find(p => p.id === id);
    let container = document.getElementById(`dialog-body-${id}`);

    
    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    let speciesData = await speciesResponse.json();

    let evoChainData = await fetchEvolutionChain(speciesData.evolution_chain.url);

  
    let evoNames = [];
    let evo = evoChainData.chain;

    
    while (evo) {
        evoNames.push(evo.species.name);
        evo = evo.evolves_to[0]; // nur erste Entwicklung nehmen
    }

    // Bilder der Evolutions-Pokémon abrufen
    let evoHtml = await Promise.all(evoNames.map(async name => {

        // Pokemon Daten abrufen, um das Bild zu bekommen
        let pokeResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        let pokeData = await pokeResp.json();
        return `<div class="evo-card">
                    <img src="${pokeData.sprites.other['official-artwork'].front_default}" class="evo-img">
                    <p>${name.toUpperCase()}</p>
                </div>`;
    }));

    container.innerHTML = `
        <h3>Evolution Chain</h3>
        <div class="evo-chain">${evoHtml.join('')}</div>
    `;
}














function pokeDialog(id) {
    const dialog = document.getElementById(`dialog-${id}`);
    dialog.showModal();
    showMain(id); 
}

function closePokeDialog(id) {
    const dialog = document.getElementById(`dialog-${id}`);
    dialog.close();

}






// Poke Anatomie aufrufen über Dialog

// Poke Anatomie anzeigen lassen










