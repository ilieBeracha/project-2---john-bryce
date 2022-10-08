type Coin = {
    symbol:string;
    block_time_in_minutes:string,
    id:string,
    image: {
        large:string,
        small:string,
        thumb:string
    },
    last_updated:string,
    market_data: {
        current_price: {
            usd:number,
            ils:number,
            eur:number
        }
        market_cap: {
            usd:string
        }
        price_change_24h:number
    }
    total_volume: {
        usd:number
    }
}
