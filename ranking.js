const url = "https://memorama-a3310-default-rtdb.firebaseio.com/Ranking.json";

document.addEventListener("DOMContentLoaded", () => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const rankingData = transformData(data);
            displayRanking(rankingData);
        })
        .catch((error) => {
            console.error("Error al cargar el ranking:", error);
        });
});

function transformData(data) {
    // Aquí puedes transformar los datos según tus necesidades
    // Por ejemplo, ordenarlos, filtrarlos, etc.
    const transformedData = Object.keys(data).map((key) => data[key]);
    transformedData.sort((a, b) => a.Tiempo - b.Tiempo);
    return transformedData;
}

function displayRanking(data) {
    const rankingTable = document.getElementById("ranking-data");
    data.forEach((entry, index) => {
        const row = document.createElement("tr");
        const positionCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const timeCell = document.createElement("td");
        positionCell.textContent = index + 1;
        nameCell.textContent = entry.Nombre;
        timeCell.textContent = entry.Tiempo;
        row.appendChild(positionCell);
        row.appendChild(nameCell);
        row.appendChild(timeCell);
        rankingTable.appendChild(row);
    });
}