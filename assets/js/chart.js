// Fetch from Alternative.me API
async function loadBitcoinData() {
    const res = await fetch('https://api.alternative.me/fng/?limit=1000');
    const { data } = await res.json();

    // Categorize data points by color groups
    const groupedData = {
        red: [],
        orange: [],
        yellow: [],
        green: [],
        lime: []
    };

    data.reverse().forEach(d => {
        const value = Number(d.value);
        const point = { x: new Date(d.timestamp * 1000), y: value };

        if (value < 20) groupedData.red.push(point);
        else if (value < 40) groupedData.orange.push(point);
        else if (value < 60) groupedData.yellow.push(point);
        else if (value < 80) groupedData.green.push(point);
        else groupedData.lime.push(point);
    });

    const options = {
        chart: {
            type: 'scatter',
            height: 500,
            background: 'transparent',
            toolbar: {
                show: false
            },
            margin: {
                top: 20,
                right: 50,  // Increased for right labels
                bottom: 30,
                left: 50     // Increased for balance
            },
            // Add these to ensure proper rendering
            animations: {
                enabled: false  // Helps with rendering issues
            },
            sparkline: {
                enabled: false
            }
        },
        series: [
            { name: 'Extreme Fear', data: groupedData.red, color: '#FF3B30' },
            { name: 'Fear', data: groupedData.orange, color: '#FF9500' },
            { name: 'Neutral', data: groupedData.yellow, color: '#FFCC00' },
            { name: 'Greed', data: groupedData.green, color: '#34C759' },
            { name: 'Extreme Greed', data: groupedData.lime, color: '#AEFC2E' }
        ],
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#d1d5db'
                },
                offsetY: 2
            },
            axisBorder: { color: '#181818' },
            axisTicks: { color: '#d1d5db' }
        },
            yaxis: [
                // Left y-axis (your existing configuration)
                {
                    min: 0,
                    max: 100,
                    tickAmount: 10,
                    labels: {
                        style: {
                            colors: '#d1d5db',
                            fontSize: '12px'
                        },
                        formatter: function(value) {
                            return `$${value}K`;
                        },
                        offsetX: -10
                    },
                    axisBorder: { color: '#d1d5db' },
                    axisTicks: { color: '#d1d5db' },
                    opposite: false  // Ensures this stays on the left
                },
                {
                    min: 0,
                    max: 100,
                    tickAmount: 5,  // Only show 5 ticks (100, 80, 60, 40, 20)
                    labels: {
                        style: {
                            colors: '#d1d5db',
                            fontSize: '12px'
                        },
                        formatter: function(value) {
                            // Only show labels for specific values
                            if ([100, 80, 60, 40, 20].includes(value)) {
                                return value;
                            }
                            return '';  // Empty string for other values
                        },
                        offsetX: 30  // Position to the right of the axis line
                    },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    opposite: true,  // Places this on the right side
                    show: true,
                    floating: true,
                    tooltip: { enabled: false }
                }
            ],
        grid: {
            borderColor: '#181818',
            padding: {
                left: 10,
                right: 100  // Extra padding on right
            }
        },
        markers: { size: 4 },
        legend: { show: false },
        // Custom tooltip styling
        tooltip: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontFamily: 'inherit'
            },
            y: {
                formatter: function(value) {
                    return `$${value}K`;
                },
                title: {
                    formatter: function() {
                        return 'Value';
                    }
                }
            },
            theme: 'light',  // Force light theme
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                // Custom HTML for tooltip
                return `<div class="apexcharts-tooltip-custom" style="background: #ffffff; color: #000000; padding: 8px 12px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1)">
                <div style="font-weight: 600">${w.globals.seriesNames[seriesIndex]}</div>
                <div>Date: ${new Date(w.globals.seriesX[seriesIndex][dataPointIndex]).toLocaleDateString()}</div>
                <div>Value: $${series[seriesIndex][dataPointIndex]}K</div>
            </div>`;
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    // Alternative way to handle icon clicks if the above doesn't work
    document.querySelector('.icon-item:nth-child(2)').addEventListener('click', function() {
        if (chart.toggleFullscreen) {
            chart.toggleFullscreen();
        } else {
            // Fallback for older versions
            const chartElement = document.querySelector('#chart');
            if (chartElement.requestFullscreen) {
                chartElement.requestFullscreen();
            } else if (chartElement.webkitRequestFullscreen) {
                chartElement.webkitRequestFullscreen();
            } else if (chartElement.msRequestFullscreen) {
                chartElement.msRequestFullscreen();
            }
        }
    });

    document.querySelector('.icon-item:nth-child(1)').addEventListener('click', async function () {
        try {
            chart.updateOptions({
                chart: {
                    background: '#0C0C0C' // Your dark background color
                }
            }, false, false); // The two 'false' prevent animation and redraw

            // Export with dark background
            const { imgURI } = await chart.dataURI();
            const downloadLink = document.createElement('a');
            downloadLink.href = imgURI;
            downloadLink.download = 'fear-greed-index.png';
            downloadLink.click();
        } catch (error) {
            console.error('Failed to export chart:', error);
            alert('Chart export failed. Please try again.');
        }
    });
}

loadBitcoinData().finally();

document.querySelectorAll('circle').forEach(point => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
    <strong>${point.getAttribute('data-year')}</strong><br>
    Value: ${point.getAttribute('data-value')}
  `;
    document.body.appendChild(tooltip);

    point.addEventListener('mouseenter', (e) => {
        const rect = point.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY}px`;
        tooltip.style.display = 'block';
    });

    point.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});