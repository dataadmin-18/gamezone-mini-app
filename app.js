// ========================================
// TELEGRAM MINI APP
// ========================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ========================================
// USER INFORMATION
// ========================================

let telegramUser = null;

if (
    tg.initDataUnsafe &&
    tg.initDataUnsafe.user
) {
    telegramUser = tg.initDataUnsafe.user;

    const usernameElement =
        document.getElementById("username");

    if (
        usernameElement &&
        telegramUser.first_name
    ) {
        usernameElement.textContent =
            telegramUser.first_name;
    }
}


// ========================================
// DEMO BALANCE
// ========================================

let balance = 10000;

function updateBalance() {

    const element =
        document.getElementById("balance");

    if (element) {
        element.textContent =
            balance.toLocaleString();
    }
}


// ========================================
// ADD DEMO COINS
// ========================================

function showDemoBalance() {

    balance += 1000;

    updateBalance();

    if (typeof tg.showAlert === "function") {

        tg.showAlert(
            "1,000 demo coins added!"
        );

    } else {

        alert("1,000 demo coins added!");

    }
}


// ========================================
// OPEN GAME
// ========================================

function openGame(game) {

    const modal =
        document.getElementById("gameModal");

    const title =
        document.getElementById("gameTitle");

    const icon =
        document.getElementById("gameIcon");

    const text =
        document.getElementById("gameText");


    if (!modal || !title || !icon || !text) {

        alert(
            "Game modal elements were not found."
        );

        return;
    }


    const games = {

        slots: {
            title: "Slots",
            icon: "🎰",
            text: "A demo slot game will be added here."
        },

        mines: {
            title: "Mines",
            icon: "💣",
            text: "A demo Mines game will be added here."
        },

        keno: {
            title: "Keno",
            icon: "🎯",
            text: "A demo Keno game will be added here."
        },

        bingo: {
            title: "Bingo",
            icon: "🎱",
            text: "A demo Bingo game will be added here."
        },

        wheel: {
            title: "Wheel",
            icon: "🎡",
            text: "A demo Wheel game will be added here."
        },

        aviator: {
            title: "Aviator",
            icon: "✈️",
            text: "A demo flight game will be added here."
        }

    };


    const selected =
        games[game];


    if (!selected) {

        alert(
            "Unknown game: " + game
        );

        return;
    }


    title.textContent =
        selected.title;

    icon.textContent =
        selected.icon;

    text.textContent =
        selected.text;


    modal.classList.remove("hidden");

}


// ========================================
// CLOSE GAME
// ========================================

function closeGame() {

    const modal =
        document.getElementById("gameModal");

    if (modal) {

        modal.classList.add("hidden");

    }
}


// ========================================
// START DEMO GAME
// ========================================

function startDemoGame() {

    if (typeof tg.showAlert === "function") {

        tg.showAlert(
            "The game engine will be connected in the next stage."
        );

    } else {

        alert(
            "The game engine will be connected in the next stage."
        );

    }
}


// ========================================
// NAVIGATION
// ========================================

function showHome() {

    if (typeof tg.showAlert === "function") {

        tg.showAlert("Home");

    } else {

        alert("Home");

    }
}


function showGames() {

    if (typeof tg.showAlert === "function") {

        tg.showAlert("Games");

    } else {

        alert("Games");

    }
}


function showHistory() {

    if (typeof tg.showAlert === "function") {

        tg.showAlert(
            "Game history will be added later."
        );

    } else {

        alert(
            "Game history will be added later."
        );

    }
}


function showProfile() {

    let message =
        "Player Profile\n\n";


    if (telegramUser) {

        message +=
            "Name: " +
            (
                telegramUser.first_name ||
                "Player"
            );

    } else {

        message +=
            "Telegram user information is not available.";

    }


    if (typeof tg.showAlert === "function") {

        tg.showAlert(message);

    } else {

        alert(message);

    }
}


// ========================================
// INITIALIZE
// ========================================

updateBalance();