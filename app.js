// ==========================================
// GAME ZONE - Telegram Mini App
// Frontend + Flask API connection
// ==========================================

const tg = window.Telegram.WebApp;

// Local Flask API for testing on this phone
const API_URL = "http://127.0.0.1:5000";

tg.ready();
tg.expand();

let balance = 10000;
let currentUser = null;


// ==========================================
// TELEGRAM USER
// ==========================================

function getTelegramUser() {
    return tg.initDataUnsafe && tg.initDataUnsafe.user
        ? tg.initDataUnsafe.user
        : null;
}


// ==========================================
// LOAD USER FROM FLASK / SQLITE
// ==========================================

async function loadUser() {

    const user = getTelegramUser();

    // If Telegram user information isn't available,
    // keep the demo balance.
    if (!user) {
        console.log("Telegram user information not available.");
        updateBalance();
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/user`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                telegram_id: user.id,
                username: user.username || "",
                first_name: user.first_name || "",
                last_name: user.last_name || ""
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("User API response:", data);

        if (data.success) {

            currentUser = data.user;

            balance = Number(data.user.balance);

            updateBalance();

            console.log("Database balance:", balance);

        } else {

            console.error("User API returned an error:", data);

        }

    } catch (error) {

        console.error("Could not connect to Flask API:", error);

        // Keep the frontend demo balance if API isn't available.
        updateBalance();
    }
}


// ==========================================
// UPDATE BALANCE ON SCREEN
// ==========================================

function updateBalance() {

    const balanceElements = document.querySelectorAll(
        "#balance, #userBalance, .balance"
    );

    balanceElements.forEach(element => {

        element.textContent =
            Number(balance).toLocaleString();

    });

    console.log("Current balance:", balance);
}


// ==========================================
// GAME MODAL
// ==========================================

function openGame(game) {

    const modal = document.getElementById("gameModal");
    const icon = document.getElementById("gameIcon");
    const title = document.getElementById("gameTitle");
    const text = document.getElementById("gameText");

    if (!modal || !title || !text) {
        alert("Game: " + game);
        return;
    }

    const games = {

        slots: {
            icon: "🎰",
            title: "Slots",
            text: "Spin the reels and try your luck!"
        },

        mines: {
            icon: "💣",
            title: "Mines",
            text: "Find the safe tiles and avoid the mines!"
        },

        keno: {
            icon: "🎱",
            title: "Keno",
            text: "Pick your numbers and see what you win!"
        },

        bingo: {
            icon: "🎯",
            title: "Bingo",
            text: "Match the numbers and complete your card!"
        },

        wheel: {
            icon: "🎡",
            title: "Wheel",
            text: "Spin the wheel and see where it lands!"
        },

        aviator: {
            icon: "✈️",
            title: "Aviator",
            text: "Watch the multiplier rise and cash out before it crashes!"
        }

    };

    const selectedGame = games[game];

    if (!selectedGame) {
        title.textContent = "Game";
        text.textContent = "Game not found.";
        return;
    }

    if (icon) {
        icon.textContent = selectedGame.icon;
    }

    title.textContent = selectedGame.title;
    text.textContent = selectedGame.text;

    modal.style.display = "flex";
}


// ==========================================
// CLOSE GAME MODAL
// ==========================================

function closeGame() {

    const modal = document.getElementById("gameModal");

    if (modal) {
        modal.style.display = "none";
    }
}


// ==========================================
// DEMO PLAY BUTTON
// ==========================================

function playDemo() {

    alert(
        "Demo mode\n\n" +
        "Game functionality will be added next."
    );
}


// ==========================================
// NAVIGATION
// ==========================================

function showPage(page) {

    console.log("Navigation:", page);

    alert(
        page.charAt(0).toUpperCase() +
        page.slice(1) +
        " section"
    );
}


// ==========================================
// DEMO COIN INCREMENT
// ==========================================

function addDemoCoins() {

    balance += 100;

    updateBalance();

    console.log(
        "Demo balance increased:",
        balance
    );
}


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function(event) {

    const modal = document.getElementById("gameModal");

    if (modal && event.target === modal) {
        closeGame();
    }

});


// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    console.log("Game Zone Mini App started.");

    updateBalance();

    loadUser();

});