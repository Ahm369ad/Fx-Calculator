const base_url =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.getElementsByClassName("dropdowns");
const fromCurr = document.querySelector("#fromDrop");
const toCurr = document.querySelector("#toDrop");
const input = document.querySelector(".inputCont input");
const msg = document.querySelector("#resAmount");
const tglImg = document.querySelector(".tglCurr");

let country_list;

async function loadCountries() {
  try {
    const response = await fetch("country_names.json");
    const data = await response.json();
    // console.log(data);
    country_list = data;
  } catch (error) {
    console.error("Error in loading the text file:", error);
  }
}

async function addDrops() {
  await loadCountries();
  for (let select of dropdowns) {
    for (let currCode in country_list) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if(select.name === "from" && currCode === "USD"){
        newOption.selected = true;
      }else if(select.name === "to" && currCode === "PKR") {
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
  let currCode = element.value;
  let countryName = country_list[currCode];
  let newSrc = `https://flagsapi.com/${countryName}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if(img) {
    img.src = newSrc;
  }
};


const getData = async () => {
  console.log("Getting data.....");
  const fromCurrency = fromCurr.value.toLowerCase();
  const url = `${base_url}/${fromCurrency}.json`
  try {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    console.log(data[fromCurrency]);
    return data[fromCurrency];

  } catch(err) {
    console.log("getData = ", err);
  }

};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  exchangeAmount();
});

const exchangeAmount = async () => {

  const rates = await getData();
  console.log("rates", rates);  
  let inputAmount = await input.value;
  let toCurrency = toCurr.value.toLowerCase();
  console.log(toCurrency, rates[toCurrency]);

  let finalAmount = rates[toCurrency] * inputAmount;
  console.log("Final", finalAmount);
  
  msg.innerText = finalAmount;
}

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
