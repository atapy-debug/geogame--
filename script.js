// Array of all provinces in Turkey
const provinces = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
    "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
    "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
    "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
    "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "Istanbul",
    "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
    "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
    "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize",
    "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ",
    "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

// Game variables
let shuffledProvinces, currentQuestionIndex, score;

// Path to the GeoJSON file for Turkey provinces
const provinceGeoJSONUrl = 'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/refs/heads/master/tr-cities.json';

// Initial color for all provinces (default)
const initialProvinceColor = 'blue'; 

// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',
    layers: [],
    view: new ol.View({
        center: ol.proj.fromLonLat([35.2433, 38.9637]), // Centered on Turkey
        zoom: 5.5
    })
});

// Load province layer
const provinceLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: provinceGeoJSONUrl,
        format: new ol.format.GeoJSON()
    })
});
map.addLayer(provinceLayer);

// Initialize and start the game
function startGame() {
    shuffledProvinces = [...provinces].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    updateQuestion();
    clearProvinceHighlights(); // Keep the default color intact (blue)
    document.getElementById("resultMessage").innerText = "";
    document.getElementById("score").innerText = `Score: ${score}`;
}

// Display the current province to guess
function updateQuestion() {
    const provinceName = shuffledProvinces[currentQuestionIndex];
    document.getElementById("provinceName").innerText = `Province: ${provinceName}`;
}

// Styles for each answer type
function getProvinceStyle(color) {
    return new ol.style.Style({
        fill: new ol.style.Fill({ color }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 1 })
    });
}

// Check if the selected province is correct
function checkAnswer(selectedProvince) {
    const currentProvince = shuffledProvinces[currentQuestionIndex];
    const resultMessage = document.getElementById("resultMessage");

    if (selectedProvince === currentProvince) {
        score++;
        resultMessage.innerText = "Correct!";
        highlightProvince(selectedProvince, 'green'); // Correct answer in green
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledProvinces.length) {
            updateQuestion();
        } else {
            resultMessage.innerText = `Quiz complete! Final score: ${score}`;
        }
    } else {
        resultMessage.innerText = `Incorrect! You selected ${selectedProvince}. The correct answer is shown in green.`;
        highlightProvince(selectedProvince, 'red'); // Incorrect answer in red
        highlightProvince(currentProvince, 'green'); // Correct answer in green
    }
    document.getElementById("score").innerText = `Score: ${score}`;
}

// Highlight the selected province
function highlightProvince(provinceName, color) {
    provinceLayer.getSource().getFeatures().forEach(feature => {
        if (feature.get('name') === provinceName) {
            feature.setStyle(getProvinceStyle(color));
        }
    });
}

// Click event for map to guess province
map.on('click', function (event) {
    map.forEachFeatureAtPixel(event.pixel, function (feature) {
        const clickedProvince = feature.get('name');
        checkAnswer(clickedProvince);
    });
});

// Clear all province highlights and set them to initial color
function clearProvinceHighlights() {
    provinceLayer.getSource().getFeatures().forEach(feature => {
        feature.setStyle(getProvinceStyle(initialProvinceColor)); // Keep all provinces in default blue color
    });
}

// Restart button event listener
document.getElementById("restartButton").addEventListener("click", () => {
    startGame();
});

// Start game initially
startGame();