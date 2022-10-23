$(() => {
    $('.navBar a').on('click', async function (e) {
        e.preventDefault()
        let page = this.dataset.page;
        $('section').removeClass('show');
        $(`.${page}`).addClass('show');
        if (page === 'coinsSec') {
            let coins = $('.coin');
            coins.each(function () {
                coins.css('align-items', 'revert');
                $('.searchCoin').css('border', 'revert')
                $('.searchCoin').attr('placeholder', 'insert coin name');
                this.style.display = "block";
                return;
            })
        }
        let interval = undefined;
        if (page === 'reportsSec') {
            if (checkedArr.length === 0) {
                let text = $('#graphDiv');
                text.html('')
                let h1 = $('<h1>please choose coins to see the graphs!</h1>');
                text.append(h1)
                $('#chartContainer').html('');
                return;
            } else {
                $('#graphDiv').html('');
            }
            let data = [];

            let chartUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${checkedArr}&tsyms=USD,EUR`
            let coinChecked = await fetch(chartUrl).then(res => res.json());
            for (const coin in coinChecked) {
                data.push({
                    name: coin,
                    type: 'spline',
                    axisYType: "secondary",
                    showInLegend: true,
                    xValueFormatString: "MMM YYYY",
                    yValueFormatString: "$#,##0.#",
                    dataPoints: []
                })
            }
            interval = setInterval(async () => {
                let chartUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${checkedArr}&tsyms=USD,EUR`
                let coinChecked = await fetch(chartUrl).then(res => res.json());
                for (const coin in coinChecked) {
                    let currCoin = data.filter(coinData => coinData.name === coin)
                    currCoin[0].dataPoints.push({
                        x: new Date(),
                        y: coinChecked[coin].USD,
                    })
                }
                var options = {
                    exportEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: checkedArr
                    },
                    axisX: {
                        title: "date"
                    },
                    axisY: {
                        title: "price",
                        titleFontColor: "#4F81BC",
                        lineColor: "#4F81BC",
                        labelFontColor: "#4F81BC",
                        tickColor: "#4F81BC"
                    },
                    axisY2: {
                        title: "price in USD",
                        titleFontColor: "#C0504E",
                        lineColor: "#C0504E",
                        labelFontColor: "#C0504E",
                        tickColor: "#C0504E"
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries
                    },
                    data: data
                };
                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                };
                ($("#chartContainer") as any).CanvasJSChart(options);
            }, 2000)
        }
        $('a').on('click', () => {
            clearInterval(interval);
        })
    })
});