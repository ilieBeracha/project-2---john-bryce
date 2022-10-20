const BASE_URL = 'https://api.coingecko.com/api/v3/coins'
let modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];


document.addEventListener('DOMContentLoaded', async () => {
    let coins: Coin[] = await fetch(`${BASE_URL}`).then(res => res.json());
    for (const coin of coins) {
        createCoin(coin);
        // console.log(coin);
        
    }
})

async function createCoin(coin: Coin) {
    let div = document.createElement('div');
    div.classList.add('coin')
    div.setAttribute('id',coin.symbol)
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
    })
    button.classList.add('btn');
    button.setAttribute('data-bs-toggle', 'collapse')
    button.setAttribute(`data-bs-target`, `#${coin.id}-info`)
    button.type = 'button'
    button.innerText = "More info"
    return button
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

function createCheckbox(coin: Coin) {
    let checkBox = document.createElement('input');
    checkBox.type = 'checkBox';
    checkBox.classList.add('checkBox');
    let label = document.createElement('label')
    label.classList.add('checkbox')
    let span = document.createElement('span');
    checkBox.checked = checkedArr.includes(coin.symbol)
    checkBox.addEventListener('change', async function () {
        if (this.checked) {
            if (checkedArr.length === 5) {
                this.checked = false;
                modal.style.display = "block";
            } else {
                checkedArr.push(coin.symbol)
                let checkBox = document.querySelector('.checkbox');
                // (checkBox as HTMLInputElement).checked = true;

            }
        } else {
            checkedArr = checkedArr.filter(c => c !== coin.symbol);
            // (checkBox as HTMLInputElement).checked = false;
        }
        console.log(checkedArr)
    })

    label.append(checkBox, span)
    return label
}

$('#searchBtn').on('click', async () => {
    let valueCoin = $('.searchCoin').val();
    let coins: Coin[] = await fetch(`${BASE_URL}`).then(res => res.json());
    coins = coins.filter(coin=>coin.symbol == valueCoin)   
    console.log(coins);
    let allCoins = $('.coin');
    allCoins.each(function(){
        if(valueCoin===""){
            this.style.display = "block"
            return;
        } 
        if(this.id===valueCoin){
            $('.searchCoin').css('border','none')
            this.style.display = "block"
        } else {
            this.style.display = "none"
        }
    })
    $('#searchCoin').val('')
})



// orgenizing the functoins.
// styilyng the about me page.



