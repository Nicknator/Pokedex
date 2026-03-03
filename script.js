let allPokemon = [];
let pokeBtnIncrement = 10;
let lastRendered = 0;
let currentIndex = 0;

// Init Onload abrufen
async function init() {
    await fetchNewPokemon();
}

async function fetchNewPokemon() {
    pokeBtnIncrement += 10;
    let pokemonPromises = []; let speciesPromises = [];
    for (let i = lastRendered + 1; i <= pokeBtnIncrement; i++) {
        pokemonPromises.push(fetchPokemon(i));
        speciesPromises.push(fetchPokemonSpecies(i));
    } lastRendered = pokeBtnIncrement;
    let allPokemonData = await Promise.all(pokemonPromises);
    let allSpeciesData = await Promise.all(speciesPromises);
    for (let i = 0; i < allPokemonData.length; i++) {
        renderPokemon(allPokemonData[i], allSpeciesData[i]);
        allPokemon.push(allPokemonData[i]);
    }
}

async function loadMorePokemon(btn) {
    btn.disabled = true;
    document.getElementById("loadingSpinner").style.display = "flex";
    await fetchNewPokemon();
    await new Promise(r => setTimeout(r, 1500));
    document.getElementById("loadingSpinner").style.display = "none";
    btn.disabled = false;
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
    document.body.style.overflow = "hidden";
    const dialog = document.getElementById(`dialog-${id}`);
    dialog.showModal();
    showMain(id);
}

function closePokeDialog(id) {
    document.body.style.overflow = "auto";
    const dialog = document.getElementById(`dialog-${id}`);
    dialog.close();
}

function nextPokemon(id) {
    let index = allPokemon.findIndex(p => p.id === id);
    if (index < allPokemon.length - 1) {
        let nextId = allPokemon[index + 1].id;
        closePokeDialog(id);
        pokeDialog(nextId);
    }
}

function prevPokemon(id) {
    let index = allPokemon.findIndex(p => p.id === id);
    if (index > 0) {
        let prevId = allPokemon[index - 1].id;
        closePokeDialog(id);
        pokeDialog(prevId);
    }
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
    } let evoPokemon = [];
    for (let i = 0; i < evoNames.length; i++) {
        let pokeData = allPokemon.find(p => p.name === evoNames[i]);
        if (pokeData) evoPokemon.push(pokeData);
    } container.innerHTML = getEvoChainTemplate(evoPokemon);
}

async function fetchEvolutionChain(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function searchPokemon(query) {
    const content = document.getElementById("content"); 
    content.innerHTML = "";
    const filteredPokemon = allPokemon.filter(p => p.name.toLowerCase().includes(query) || p.id.toString() === query);
    if (filteredPokemon.length === 0) {
        content.innerHTML = "<p>No Pokémon found</p>";
        return;
    }
    filteredPokemon.forEach(pokemon => {
        fetchPokemonSpecies(pokemon.id).then(species => {
            renderPokemon(pokemon, species);
        });
    });
}


function handleSearch() {
    const query = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();
    if (query.length < 3) {
        alert("Please enter at least 3 characters");
        return;
    } searchPokemon(query);
}














