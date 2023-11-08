const button4x3 = document.getElementById("btn4x3");
const button4x4 = document.getElementById("btn4x4");
const button5x4 = document.getElementById("btn4x5");
const resetButton = document.getElementById("resetButton");
const newGameButton = document.getElementById("newGameButton");
const dimensionButtonsContainer = document.getElementById("dimensionButtons");
const gameContainer = document.querySelector('.memory-game');
let numRows = 4;
let numCols = 3;
let cardDeck = [];
let isCardFlipped = false;
let isBoardLocked = false;
let firstFlippedCard, secondFlippedCard;
let startTime = null;
let elapsedTime = 0;
let intervalId = null;
let url="https://memorama-a3310-default-rtdb.firebaseio.com/Ranking";
button4x3.addEventListener("click", () => changeBoardSize(4, 3));
button4x4.addEventListener("click", () => changeBoardSize(4, 4));
button5x4.addEventListener("click", () => changeBoardSize(4, 5));
resetButton.addEventListener("click", resetGame);
newGameButton.addEventListener("click", startNewGame);


initializeGameBoard(numRows, numCols);
async function Submmitscore(){
    let player=window.prompt();
    let time=elapsedTime;
    let mode=numCols;
    try {
            let jugador = {
                Nombre : player,
                Tiempo : time,
                Modo : mode,
            };
            const config= {
                method:'POST',
                body : JSON.stringify(jugador),
                headers: {'Content-type' : 'application/json; charset=UTF-8'}
            }
            const response = await fetch(`${url}.json`,config);
            const data = await response.json();
    } catch (error) {
            console.error("Error",error);
    }
    window.alert("Puntuacion enviada");
    
}

window.onload = function() {
    Score("tabla4x3");
};

function Score(tabid) {
    tid = tabid;
    consultarAsync();
}

/*function renderTable(data) {
    console.log(data);
    let tbody = document.getElementById("HS");
    let rowHTML = "";
    let arreglo = [];

    Object.keys(data).forEach(key => {
        console.log(data[key]);
        if (data[key].Modo === tid) { // Corregido el uso de ${} innecesario
            arreglo.push([data[key].Tiempo, data[key].Nombre]); // Corregido el uso de ${} innecesario
        }
    });
    console.log(arreglo);
    arreglo.sort(sortFunction);

    for (let i = 0; i < arreglo.length; i++) {
        rowHTML += `<tr>
        <td>${arreglo[i][1]}</td>
        <td>${arreglo[i][0]}</td>
    </tr>`;
    }

    console.log(rowHTML);
    tbody.innerHTML = rowHTML;
}*/

function rendertable(data){
    console.log(data);
    let tbody=document.getElementById("HS");
    let rowHTML ="";
    var arreglo=[];
    Object.keys(data).forEach(key =>{
        console.log(data[key]);
        if(data[key].Modo === tid){
            arreglo.push([data[key].Tiempo,data[key].Nombre]);
        }
    });
    console.log(arreglo);
    arreglo.sort(sortFunction);
    for(let i=0;i<arreglo.length;i++){
        rowHTML += `<tr>
        <td>${arreglo[i][1]}</td>
        <td>${arreglo[i][0]}</td>
    </tr>`;
    }
    console.log(rowHTML);
    tbody.innerHTML =rowHTML;
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

async function consultarAsync() {
    try {
        const response = await fetch(`${url}.json`); 
        const alumnos = await response.json();
        rendertable(alumnos);
        console.log("hola mundo");
    } catch (error) {
        console.error("Error", error);
    }
}

function changeBoardSize(newRows, newCols) {
    initializeGameBoard(newRows, newCols);
}

function initializeGameBoard(newRows, newCols) {
    cardDeck = [];
    gameContainer.innerHTML = "";

    const totalCards = newRows * newCols;

    for (let i = 1; i <= totalCards / 2; i++) {
        createMemoryCard(i);
        createMemoryCard(i);
    }

    cardDeck = shuffleMemoryCards(cardDeck);
    createGameBoard(newRows, newCols);

    // Iniciar el cronómetro
    startTime = null;
    clearInterval(intervalId);
    elapsedTime = 0;
}

function resetGame() {    
    hideAllCards();

    // Detener y reiniciar el cronómetro
    clearInterval(intervalId);
    startTime = null;
    elapsedTime = 0;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "Tiempo: 0 segundos";
}

function startNewGame() {
    // Puedes cambiar las dimensiones del nuevo juego aquí
    initializeGameBoard(numRows, numCols);
}

function createGameBoard(newRows, newCols) {
    gameContainer.style.gridTemplateColumns = `repeat(${newCols}, 150px)`;
    gameContainer.style.gridTemplateRows = `repeat(${newRows}, 150px)`;

    cardDeck.forEach(card => gameContainer.appendChild(card));
    startTime = null;
    elapsedTime = 0;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "Tiempo: 0 segundos";
}

function createMemoryCard(number) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    setCardStyle(card);
    card.dataset.cardNumber = number;
    card.addEventListener('click', () => flipMemoryCard(card));
    cardDeck.push(card);
}

function flipMemoryCard(card) {
    if (!startTime) {
        startTime = new Date().getTime();
        intervalId = setInterval(updateTimer, 1000);
    }

    if (isBoardLocked || card === firstFlippedCard || card.classList.contains('matched')) return;

    card.classList.add('flipped');

    if (!isCardFlipped) {
        isCardFlipped = true;
        firstFlippedCard = card;
        setCardStyle(card);
    } else {
        secondFlippedCard = card;
        setCardStyle(card);
        checkForCardMatch();
    }
}


function checkForCardMatch() {
    if (firstFlippedCard.dataset.cardNumber === secondFlippedCard.dataset.cardNumber) {
        disableMatchedCards();
    } else {
        unflipMismatchedCards();
    }
}

function disableMatchedCards() {
    firstFlippedCard.removeEventListener('click', () => flipMemoryCard(firstFlippedCard));
    secondFlippedCard.removeEventListener('click', () => flipMemoryCard(secondFlippedCard));
    firstFlippedCard.classList.add('matched');
    secondFlippedCard.classList.add('matched');
    resetGameBoard();    
    setTimeout(() => {
        isGameComplete()
    }, 500); ;
}

function unflipMismatchedCards() {
    isBoardLocked = true;
    setTimeout(() => {
        firstFlippedCard.classList.remove('flipped');
        secondFlippedCard.classList.remove('flipped');
        setCardStyle(firstFlippedCard);
        setCardStyle(secondFlippedCard);
        resetGameBoard();
    }, 1000);
}

function resetGameBoard() {
    [isCardFlipped, isBoardLocked] = [false, false];
    [firstFlippedCard, secondFlippedCard] = [null, null];
}

function setCardStyle(card) {
    if (!card.classList.contains('flipped') || card.classList.contains('matched')) {
        card.style.backgroundImage = `url('img/tarjeta.jpg')`;
    } else {
        card.style.backgroundImage = `url('img/${card.dataset.cardNumber}.jpg')`;
    }
}

function shuffleMemoryCards(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function hideAllCards() {
    const allCards = document.querySelectorAll('.memory-card');
    allCards.forEach(card => {
        card.classList.remove('flipped');
        card.classList.remove('matched');
        setCardStyle(card);
    });
}
function isGameComplete() {
    const matchedCards = document.querySelectorAll('.memory-card.matched');
    if (matchedCards.length === cardDeck.length){
        alert("¡Felicidades, Ganaste!");   
    }
    else{}
}
function startNewGame() {
    initializeGameBoard(numRows, numCols);

    // reset el cronómetro

    startTime = null;
    clearInterval(intervalId);
    elapsedTime = 0;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "Tiempo: 0 segundos";
}

function updateTimer() {
    const currentTime = new Date().getTime();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Tiempo: ${elapsedTime} segundos`;
}
function isGameComplete() {
    const matchedCards = document.querySelectorAll('.memory-card.matched');
    if (matchedCards.length === cardDeck.length) {
        clearInterval(intervalId); // Detener el cronómetro
        Submmitscore();
        alert(`¡Felicidades, Ganaste! Tu tiempo fue de ${elapsedTime} segundos`);
    }
}
