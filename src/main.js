$(function () {
    var chartDom = document.getElementById('echarts');
    var myChart = echarts.init(chartDom);
    const option = {
        title: {
            text: '碧蓝航线2021人气投票全纪实',
            subtext: '倍速：×3600',
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
            animationDuration: 0,
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
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        graphic: {
            elements: [
                {
                    type: 'text',
                    right: 160,
                    bottom: 60,
                    style: {
                        font: 'bolder 80px monospace',
                        fill: 'rgba(100, 100, 100, 0.25)'
                    },
                    z: 100
                }
            ]
        }
    };
    $.when(
        $.getJSON('./data/names.json'),
        $.getJSON('./data/vote.json')
    ).done(function (res0, res1) {
        const names = res0[0];
        const data = res1[0];
        const times = [];
        for (let i = 0; i < data.length; i++) {
            data[i][0] = names[data[i][0]];
            if (times.length === 0 || times[times.length - 1] !== data[i][2]) {
                times.push(data[i][2]);
            }
        }
        for (let i = 0; i < times.length; i++) {
            (function (i) {
                setTimeout(function () {
                    let source = data.filter(function (d) {
                        return d[2] === times[i];
                    })
                    option.dataset[0].source = source;
                    option.graphic.elements[0].style.text = times[i].replace(' ', '\n');
                    myChart.setOption(option);
                }, i * 1000);
            })(i);
        }
    });

    $('#share').on('click', function () {
        var input = $('<input>').attr('value', window.location.href).attr('readonly', 'readonly');
        $('body').append(input);
        input.select();
        document.execCommand('copy');
        input.remove();
    })

})