// ==========================================
// GAME ZONE - Telegram Mini App
// Frontend + Flask API connection
// Secure Telegram authentication
// ==========================================


const tg = window.Telegram.WebApp;


// ==========================================
// RENDER BACKEND
// ==========================================

const API_URL =
    "https://gamezone-backend-9qek.onrender.com";


// ==========================================
// TELEGRAM INITIALIZATION
// ==========================================

tg.ready();
tg.expand();


// ==========================================
// APPLICATION VARIABLES
// ==========================================

let balance = 10000;

let currentUser = null;


// ==========================================
// GET TELEGRAM USER
// ==========================================

function getTelegramUser() {

    if (
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user
    ) {

        return tg.initDataUnsafe.user;

    }

    return null;
}


// ==========================================
// LOAD USER FROM BACKEND
// ==========================================

async function loadUser() {

    const user = getTelegramUser();

    // If the Mini App is opened outside Telegram,
    // Telegram authentication data will not exist.
    if (!user) {

        console.log(
            "Telegram user information not available."
        );

        updateBalance();

        return;
    }


    try {

        console.log(
            "Connecting to Game Zone backend..."
        );


        const response = await fetch(
            `${API_URL}/api/user`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    // IMPORTANT:
                    // Send Telegram's signed initData.
                    initData: tg.initData

                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "User API response:",
            data
        );


        if (data.success) {

            currentUser =
                data.user;


            balance =
                Number(
                    data.user.balance
                );


            updateBalance();


            console.log(
                "Database balance:",
                balance
            );


        } else {

            console.error(
                "User API returned an error:",
                data.error
            );

        }


    } catch (error) {

        console.error(
            "Could not connect to Game Zone backend:",
            error
        );


        // Keep demo balance if backend
        // is temporarily unavailable.
        updateBalance();

    }
}


// ==========================================
// UPDATE BALANCE ON SCREEN
// ==========================================

function updateBalance() {

    const balanceElements =
        document.querySelectorAll(
            "#balance, #userBalance, .balance"
        );


    balanceElements.forEach(
        function(element) {

            element.textContent =
                Number(
                    balance
                ).toLocaleString();

        }
    );


    console.log(
        "Current balance:",
        balance
    );
}


// ==========================================
// GAME MODAL
// ==========================================

function openGame(game) {

    const modal =
        document.getElementById(
            "gameModal"
        );

    const icon =
        document.getElementById(
            "gameIcon"
        );

    const title =
        document.getElementById(
            "gameTitle"
        );

    const text =
        document.getElementById(
            "gameText"
        );


    if (
        !modal ||
        !title ||
        !text
    ) {

        alert(
            "Game: " + game
        );

        return;
    }


    const games = {

        slots: {

            icon: "🎰",

            title: "Slots",

            text:
                "Spin the reels and try your luck!"

        },


        mines: {

            icon: "💣",

            title: "Mines",

            text:
                "Find the safe tiles and avoid the mines!"

        },


        keno: {

            icon: "🎱",

            title: "Keno",

            text:
                "Pick your numbers and see what you win!"

        },


        bingo: {

            icon: "🎯",

            title: "Bingo",

            text:
                "Match the numbers and complete your card!"

        },


        wheel: {

            icon: "🎡",

            title: "Wheel",

            text:
                "Spin the wheel and see where it lands!"

        },


        aviator: {

            icon: "✈️",

            title: "Aviator",

            text:
                "Watch the multiplier rise and cash out before it crashes!"

        }

    };


    const selectedGame =
        games[game];


    if (!selectedGame) {

        title.textContent =
            "Game";

        text.textContent =
            "Game not found.";

        return;
    }


    if (icon) {

        icon.textContent =
            selectedGame.icon;

    }


    title.textContent =
        selectedGame.title;


    text.textContent =
        selectedGame.text;


    modal.style.display =
        "flex";
}


// ==========================================
// CLOSE GAME MODAL
// ==========================================

function closeGame() {

    const modal =
        document.getElementById(
            "gameModal"
        );


    if (modal) {

        modal.style.display =
            "none";

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

    console.log(
        "Navigation:",
        page
    );


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

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "gameModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeGame();

        }

    }
);


// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "Game Zone Mini App started."
        );


        updateBalance();


        loadUser();

    }
);