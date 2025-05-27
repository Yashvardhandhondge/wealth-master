// Fetch from Alternative.me API
// Fixed Bitcoin Fear & Greed Index Chart
// Make sure to include ApexCharts library in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

async function loadBitcoinData() {
    try {
        // Fetch Fear & Greed Index data
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=365');
        const fngData = await fngRes.json();
        
        // Fetch Bitcoin price data (using CoinGecko API)
        const btcRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily');
        const btcData = await btcRes.json();
        
        // Process and combine data
        const processedData = [];
        const fngMap = new Map();
        
        // Create map of FNG data by date
        fngData.data.forEach(item => {
            const date = new Date(item.timestamp * 1000);
            const dateStr = date.toISOString().split('T')[0];
            fngMap.set(dateStr, {
                value: parseInt(item.value),
                classification: item.value_classification
            });
        });
        
        // Combine with Bitcoin price data
        btcData.prices.forEach(([timestamp, price]) => {
            const date = new Date(timestamp);
            const dateStr = date.toISOString().split('T')[0];
            const fngInfo = fngMap.get(dateStr);
            
            if (fngInfo) {
                processedData.push({
                    date: timestamp,
                    price: price,
                    fngValue: fngInfo.value,
                    classification: fngInfo.classification
                });
            }
        });
        
        // Sort by date
        processedData.sort((a, b) => a.date - b.date);
        
        // Prepare chart series
        const priceSeries = processedData.map(item => [item.date, item.price]);
        const fngSeries = processedData.map(item => [item.date, item.fngValue]);
        
        // Create color-coded FNG points
        const fngPoints = {
            extremeFear: [],
            fear: [],
            neutral: [],
            greed: [],
            extremeGreed: []
        };
        
        processedData.forEach(item => {
            const point = [item.date, item.fngValue];
            if (item.fngValue <= 24) fngPoints.extremeFear.push(point);
            else if (item.fngValue <= 49) fngPoints.fear.push(point);
            else if (item.fngValue <= 59) fngPoints.neutral.push(point);
            else if (item.fngValue <= 74) fngPoints.greed.push(point);
            else fngPoints.extremeGreed.push(point);
        });
        
        const options = {
            chart: {
                type: 'line',
                height: 500,
                background: 'transparent',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: false,
                        reset: true
                    }
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800
                }
            },
            series: [
                {
                    name: 'Bitcoin Price',
                    type: 'area',
                    data: priceSeries,
                    yAxisIndex: 0,
                    color: '#F7931A',
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 0.1,
                            opacityFrom: 0.4,
                            opacityTo: 0.1,
                            stops: [0, 100]
                        }
                    }
                },
                {
                    name: 'Extreme Fear (0-24)',
                    type: 'scatter',
                    data: fngPoints.extremeFear,
                    yAxisIndex: 1,
                    color: '#FF3B30',
                    marker: {
                        size: 4,
                        strokeWidth: 0
                    }
                },
                {
                    name: 'Fear (25-49)',
                    type: 'scatter',
                    data: fngPoints.fear,
                    yAxisIndex: 1,
                    color: '#FF9500',
                    marker: {
                        size: 4,
                        strokeWidth: 0
                    }
                },
                {
                    name: 'Neutral (50-59)',
                    type: 'scatter',
                    data: fngPoints.neutral,
                    yAxisIndex: 1,
                    color: '#FFCC00',
                    marker: {
                        size: 4,
                        strokeWidth: 0
                    }
                },
                {
                    name: 'Greed (60-74)',
                    type: 'scatter',
                    data: fngPoints.greed,
                    yAxisIndex: 1,
                    color: '#34C759',
                    marker: {
                        size: 4,
                        strokeWidth: 0
                    }
                },
                {
                    name: 'Extreme Greed (75-100)',
                    type: 'scatter',
                    data: fngPoints.extremeGreed,
                    yAxisIndex: 1,
                    color: '#AEFC2E',
                    marker: {
                        size: 4,
                        strokeWidth: 0
                    }
                }
            ],
            xaxis: {
                type: 'datetime',
                labels: {
                    style: {
                        colors: '#d1d5db',
                        fontSize: '12px'
                    },
                    datetimeUTC: false,
                    format: 'dd MMM'
                },
                axisBorder: {
                    color: '#374151'
                },
                axisTicks: {
                    color: '#374151'
                },
                grid: {
                    borderColor: '#374151'
                }
            },
            yaxis: [
                {
                    // Bitcoin Price (Left Y-axis)
                    seriesName: 'Bitcoin Price',
                    opposite: false,
                    min: Math.min(...priceSeries.map(p => p[1])) * 0.95,
                    max: Math.max(...priceSeries.map(p => p[1])) * 1.05,
                    labels: {
                        style: {
                            colors: '#d1d5db',
                            fontSize: '12px'
                        },
                        formatter: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    },
                    title: {
                        text: 'Bitcoin Price (USD)',
                        style: {
                            color: '#F7931A',
                            fontSize: '14px',
                            fontWeight: 600
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: '#F7931A'
                    }
                },
                {
                    // Fear & Greed Index (Right Y-axis)
                    seriesName: 'Fear & Greed Index',
                    opposite: true,
                    min: 0,
                    max: 100,
                    tickAmount: 5,
                    labels: {
                        style: {
                            colors: '#d1d5db',
                            fontSize: '12px'
                        },
                        formatter: function(value) {
                            return Math.round(value);
                        }
                    },
                    title: {
                        text: 'Fear & Greed Index',
                        style: {
                            color: '#d1d5db',
                            fontSize: '14px',
                            fontWeight: 600
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: '#d1d5db'
                    }
                }
            ],
            grid: {
                borderColor: '#374151',
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            legend: {
                show: false // We'll use the existing legend below the chart
            },
            tooltip: {
                shared: true,
                custom: function({ series, seriesIndex, dataPointIndex, w }) {
                    const dataPoint = processedData[dataPointIndex];
                    if (!dataPoint) return '';
                    
                    const date = new Date(dataPoint.date).toLocaleDateString();
                    const price = '$' + dataPoint.price.toLocaleString();
                    const fngValue = dataPoint.fngValue;
                    const classification = dataPoint.classification;
                    
                    return `
                        <div style="background: #1f2937; padding: 12px; border-radius: 8px; border: 1px solid #374151;">
                            <div style="color: #f9fafb; font-weight: 600; margin-bottom: 8px;">${date}</div>
                            <div style="color: #F7931A; margin-bottom: 4px;">Bitcoin: ${price}</div>
                            <div style="color: #d1d5db;">Fear & Greed: ${fngValue} (${classification})</div>
                        </div>
                    `;
                }
            },
            stroke: {
                width: [2, 0, 0, 0, 0, 0], // Only the price line should have stroke
                curve: 'smooth'
            },
            fill: {
                opacity: [0.3, 1, 1, 1, 1, 1]
            }
        };
        
        // Render the chart
        const chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
        
        // Handle fullscreen functionality
        document.querySelector('#full-screen').addEventListener('click', function() {
            const chartElement = document.querySelector('#chart');
            if (chartElement.requestFullscreen) {
                chartElement.requestFullscreen();
            } else if (chartElement.webkitRequestFullscreen) {
                chartElement.webkitRequestFullscreen();
            } else if (chartElement.msRequestFullscreen) {
                chartElement.msRequestFullscreen();
            }
        });
        
        // Handle screenshot functionality
        document.querySelector('.icon-item:first-child').addEventListener('click', async function() {
            try {
                const dataURI = await chart.dataURI({
                    pixelRatio: 2,
                    width: 1200,
                    height: 600
                });
                
                const link = document.createElement('a');
                link.href = dataURI.imgURI;
                link.download = 'bitcoin-fear-greed-index-' + new Date().toISOString().split('T')[0] + '.png';
                link.click();
            } catch (error) {
                console.error('Failed to export chart:', error);
                alert('Chart export failed. Please try again.');
            }
        });
        
    } catch (error) {
        console.error('Error loading Bitcoin data:', error);
        
        // Fallback: Show error message
        document.querySelector("#chart").innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #d1d5db; flex-direction: column;">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20" style="margin-bottom: 16px;">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <p style="text-align: center; font-size: 16px; margin-bottom: 8px;">Unable to load chart data</p>
                <p style="text-align: center; font-size: 14px; opacity: 0.7;">Please check your internet connection and try again</p>
            </div>
        `;
    }
}

// Initialize the chart when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBitcoinData);
} else {
    loadBitcoinData();
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