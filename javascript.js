// När dokumentets DOM har laddats, kör denna funktion
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies';
    const apiKey = 'solaris-2ngXkR6S02ijFrTP';
    
    const modal = document.getElementById('planetModal');
    const closeButton = document.querySelector('.close');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const errorMessage = document.getElementById('errorMessage');

    // Funktion för att skapa stjärnor
    function createStars() {
        const starContainer = document.createElement('div');
        starContainer.className = 'star-container';
        document.body.appendChild(starContainer);

        for (let i = 0; i < 30; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            
            // Sätt slumpmässiga positioner och storlekar för stjärnorna
            const size = Math.random() * 3 + 1; // Slumpmässig storlek mellan 1px och 4px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            
            starContainer.appendChild(star);
        }
    }

    createStars(); // Anropa funktionen för att skapa stjärnor när sidan laddas

    // Funktion för att hämta data från API
    async function fetchData() {
        try {
            console.log('Hämtar data från API...');
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'x-zocom': apiKey }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log('Data mottagen från API:', data);
            createPlanets(data.bodies);
            setupSearch(data.bodies);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Funktion för att skapa planetknappar
    function createPlanets(bodies) {
        const planetContainer = document.querySelector('.planet-container');
        bodies.forEach(body => {
            const planet = document.createElement('section');
            planet.className = 'planet ' + body.latinName.toLowerCase(); // Använd latinska namn som klass
            planet.dataset.name = body.name;
            planet.addEventListener('click', () => {
                showPlanetInfo(body);
                modal.style.display = 'block';
            });
            planetContainer.appendChild(planet);
        });
    }

    // Funktion för att visa information om en planet
    function showPlanetInfo(body) {
        const output = document.getElementById('output');
        output.innerHTML = `
            <article>
                <header>
                    <h2>${body.name} (${body.latinName})</h2>
                </header>
                <section>
                    <p>${body.desc}</p>
                    <p>Typ: ${body.type}</p>
                    <p>Rotation: ${body.rotation} sekunder</p>
                    <p>Omkrets: ${body.circumference} km</p>
                    <p>Temperatur: Dag - ${body.temp.day}°C, Natt - ${body.temp.night}°C</p>
                    <p>Avstånd till solen: ${body.distance} km</p>
                    <p>Omloppstid: ${body.orbitalPeriod} dagar</p>
                    <p>Månar: ${body.moons.join(', ') || 'Inga'}</p>
                </section>
            </article>
        `;
    }

    // Funktion för att initiera sökrutan
    function setupSearch(bodies) {
        function searchPlanet() {
            const query = searchInput.value.toLowerCase();
            const matchedBody = bodies.find(body => body.name.toLowerCase().includes(query));
            if (matchedBody) {
                showPlanetInfo(matchedBody);
                modal.style.display = 'block';
                errorMessage.textContent = '';
            } else {
                errorMessage.textContent = 'Var god stava rätt eller ange en befintlig planet.';
            }
        }

        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                searchPlanet();
            }
        });

        searchButton.addEventListener('click', searchPlanet);
    }

    // Stäng modalen när användaren klickar på "Tillbaka"-knappen
    closeButton.onclick = function () {
        modal.style.display = 'none';
    }

    // Stäng modalen när användaren klickar utanför modalen
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    fetchData(); // Hämta data när sidan laddas
});

// Script för Ufot
let ufo = document.getElementById('ufo');
let mouseX = 0, mouseY = 0, ufoX = 0, ufoY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - ufo.offsetWidth / 2;
    mouseY = event.clientY - ufo.offsetHeight / 2;
});

// Skapar en kontinuerlig animation
function animateUFO() {
    ufoX += (mouseX - ufoX) * 0.005;
    ufoY += (mouseY - ufoY) * 0.005;
    ufo.style.left = `${ufoX}px`;
    ufo.style.top = `${ufoY}px`;
    requestAnimationFrame(animateUFO);
}

animateUFO(); // Startar animeringsloopen
