// Fetch from Alternative.me API
async function loadBitcoinData() {
    const response = await fetch('https://api.alternative.me/fng/?limit=1000');
    const data = await response.json();

    const svg = document.querySelector('.das-line svg');
    console.log(svg);

    // Set SVG height and clear previous elements
    svg.setAttribute('height', 500);
    svg.innerHTML = '';

    const graphHeight = 400;
    const paddingBottom = 20;
    const maxValue = 100; // Fear & Greed Index max value

    data.data.forEach((item, index) => {
        const x = 100 + (index * 2.5); // Horizontal spacing
        const value = parseInt(item.value, 10);

        // Scale Y: Invert because SVG origin is top-left
        const y = graphHeight - paddingBottom - ((value / maxValue) * (graphHeight - paddingBottom));

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', getColorForValue(value));
        circle.setAttribute('data-value', value);
        circle.setAttribute('data-date', item.timestamp);

        svg.appendChild(circle);
    });
}

function getColorForValue(value) {
    if (value < 25) return '#FF3B30';
    if (value < 50) return '#FF9500';
    if (value < 60) return '#FFCC00';
    if (value < 75) return '#34C759';
    return '#ADFF2F';
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