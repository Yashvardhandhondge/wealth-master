// Fetch from Alternative.me API and CoinAPI
// Fixed Bitcoin Fear & Greed Index Chart
// Make sure to include Plotly library in your HTML:
// <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

async function loadBitcoinData() {
    try {
        // Show loading indicator
        document.querySelector("#chart").innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #d1d5db;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #374151; border-top: 4px solid #F7931A; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                    <p>Loading historical chart data...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        // Fetch Fear & Greed Index data (all available data)
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=0');
        const fngData = await fngRes.json();
        
        // Use CryptoCompare API for historical Bitcoin data (free, no 365-day limit)
        // Get daily data for the last 2000 days (about 5.5 years)
        const priceRes = await fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000');
        const priceResponse = await priceRes.json();
        
        if (priceResponse.Response === 'Error') {
            throw new Error('Failed to fetch Bitcoin price data');
        }
        
        const priceData = priceResponse.Data.Data;
        
        console.log(`Fetched ${fngData.data.length} Fear & Greed data points (all available data)`);
        console.log(`Fetched ${priceData.length} Bitcoin price points (last 5+ years)`);
        
        // Create a map of dates to FNG values for easier lookup
        const fngMap = new Map();
        fngData.data.forEach(item => {
            const date = new Date(item.timestamp * 1000).toDateString();
            fngMap.set(date, {
                value: parseInt(item.value),
                classification: item.value_classification
            });
        });
        
        // Combine Bitcoin prices with Fear & Greed data
        const combinedData = [];
        
        priceData.forEach(dayData => {
            const date = new Date(dayData.time * 1000);
            const dateString = date.toDateString();
            
            // Find matching FNG data or use neutral value
            const fngInfo = fngMap.get(dateString) || { value: 50, classification: 'Neutral' };
            
            combinedData.push({
                x: date,
                y: Math.round(dayData.close), // Bitcoin closing price
                fngValue: fngInfo.value,
                classification: fngInfo.classification,
                color: getFearGreedColor(fngInfo.value)
            });
        });
        
        // Function to get color based on Fear & Greed value
        function getFearGreedColor(value) {
            if (value <= 24) return '#FF3B30';      // Extreme Fear - Red
            else if (value <= 49) return '#FF9500'; // Fear - Orange
            else if (value <= 59) return '#FFCC00'; // Neutral - Yellow
            else if (value <= 74) return '#34C759'; // Greed - Green
            else return '#AEFC2E';                  // Extreme Greed - Lime
        }
        
        // Sort by date
        combinedData.sort((a, b) => new Date(a.x) - new Date(b.x));
        
        console.log(`Generated ${combinedData.length} combined data points with historical Bitcoin price data`);
        
        // Prepare data for Plotly
        const trace = {
            x: combinedData.map(d => d.x),
            y: combinedData.map(d => d.y),
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 8,
                color: combinedData.map(d => d.fngValue),
                colorscale: [
                    [0, '#FF3B30'],    // Red for extreme fear (0-24)
                    [0.25, '#FF9500'], // Orange for fear (25-49)
                    [0.5, '#FFCC00'],  // Yellow for neutral (50-59)
                    [0.75, '#34C759'], // Green for greed (60-74)
                    [1, '#AEFC2F']     // Lime for extreme greed (75-100)
                ],
                cmin: 0,
                cmax: 100,
                colorbar: {
                    title: {
                        text: 'Fear & Greed Index',
                        font: { color: '#d1d5db', size: 14 }
                    },
                    titleside: 'right',
                    tickmode: 'array',
                    tickvals: [0, 20, 40, 60, 80, 100],
                    ticktext: ['0', '20', '40', '60', '80', '100'],
                    tickfont: { color: '#d1d5db', size: 12 },
                    len: 0.9,
                    thickness: 20,
                    x: 1.02,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    bordercolor: '#374151',
                    borderwidth: 1,
                    outlinecolor: '#d1d5db',
                    outlinewidth: 1
                },
                opacity: 0.8,
                line: {
                    width: 0
                }
            },
            hovertemplate: '<b>%{text}</b><br>' +
                          'Bitcoin Price: <b>$%{y:,.0f}</b><br>' +
                          'Fear & Greed: <b>%{customdata[0]}</b> (%{customdata[1]})<br>' +
                          '<extra></extra>',
            text: combinedData.map(d => d.x.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })),
            customdata: combinedData.map(d => [d.fngValue, d.classification]),
            name: 'Bitcoin Price vs Fear & Greed'
        };
        
        const layout = {
            title: {
                text: '',
                font: { color: '#d1d5db', size: 16 }
            },
            xaxis: {
                title: {
                    text: '',
                    font: { color: '#d1d5db', size: 12 }
                },
                color: '#d1d5db',
                gridcolor: '#374151',
                tickfont: { color: '#d1d5db', size: 11 },
                showgrid: true,
                type: 'date',
                zeroline: false,
                showline: true,
                linecolor: '#374151'
            },
            yaxis: {
                title: {
                    text: 'Bitcoin Price (USD)',
                    font: { color: '#F7931A', size: 14 }
                },
                color: '#d1d5db',
                gridcolor: '#374151',
                tickfont: { color: '#d1d5db', size: 11 },
                showgrid: true,
                type: 'log',
                zeroline: false,
                showline: true,
                linecolor: '#374151',
                tickmode: 'auto',
                nticks: 8,
                tickformat: '',
                tickprefix: '$',
                showexponent: 'none',
                separatethousands: true,
                side: 'left',
                ticklen: 6,
                tickwidth: 1,
                tickcolor: '#374151'
            },
            plot_bgcolor: 'rgba(0,0,0,0.1)',
            paper_bgcolor: 'transparent',
            font: { color: '#d1d5db', family: 'Inter, sans-serif' },
            margin: { l: 90, r: 140, t: 50, b: 60 }, // Increased left margin for price labels
            showlegend: false,
            hovermode: 'closest',
            dragmode: 'zoom'
        };
        
        const config = {
            displayModeBar: false,
            displaylogo: false,
            responsive: true
        };
        
        // Clear the loading indicator and render the chart
        document.querySelector("#chart").innerHTML = '';
        Plotly.newPlot('chart', [trace], layout, config);

        // Add custom time range dropdown after chart is created
        const chartContainer = document.querySelector('#chart');
        const dropdownHTML = `
            <div class="time-range-dropdown" style="position: absolute; top: 10px; right: 10px; z-index: 1000;">
                <select id="timeRangeSelector" style="
                    background: rgba(0,0,0,0.1); 
                    color: #d1d5db; 
                    border: 1px solid #374151; 
                    border-radius: 6px; 
                    padding: 8px 12px; 
                    font-size: 12px;
                    font-family: Inter, sans-serif;
                    outline: none;
                    cursor: pointer;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                ">
                    <option value="7">7 Days</option>
                    <option value="30" selected>30 Days</option>
                    <option value="90">3 Months</option>
                    <option value="180">6 Months</option>
                    <option value="365">1 Year</option>
                    <option value="all">All Data</option>
                </select>
            </div>
        `;
        
        chartContainer.style.position = 'relative';
        chartContainer.insertAdjacentHTML('afterbegin', dropdownHTML);

        // Handle dropdown change
        document.getElementById('timeRangeSelector').addEventListener('change', function(e) {
            const selectedDays = e.target.value;
            let startDate, endDate = new Date();
            
            if (selectedDays === 'all') {
                startDate = new Date(Math.min(...combinedData.map(d => d.x)));
            } else {
                startDate = new Date(Date.now() - parseInt(selectedDays) * 24 * 60 * 60 * 1000);
            }
            
            // Filter data for the selected time range
            const filteredData = combinedData.filter(d => d.x >= startDate && d.x <= endDate);
            
            if (filteredData.length > 0) {
                const minPrice = Math.min(...filteredData.map(d => d.y));
                const maxPrice = Math.max(...filteredData.map(d => d.y));
                
                // Calculate appropriate price range with padding
                const priceRange = maxPrice - minPrice;
                const padding = priceRange * 0.1; // 10% padding
                const yMin = Math.max(1, minPrice - padding); // Ensure minimum value is at least 1 for log scale
                const yMax = maxPrice + padding;
                
                // Generate evenly distributed tick values
                const tickCount = 8; // Number of ticks on y-axis
                const tickValues = [];
                const tickText = [];
                
                if (yMax / yMin > 100) {
                    // Use log scale ticks for large ranges
                    const logMin = Math.log10(yMin);
                    const logMax = Math.log10(yMax);
                    const logStep = (logMax - logMin) / (tickCount - 1);
                    
                    for (let i = 0; i < tickCount; i++) {
                        const logVal = logMin + (i * logStep);
                        const val = Math.pow(10, logVal);
                        tickValues.push(val);
                        
                        if (val >= 10000) {
                            tickText.push(`$${(val / 1000).toFixed(0)}K`);
                        } else if (val >= 1000) {
                            tickText.push(`$${(val / 1000).toFixed(1)}K`);
                        } else {
                            tickText.push(`$${val.toFixed(0)}`);
                        }
                    }
                } else {
                    // Use linear ticks for smaller ranges
                    const step = (yMax - yMin) / (tickCount - 1);
                    
                    for (let i = 0; i < tickCount; i++) {
                        const val = yMin + (i * step);
                        tickValues.push(val);
                        
                        if (val >= 10000) {
                            tickText.push(`$${(val / 1000).toFixed(0)}K`);
                        } else if (val >= 1000) {
                            tickText.push(`$${(val / 1000).toFixed(1)}K`);
                        } else {
                            tickText.push(`$${val.toFixed(0)}`);
                        }
                    }
                }
                
                // Update chart with new date range and optimized y-axis
                const update = {
                    'xaxis.range': [startDate, endDate],
                    'yaxis.range': [Math.log10(yMin), Math.log10(yMax)],
                    'yaxis.tickvals': tickValues,
                    'yaxis.ticktext': tickText,
                    'yaxis.tickmode': 'array'
                };
                
                Plotly.relayout('chart', update);
            }
        });

        // Set initial view to 30 days with proper y-axis scaling
        const initialStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const initialEndDate = new Date();
        
        setTimeout(() => {
            const filteredData = combinedData.filter(d => d.x >= initialStartDate && d.x <= initialEndDate);
            
            if (filteredData.length > 0) {
                const minPrice = Math.min(...filteredData.map(d => d.y));
                const maxPrice = Math.max(...filteredData.map(d => d.y));
                const priceRange = maxPrice - minPrice;
                const padding = priceRange * 0.1;
                const yMin = Math.max(1, minPrice - padding);
                const yMax = maxPrice + padding;
                
                // Generate initial tick values
                const tickCount = 8;
                const tickValues = [];
                const tickText = [];
                
                const logMin = Math.log10(yMin);
                const logMax = Math.log10(yMax);
                const logStep = (logMax - logMin) / (tickCount - 1);
                
                for (let i = 0; i < tickCount; i++) {
                    const logVal = logMin + (i * logStep);
                    const val = Math.pow(10, logVal);
                    tickValues.push(val);
                    
                    if (val >= 10000) {
                        tickText.push(`$${(val / 1000).toFixed(0)}K`);
                    } else if (val >= 1000) {
                        tickText.push(`$${(val / 1000).toFixed(1)}K`);
                    } else {
                        tickText.push(`$${val.toFixed(0)}`);
                    }
                }
                
                Plotly.relayout('chart', {
                    'xaxis.range': [initialStartDate, initialEndDate],
                    'yaxis.range': [Math.log10(yMin), Math.log10(yMax)],
                    'yaxis.tickvals': tickValues,
                    'yaxis.ticktext': tickText,
                    'yaxis.tickmode': 'array'
                });
            }
        }, 100);

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
        
        console.log('Chart successfully loaded with historical Bitcoin price data from CryptoCompare');
        
    } catch (error) {
        console.error('Error loading Bitcoin historical data:', error);
        
        // Show error message with retry button
        document.querySelector("#chart").innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #d1d5db; flex-direction: column;">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20" style="margin-bottom: 16px; opacity: 0.7;">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <p style="text-align: center; font-size: 16px; margin-bottom: 8px; font-weight: 600;">Unable to load chart data</p>
                <p style="text-align: center; font-size: 14px; opacity: 0.7; margin-bottom: 16px;">Failed to fetch historical data. Please try again.</p>
                <button onclick="loadBitcoinData()" style="padding: 10px 20px; background: #F7931A; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">
                    Retry Loading
                </button>
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