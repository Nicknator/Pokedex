let allPokemon = [];

// Init Onload abrufen
async function init() {
    let pokemonPromises = [];
    let speciesPromises = [];

    for (let i = 1; i <= 28; i++) {
        pokemonPromises.push(fetchPokemon(i));
        speciesPromises.push(fetchPokemonSpecies(i));
    }

    let allPokemonData = await Promise.all(pokemonPromises);
    let allSpeciesData = await Promise.all(speciesPromises);

    for (let i = 0; i < allPokemonData.length; i++) {
        renderPokemon(allPokemonData[i], allSpeciesData[i]);
        allPokemon.push(allPokemonData[i]);
    }

    console.log(allPokemonData, allSpeciesData);
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
    let bgColor = species.color.name;

    content.innerHTML += getPokeCardTemplate(pokemon, bgColor);
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




function showMain(id) {
    let pokemon = allPokemon.find(p => p.id === id);
    let container = document.getElementById(`dialog-body-${id}`);
    container.innerHTML = getShowMainTemplate(pokemon);
}

function showStats(id) {
    let pokemon = allPokemon.find(p => p.id === id);
    let container = document.getElementById(`dialog-body-${id}`);
    let stats = pokemon.stats; // Array von Stats
    let html = "";
    for (let i = 0; i < stats.length; i++) {
        let statName = stats[i].stat.name.replace("-", " ");
        let statValue = stats[i].base_stat;
        html += getShowStatsTemplate(statName, statValue);
    } container.innerHTML = html;
}








async function showEvoChain(id) {
    let container = document.getElementById(`dialog-body-${id}`);
    let speciesData = await fetchPokemonSpecies(id);
    let evoChainData = await fetchEvolutionChain(speciesData.evolution_chain.url);

    let evoNames = [];
    let evo = evoChainData.chain;
    while (evo) {
        evoNames.push(evo.species.name);
        evo = evo.evolves_to[0];
    }

    // Pokemon-Objekte für Template zusammenstellen
    let evoPokemon = [];
    for (let i = 0; i < evoNames.length; i++) {
        let pokeData = allPokemon.find(p => p.name === evoNames[i]);
        if (pokeData) evoPokemon.push(pokeData);
    }

    container.innerHTML = getEvoChainTemplate(evoPokemon);
}


async function fetchEvolutionChain(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}




function searchPokemon(query) {
    query = query.toLowerCase().trim();
    let filteredPokemon = [];


    for (let i = 0; i < allPokemon.length; i++) {
        let p = allPokemon[i];
        if (p.name.toLowerCase().includes(query) || p.id.toString() === query) {
            filteredPokemon.push(p);
        }
    }

    const content = document.getElementById("content");
    content.innerHTML = "";

    for (let i = 0; i < filteredPokemon.length; i++) {
        let pokemon = filteredPokemon[i];
        // Species abrufen, um Farbe zu setzen
        fetchPokemonSpecies(pokemon.id).then(species => {
            renderPokemon(pokemon, species);
        });
    }
}













