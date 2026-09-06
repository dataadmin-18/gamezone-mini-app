// ========================================
// TELEGRAM MINI APP
// ========================================

const tg = window.Telegram.WebApp;


// Tell Telegram that the Mini App is ready
tg.ready();


// Expand the Mini App
tg.expand();


// ========================================
// USER INFORMATION
// ========================================

let telegramUser = null;

if (
    tg.initDataUnsafe &&
    tg.initDataUnsafe.user
) {

    telegramUser =
        tg.initDataUnsafe.user;

    const usernameElement =
        document.getElementById(
            "username"
        );

    if (
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
        document.getElementById(
            "balance"
        );

    element.textContent =
        balance.toLocaleString();

}


// ========================================
// ADD DEMO COINS
// ========================================

function showDemoBalance() {

    balance += 1000;

    updateBalance();

    tg.showAlert(
        "1,000 demo coins added!"
    );

}


// ========================================
// OPEN GAME
// ========================================

function openGame(game) {

    const modal =
        document.getElementById(
            "gameModal"
        );

    const title =
        document.getElementById(
            "gameTitle"
        );

    const icon =
        document.getElementById(
            "gameIcon"
        );

    const text =
        document.getElementById(
            "gameText"
        );


    const games = {

        slots: {
            title: "Slots",
            icon: "🎰",
            text:
                "A demo slot game will be added here."
        },

        mines: {
            title: "Mines",
            icon: "💣",
            text:
                "A demo Mines game will be added here."
        },

        keno: {
            title: "Keno",
            icon: "🎯",
            text:
                "A demo Keno game will be added here."
        },

        bingo: {
            title: "Bingo",
            icon: "🎱",
            text:
                "A demo Bingo game will be added here."
        },

        wheel: {
            title: "Wheel",
            icon: "🎡",
            text:
                "A demo Wheel game will be added here."
        },

        aviator: {
            title: "Aviator",
            icon: "✈️",
            text:
                "A demo flight game will be added here."
        }

    };


    const selected =
        games[game];

    if (!selected) {
        return;
    }


    title.textContent =
        selected.title;

    icon.textContent =
        selected.icon;

    text.textContent =
        selected.text;


    modal.classList.remove(
        "hidden"
    );

}


// ========================================
// CLOSE GAME
// ========================================

function closeGame() {

    document
        .getElementById("gameModal")
        .classList.add("hidden");

}


// ========================================
// START DEMO GAME
// ========================================

function startDemoGame() {

    tg.showAlert(
        "The game engine will be connected in the next stage."
    );

}


// ========================================
// NAVIGATION
// ========================================

function showHome() {

    tg.showAlert(
        "Home"
    );

}


function showGames() {

    tg.showAlert(
        "Games"
    );

}


function showHistory() {

    tg.showAlert(
        "Game history will be added later."
    );

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

    tg.showAlert(
        message
    );

}


// ========================================
// INITIALIZE
// ========================================

updateBalance();