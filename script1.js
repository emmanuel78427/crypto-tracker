let dashboard = document.getElementById("dashboard");
let searchInput = document.getElementById("search");
let currencySelect = document.getElementById("currency")
let status = document.getElementById("status");


let allCoins = [];
let currentCurrency = "inr";

const symbols = {
  usd: "$" ,
  inr: "₹" ,
  eur: "€"
}

async function fetchCryptoData() {
    
   status.style.display = "block";
   status.textContent = "Loading cryptocurrencies....." ;

    dashboard.innerHTML = "";

    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch");
    }

    allCoins = await res.json();

    console.log(allCoins);

    status.style.display = "none";

    displayCoins(allCoins);


}


function displayCoins(coins) {
   
  dashboard.innerHTML = "";

  if (coins.length === 0) {
    status.style.display = "block";
    status.textContent = "No cryptocurrencies found.";
    return;
  }

  status.style.display = "none";

  coins.forEach((coin) => {

    const change = coin.price_change_percentage_24h;

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = ` 
      
    

      <div class="coin-top">

        <img src="${coin.image}" alt="${coin.name}" />

        <div>
          <div class="coin-name">${coin.name}</div>
          <div class="coin-symbol">${coin.symbol}</div>
        </div>

      </div>

      
      <div class="price">
        ${symbols[currentCurrency]}
        ${coin.current_price.toLocaleString()}
      </div>

      <div class="change ${change >= 0 ? "positive" : "negative"}">
        ${change.toFixed(2)}% in last 24h
      </div>

    `;

    dashboard.appendChild(card);

  });
 
}

currencySelect.addEventListener("change", (e) => {
    currentCurrency = e.target.value;
    fetchCryptoData();
})

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filteredCoins = allCoins.filter((coin) => 
    coin.name.toLowerCase().includes(value) ||
    coin.symbol.toLowerCase().includes(value)
  )
  displayCoins(filteredCoins);
})

fetchCryptoData();