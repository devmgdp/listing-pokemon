const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 10;
let offset = 0;

function loadPokemonItems(offset, limit, pokemonsPromise) {
  Promise.resolve(pokemonsPromise).then((pokemons = []) => {
    const newHtml = pokemons
      .map(
        (pokemon) => `
        <li class="pokemon ${pokemon.type}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
        
          <div class="detail">
              <ol class="types">
                  ${pokemon.types
                    .map((type) => `<li class="type ${type}">${type}</li>`)
                    .join("")}
              </ol>
        
              <img src="${pokemon.photo}"
                  alt="${pokemon.name}">
          </div>
        </li>
      `
      )
      .join("");

    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItems(offset, limit, pokeApi.getPokemons(offset, limit));

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit, pokeApi.getPokemons(offset, newLimit));

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit, pokeApi.getPokemons(offset, limit));
  }
});

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.toLowerCase();

  pokemonList.innerHTML = "";
  offset = 0;

  if (searchTerm.trim() !== "") {
    pokeApi.searchPokemon(searchTerm).then((pokemons) => {
      loadPokemonItems(0, limit, pokemons);
    });
  } else {
    // Se a barra de pesquisa estiver vazia, carregue os Pokémons normais
    loadPokemonItems(offset, limit, pokeApi.getPokemons(offset, limit));
  }
});