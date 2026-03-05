// Template-Funktion für eine Pokémon-Karten
function getPokeCardTemplate(pokemon, bgColor) {
    let image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    return `
    <div class="pokemon-card" onclick="togglePokeDialog(${pokemon.id})">
        <h2 class="h2-Field">${pokemon.name.toUpperCase()}</h2>
        <img src="${image}" class="pokeImgSet" style="background-color: ${bgColor}">
        <div class="type-icons">
            <img src="https://veekun.com/dex/media/types/en/${pokemon.types[0].type.name}.png" class="type-icon">
            ${pokemon.types[1] ? `
                <img src="https://veekun.com/dex/media/types/en/${pokemon.types[1].type.name}.png" class="type-icon"> ` : ''}
        </div>
    </div>
    ${getPokeDialogTemplate(pokemon, bgColor)}   `;
}


function getPokeDialogTemplate(pokemon, bgColor) {
    let image = pokemon.sprites.other['official-artwork'].front_default;
    return `
    <dialog id="dialog-${pokemon.id}" class="poke-modal" onclick="if(event.target === this) closePokeDialog(${pokemon.id})">
        <div class="dialog-content">
            <h2 class="dialogName">${pokemon.name.toUpperCase()}</h2>
            <div class="dialogField">
                <img src="${image}" class="dialog-img" style="background-color: ${bgColor}">
            </div>
            
            <div class="nav-buttons">
                <button class="switchPokemon" onclick="switchPokemon(${pokemon.id}, 'prevId')">◀</button>
                <button class="switchPokemon" onclick="switchPokemon(${pokemon.id}, 'nextId')">▶</button>
            </div>

            <div class="type-icons">
                <img src="https://veekun.com/dex/media/types/en/${pokemon.types[0].type.name}.png" class="type-icon">
                ${pokemon.types[1] ? `<img src="https://veekun.com/dex/media/types/en/${pokemon.types[1].type.name}.png" class="type-icon">` : ''}
            </div>
            
            <div class="dialog-buttons">
                <button class="setButton"
                onclick="setActive(this); showMain(${pokemon.id})">Main</button>

                <button class="setButton"
                onclick="setActive(this); showStats(${pokemon.id})">Stats</button>

                <button class="setButton"
                onclick="setActive(this); showEvoChain(${pokemon.id})">Evo Chain</button>
            </div>
            <div id="dialog-body-${pokemon.id}" class="dialog-body"></div>
            <button onclick="togglePokeDialog(${pokemon.id})" class="closeBtn">X</button>
        </div>
    </dialog>
    `;
}


function getShowMainTemplate(pokemon) {
    return `
    <div class="main-row">
        <span class="main-label">Height:</span>
        <span class="main-value">${pokemon.height / 10} m</span>
    </div>
    <div class="main-row">
        <span class="main-label">Weight:</span>
        <span class="main-value">${pokemon.weight / 10} kg</span>
    </div>
    <div class="main-row">
        <span class="main-label">Base Experience:</span>
        <span class="main-value">${pokemon.base_experience}</span>
    </div>
    <div class="main-row">
        <span class="main-label">Ability:</span>
        <span class="main-value">${pokemon.abilities[0].ability.name.toUpperCase()}</span>
    </div>`;
}


function getShowStatsTemplate(statName, statValue) {
    return `
        <div class="stat-row">
            <span class="stat-name">${statName}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${statValue}%"></div>
            </div>
            <span class="stat-value">${statValue}</span>
        </div>`;
}


function getEvoChainTemplate(evoPokemon) {
    let evoHtml = "";
    for (let i = 0; i < evoPokemon.length; i++) {
        const pokeData = evoPokemon[i];
        if (!pokeData) continue;
        evoHtml += `
        <div class="evo-card">
            <img src="${pokeData.sprites.other['official-artwork'].front_default}" class="evo-img">
            <p class="pokeName">${pokeData.name.toUpperCase()}</p>
        </div>`;
    } return `
        <h3 class="evoName">Evolution Chain</h3>
        <div class="evo-chain">${evoHtml}</div> `;
}