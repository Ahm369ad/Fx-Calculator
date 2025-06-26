const base_url =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.getElementsByClassName("dropdowns");
const fromCurr = document.querySelector("#fromDrop");
const toCurr = document.querySelector("#toDrop");
const input = document.querySelector(".inputCont input");
const msg = document.querySelector("#resAmount");
const tglImg = document.querySelector(".tglCurr");
const btn = document.querySelector("form #btn");

let country_list;

async function loadCountries() {
  try {
    const response = await fetch("country_info.json");
    const data = await response.json();
    console.log("Dataset loaded successfully")
    country_list = data;
  } catch (error) {
    console.error("Error in loading the text file:", error);
  }
}

async function addDrops() {
  await loadCountries();
  for (let select of dropdowns) {
    for (let currCode of country_list) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode["Currency Name"]; //Show country Name
      newOption.value = currCode["Currency Code"]; //For flag img
      newOption.dataset.flag = currCode["Country Code"]; //Currency code for Exchange rate
      if (select.name === "from" && currCode["Currency Code"] === "USD") {
        newOption.selected = true;
      } else if (select.name === "to" && currCode["Currency Code"] === "PKR") {
        newOption.selected = true;
      }
      select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }

  updateFlag(fromCurr);
  updateFlag(toCurr);
}

const updateFlag = (element) => {
  const selectedOption = element.options[element.selectedIndex];
  const countryCode = selectedOption.dataset.flag || "US"; // fallback to US
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  const img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

const getData = async () => {
  const fromCurrency = fromCurr.value.toLowerCase();
  const url = `${base_url}/${fromCurrency}.json`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    console.log(data[fromCurrency]);
    return data[fromCurrency];
  } catch (err) {
    console.log("getData = ", err);
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  exchangeAmount();
});

const exchangeAmount = async () => {
  console.log("Loading data...");
  const rates = await getData();
  console.log("rates", rates);
  let inputAmount = await input.value;
  let toCurrency = toCurr.value.toLowerCase();
  console.log(toCurrency, rates[toCurrency]);

  let finalAmount = rates[toCurrency] * inputAmount;
  console.log("Final", finalAmount);

  msg.innerText = finalAmount;
};

tglImg.addEventListener("click", () => {
  // console.log("img clicked");
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(toCurr);
  updateFlag(fromCurr);
  exchangeAmount();
});

window.addEventListener("load", async () => {
  await addDrops();
  exchangeAmount();
});
