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
    let pokemonPromises = [];
    for (let i = lastRendered + 1; i <= pokeBtnIncrement; i++) {
        pokemonPromises.push(fetchPokemonData(i));
    }
    lastRendered = pokeBtnIncrement;
    const allPokemonData = await Promise.all(pokemonPromises);
    for (const p of allPokemonData) {
        renderPokemon(p.pokemon, p.species);
        allPokemon.push(p.pokemon);
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
async function fetchPokemonData(id) {
    const [pokemonRes, speciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    ]);
    const [pokemon, species] = await Promise.all([pokemonRes.json(), speciesRes.json()]);
    return { pokemon, species };
}

//Pokedex Daten anzeigen lassen
function renderPokemon(pokemon, species) {
    let content = document.getElementById("content");
    let bgColor = species.color.name;
    content.innerHTML += getPokeCardTemplate(pokemon, bgColor);
}



function togglePokeDialog(id) {
    const dialog = document.getElementById(`dialog-${id}`);
    const container = dialog.querySelector(".dialog-content");
    if (dialog.open) {
        document.body.style.overflow = "auto"; dialog.close();
    } else {
        dialog.showModal();
        document.body.style.overflow = "hidden"; showMain(id);
        dialog.onclick = (event) => {
            if (!container.contains(event.target)) { togglePokeDialog(id); }
        };
    }
}


function switchPokemon(id, direction) {
    let index = allPokemon.findIndex(p => p.id === id);
    if (direction === "nextId" && index < allPokemon.length - 1) {
        let nextId = allPokemon[index + 1].id;
        togglePokeDialog(id);
        togglePokeDialog(nextId);
    }

    if (direction === "prevId" && index > 0) {
        let prevId = allPokemon[index - 1].id;
        togglePokeDialog(id);
        togglePokeDialog(prevId);
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
    let data = await fetchPokemonData(id);
    let speciesData = data.species;
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
    const loadBtn = document.querySelector(".loadNewPokedex");
    document.getElementById("content").innerHTML = "";
    const filteredPokemon = allPokemon.filter(p => p.name.toLowerCase().includes(query) || p.id.toString() === query);
    if (filteredPokemon.length === 0) {
        content.innerHTML = "<p>No Pokémon found</p>";
        loadBtn.style.display = "none";
        return;
    }
    loadBtn.style.display = "none";
    filteredPokemon.forEach(pokemon => {
        fetchPokemonData(pokemon.id).then(data => { renderPokemon(data.pokemon, data.species); });
    });
}


async function handleSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const loadBtn = document.querySelector(".loadNewPokedex");
    const messageEl = document.getElementById("searchMessage"); messageEl.textContent = "";
    document.getElementById("content").innerHTML = "";
    if (query.length === 0 || query.length < 3) {
        if (query.length > 0) messageEl.textContent = "Please enter at least 3 characters"; loadBtn.style.display = "block";
        for (const p of allPokemon) { const data = await fetchPokemonData(p.id); renderPokemon(data.pokemon, data.species); }
        return;
    }
    loadBtn.style.display = "none";
    for (const p of allPokemon) {
        if (p.name.toLowerCase().includes(query) || p.id.toString() === query) {
            const data = await fetchPokemonData(p.id); renderPokemon(data.pokemon, data.species);
        }
    }
}


function setActive(clickedButton) {
    const buttons = clickedButton.parentElement.querySelectorAll(".setButton");
    buttons.forEach(btn => btn.classList.remove("active"));
    clickedButton.classList.add("active");
}














