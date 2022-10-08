const BASE_URL = 'https://api.coingecko.com/api/v3/coins';
let modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
document.addEventListener('DOMContentLoaded', async () => {
    let coins = await fetch(`${BASE_URL}`).then(res => res.json());
    for (const coin of coins) {
        createCoin(coin);
    }
});
async function createCoin(coin) {
    let div = document.createElement('div');
    div.classList.add('coin');
    let checkBox = createCheckbox(coin);
    let image = createImage(coin);
    let coinName = createCoinName(coin);
    let button = createBtn(coin);
    let moreInfo = document.createElement('div');
    moreInfo.classList.add('collapse', 'moreInfo');
    moreInfo.id = `${coin.id}-info`;
    div.append(checkBox, image, coinName, button, moreInfo);
    $('.coins').append(div);
}
async function createMoreInfoDiv(coin) {
    let moreInfo = $(`#${coin.id}-info`);
    let usd = document.createElement('p');
    let marketCap = document.createElement('p');
    let change = document.createElement('p');
    let ils = document.createElement('p');
    let eur = document.createElement('p');
    usd.innerHTML = `<strong>Price:</strong> ${coin.market_data.current_price.usd}`;
    marketCap.innerHTML = `<strong>Market Cap:</strong> ${coin.market_data.market_cap.usd}`;
    change.innerHTML = `<strong>Change%:</strong> ${(coin.market_data.price_change_24h).toFixed(3)}`;
    ils.innerHTML = `<strong>In Ils:</strong> ${coin.market_data.current_price.ils}`;
    eur.innerHTML = `<strong>In Eur:</strong> ${coin.market_data.current_price.eur}`;
    moreInfo.append(usd, marketCap, change, ils, eur);
    moreInfo.css('padding-top', '20px');
}
let cache = {};
function createBtn(coin) {
    let button = document.createElement('button');
    button.addEventListener('click', async () => {
        $(`#${coin.id}-info`).html('');
        if (cache[coin.id]) {
            let diff = (new Date()).getTime() - cache[coin.id].date;
            if (diff > 2 * 60 * 1000) {
                let fetching = await fetch(`${BASE_URL}/${coin.id}`).then(res => res.json());
                cache[coin.id] = {
                    date: (new Date()).getTime(),
                    coin: fetching,
                };
            }
        }
        else {
            let fetching = await fetch(`${BASE_URL}/${coin.id}`).then(res => res.json());
            cache[coin.id] = {
                date: (new Date()).getTime(),
                coin: fetching,
            };
        }
        createMoreInfoDiv(cache[coin.id].coin);
    });
    button.classList.add('btn');
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute(`data-bs-target`, `#${coin.id}-info`);
    button.type = 'button';
    button.innerText = "More info";
    return button;
}
function createCoinName(coin) {
    let coinName = document.createElement('p');
    coinName.innerText = coin.id;
    return coinName;
}
function createImage(coin) {
    let image = document.createElement('img');
    image.src = coin.image.thumb;
    return image;
}
span.addEventListener('click', function () {
    modal.style.display = "none";
});
let checkedArr = [];
function createCheckbox(coin) {
    let checkBox = document.createElement('input');
    checkBox.type = 'checkBox';
    checkBox.classList.add('checkBox');
    let label = document.createElement('label');
    label.classList.add('checkbox');
    let span = document.createElement('span');
    checkBox.checked = checkedArr.includes(coin.symbol);
    checkBox.addEventListener('change', async function (e) {
        if (this.checked) {
            if (checkedArr.length === 5) {
                this.checked = false;
                modal.style.display = "block";
            }
            else {
                checkedArr.push(coin.symbol);
            }
        }
        else {
            checkedArr = checkedArr.filter(c => c !== coin.symbol);
        }
        console.log(checkedArr);
    });
    label.append(checkBox, span);
    return label;
}
$('#searchBtn').on('click', async () => {
    let valueCoin = $('.searchCoin').val();
    let coins = await fetch(`https://api.coingecko.com/api/v3/coins/${valueCoin}`).then(res => res.json());
    if (valueCoin === "" || valueCoin !== coins.id) {
        $('.searchCoin').css('border', '3px solid red');
        return;
    }
    $('.searchCoin').css('border', 'none');
    let overlay = document.getElementById('overlay');
    overlay.style.display = "flex";
    let popup = document.getElementById('popup');
    popup.innerHTML = "";
    let button = document.createElement('button');
    button.setAttribute('class', 'closePopup');
    button.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
    button.innerText = 'X';
    popup.append(button);
    let div = document.createElement('div');
    div.setAttribute('class', 'searchedCoin');
    let image = document.createElement('img');
    image.src = coins.image.small;
    let name = document.createElement('p');
    name.innerText = `Name: ${coins.id}`;
    let price = document.createElement('p');
    price.innerText = `Price: ${(coins.market_data.current_price.usd).toString()}`;
    let marketCap = document.createElement('p');
    marketCap.innerText = `Market Cap: ${coins.market_data.market_cap.usd}`;
    let change = document.createElement('p');
    change.innerText = `Change%: ${(coins.market_data.price_change_24h).toFixed(3)}`;
    div.append(image, name, price, marketCap, change);
    popup.append(div);
    $('#searchCoin').val('');
});
function createDiv() {
    let div = $('#graphDiv');
    div.html('');
}
// reports div is duplicating if i clicked 2 times before i chose coins.
// spinner when fetching.
// orgenizing the functoins.
// styilyng the about me page.
