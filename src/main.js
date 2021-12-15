$(function () {
    var names;
    var chartDom = document.getElementById('echarts');
    var myChart = echarts.init(chartDom);
    var option = 0;
    var data;
    var currentOption;
    const updateFrequency = 1000;
    const columnOption = {
        title: {
            text: '碧蓝航线实时投票排行榜',
            subtext: '数据每分钟刷新',
            left: 'center',
        },
        grid: {
            top: 50,
            bottom: 30,
            left: 150,
            right: 80
        },
        dataset: [
            {}
        ],
        xAxis: {
            max: 'dataMax'
        },
        yAxis: {
            type: 'category',
            inverse: true,
            max: 31,
            axisLabel: {
                show: true,
                fontSize: 14
            },
            animationDuration: 300,
            animationDurationUpdate: 300
        },
        series: [
            {
                realtimeSort: true,
                seriesLayoutBy: 'column',
                type: 'bar',
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true,
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'monospace'
                }
            }
        ],
        animationDuration: updateFrequency,
        animationDurationUpdate: updateFrequency,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    };
    const pieOption = {
        title: {
            text: '碧蓝航线实时投票排行榜',
            subtext: '数据每分钟刷新',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 160,
            top: 40,
            bottom: 20,
        },
        dataset: [
            {}
        ],
        series: [
            {
                type: 'pie',
                radius: [50, 250],
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }
        ]
    }
    const options = [columnOption, pieOption];

    $.when(
        $.getJSON('./data/names.json')
    ).done(function (res) {
        names = res;

        currentOption = options[option];
        load();
    });

    function load() {
        $.when(
            $.getJSON('./data/info.json')
        ).done(function (res) {
            var len = res.length;
            for (var i = 0; i < len; i++) {
                res[i][0] = names[res[i][0]];
            }
            data = res;
            currentOption.dataset[0].source = data;
            myChart.setOption(currentOption);
        })
    }

    setInterval(function () {
        load();
    }, 60000);

    $('#share').on('click', function () {
        var input = $('<input>').attr('value', window.location.href).attr('readonly', 'readonly');
        $('body').append(input);
        input.select();
        document.execCommand('copy');
        input.remove();
    })

    $('#switch').on('click', function(){
        currentOption = options[(option += 1) % 2];
        currentOption.dataset[0].source = data;
        myChart.setOption(currentOption);
    })

})