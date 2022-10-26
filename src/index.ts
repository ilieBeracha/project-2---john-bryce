const BASE_URL = 'https://api.coingecko.com/api/v3/coins'
let modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

document.addEventListener('DOMContentLoaded', async () => {
    let coins: Coin[] = await fetch(`${BASE_URL}`).then(res => res.json());
    for (const coin of coins) {
        createCoin(coin);
    }
})

async function createCoin(coin: Coin) {
    let div = document.createElement('div');
    div.classList.add('coin')
    div.setAttribute('id', coin.symbol)
    let checkBox = createCheckbox(coin)
    let image = createImage(coin)
    let coinName = createCoinName(coin)
    let button = createBtn(coin);
    let moreInfo = document.createElement('div');
    moreInfo.classList.add('collapse', 'moreInfo');
    moreInfo.id = `${coin.id}-info`
    div.append(checkBox, image, coinName, button, moreInfo)
    $('.coins').append(div)
}

async function createMoreInfoDiv(coin: Coin,) {
    let moreInfo = $(`#${coin.id}-info`);
    let usd = document.createElement('p')
    let marketCap = document.createElement('p')
    let change = document.createElement('p')
    let ils = document.createElement('p')
    let eur = document.createElement('p')
    usd.innerHTML = `<strong>Price:</strong> ${coin.market_data.current_price.usd}`
    marketCap.innerHTML = `<strong>Market Cap:</strong> ${coin.market_data.market_cap.usd}`
    change.innerHTML = `<strong>Change%:</strong> ${(coin.market_data.price_change_24h).toFixed(3)}`
    ils.innerHTML = `<strong>In Ils:</strong> ${coin.market_data.current_price.ils}`
    eur.innerHTML = `<strong>In Eur:</strong> ${coin.market_data.current_price.eur}`
    moreInfo.append(usd, marketCap, change, ils, eur)
    moreInfo.css('padding-top', '20px')
}

let cache = {}

function createBtn(coin: Coin) {
    let button = document.createElement('button');
    button.addEventListener('click', async () => {
        await cacheEventListener(button, coin);
    })
    button.classList.add('btn');
    button.setAttribute('data-bs-toggle', 'collapse')
    button.setAttribute(`data-bs-target`, `#${coin.id}-info`)
    button.type = 'button'
    button.innerText = "More info"
    return button
}

async function cacheEventListener(button, coin) {
    let spinner = document.createElement('div');
    spinner.classList.add('lds-dual-ring')
    button.append(spinner)
    $(`#${coin.id}-info`).html('');
    if (cache[coin.id]) {
        let diff = (new Date()).getTime() - cache[coin.id].date
        if (diff > 2 * 60 * 1000) {
            let fetching: Coin = await fetch(`${BASE_URL}/${coin.id}`).then(res => res.json());
            cache[coin.id] = {
                date: (new Date()).getTime(),
                coin: fetching,
            }
        }
    } else {
        let fetching: Coin = await fetch(`${BASE_URL}/${coin.id}`).then(res => res.json());
        cache[coin.id] = {
            date: (new Date()).getTime(),
            coin: fetching,
        }
    }
    createMoreInfoDiv(cache[coin.id].coin)
    spinner.remove()
}

function createCoinName(coin: Coin) {
    let coinName = document.createElement('p');
    coinName.innerText = coin.id;
    return coinName
}

function createImage(coin: Coin) {
    let image = document.createElement('img');
    image.src = coin.image.thumb;
    return image
}

span.addEventListener('click', function () {
    modal.style.display = "none";
})

let checkedArr = [];
let changesArr = [];
let chartArr = [];
function createCheckbox(coin: Coin) {
    let checkBox = document.createElement('input');
    checkBox.setAttribute('id', coin.symbol)
    checkBox.type = 'checkBox';
    checkBox.classList.add('checkBox', 'checkBoxAll');
    let label = document.createElement('label')
    label.classList.add('checkbox')
    let span = document.createElement('span');
    checkBox.checked = checkedArr.includes((coin))
    checkBox.addEventListener('change', async function () {
        if (this.checked) {
            if (checkedArr.length === 5) {
                $('.modalCoinsDiv').html('');
                this.checked = false;
                modal.style.display = "block";
                changesArr = checkedArr;
                createSelectedCoinDiv()
                $('#cancel-modal').on('click', function () {
                    modal.style.display = 'none';
                })
                $('#save-modal').on('click', saveModalEvent);
            } else {
                checkedArr.push(coin);
            }
        } else {
            checkedArr = checkedArr.filter(c => c !== coin);
        }
    })
    label.append(checkBox, span)
    return label
}

function saveModalEvent() {
    let checkBoxInput = $('.checkBoxAll')
    let copyChangesArr = changesArr.map(coin => coin.symbol)
    for (let i = 0; i < checkBoxInput.length; i++) {
        if (copyChangesArr.includes(checkBoxInput[i].id)) {
            (checkBoxInput[i] as HTMLInputElement).checked = true;
        } else {
            (checkBoxInput[i] as HTMLInputElement).checked = false;
        }
    }
    checkedArr = changesArr
    modal.style.display = 'none'
}

function createSelectedCoinDiv() {
    for (let i = 0; i < checkedArr.length; i++) {
        let div = document.createElement('div');
        div.id = checkedArr[i].symbol
        div.setAttribute('class', 'modalCoinsDiv');
        let symbol = document.createElement('img');
        symbol.src = checkedArr[i].image.thumb
        let p = document.createElement('p');
        p.innerText = checkedArr[i].symbol
        let checkBox = document.createElement('input');
        checkBox.setAttribute('id', checkedArr[i].symbol);
        checkBox.addEventListener('change', function () {
            if (!this.checked) {
                changesArr = changesArr.filter(coin => coin.id != checkedArr[i].id)
            } else if (this.checked && !changesArr.includes(checkedArr[i])) {
                changesArr.push(checkedArr[i])
            }
        })
        checkBox.checked = true
        checkBox.type = 'checkbox';
        checkBox.classList.add('checkBox');
        let label = document.createElement('label')
        label.classList.add('checkbox')
        let span = document.createElement('span');
        label.append(checkBox, span)
        div.append(symbol, p, label)
        $('.modalCoins').append(div)
    }
}

$('#searchBtn').on('click', async () => {
    let valueCoin = $('.searchCoin').val();
    let coins: Coin[] = await fetch(`${BASE_URL}`).then(res => res.json());
    coins = coins.filter(coin => coin.symbol == valueCoin);
    let everyCoin = $('.coin');
    let coinsDiv = $('.coins');
    searchIfCoinExist(everyCoin, valueCoin, coinsDiv)
});

function searchIfCoinExist(everyCoin, valueCoin, coinsDiv) {
    let exist = false;
    everyCoin.each(function () {
        if (valueCoin === "") {
            coinsDiv.css('align-items', 'revert');
            this.style.display = "block";
            $('.searchCoin').css('border', 'revert')
            $('.searchCoin').attr('placeholder', 'insert coin name');
            return;
        }
        if (this.id === valueCoin) {
            this.style.display = "block";
            coinsDiv.css('align-items', 'start');
            $('.searchCoin').attr('placeholder', 'insert coin name');
            exist = true;
        } else {
            this.style.display = "none";
        }
        $('.searchCoin').css('border', 'revert')
    })
    if (!exist && valueCoin != "") {
        $('.searchCoin').css('border', '2px solid red');
        $('.searchCoin').attr('placeholder', 'try again');
    }
    $('.searchCoin').val('');
}