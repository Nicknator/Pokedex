// Init Onload abrufen
async function init() {
    for (let i = 1; i <= 20; i++) {
        let pokemon = await fetchPokemon(i);
        renderPokemon(pokemon);
        console.log(pokemon);
    }


}


//Pokedex Daten abrufen, Herzstück des ganzen
async function fetchPokemon(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let data = await response.json();
    return data;
}



//Pokedex Daten anzeigen lassen

function renderPokemon(pokemon) {
    let content = document.getElementById("content");

    let image = pokemon.sprites.other['official-artwork'].front_default
        || pokemon.sprites.front_default;




    content.innerHTML += `
    <div class="pokemon-card">
        <h2>#${pokemon.id} ${pokemon.name.toUpperCase()}</h2>
        <img src="${image}" class="pokeImgSet">

        <div class="type-icons">
            <img src="https://veekun.com/dex/media/types/en/${pokemon.types[0].type.name}.png" class="type-icon">

            ${pokemon.types[1] ? `
                <img src="https://veekun.com/dex/media/types/en/${pokemon.types[1].type.name}.png" class="type-icon">
            ` : ''}
        </div>

    </div>
`;
}











