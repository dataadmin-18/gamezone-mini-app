// ==========================================
// GAME ZONE - Telegram Mini App
// Slots Demo Game
// ==========================================

const tg = window.Telegram.WebApp;


// ==========================================
// RENDER BACKEND
// ==========================================

const API_URL =
    "https://gamezone-backend-1-luwe.onrender.com";


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
let currentGame = null;
let spinning = false;


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
// LOAD USER
// ==========================================

async function loadUser() {

    const user = getTelegramUser();

    if (!user) {

        console.log(
            "Telegram user information not available."
        );

        updateBalance();

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/user`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    initData:
                        tg.initData

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

        } else {

            console.error(
                data.error
            );
        }

    } catch (error) {

        console.error(
            "Backend connection error:",
            error
        );

        updateBalance();
    }
}


// ==========================================
// UPDATE BALANCE
// ==========================================

function updateBalance() {

    const elements =
        document.querySelectorAll(
            "#balance, #userBalance, .balance"
        );

    elements.forEach(
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

    currentGame = game;

    if (game === "slots") {

        openSlots();

        return;
    }

    if (game === "mines") {

    openMines();

    return;
    }


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
// SLOTS INTERFACE
// ==========================================

function openSlots() {

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


    if (!modal) {

        alert(
            "Slots modal not found."
        );

        return;
    }


    if (icon) {

        icon.textContent =
            "🎰";
    }


    if (title) {

        title.textContent =
            "Slots";
    }


    if (text) {

        text.innerHTML = `

            <div class="slots-game">

                <div
                    id="slotsReels"
                    class="slots-reels"
                >

                    <div class="slot-symbol">
                        ❔
                    </div>

                    <div class="slot-symbol">
                        ❔
                    </div>

                    <div class="slot-symbol">
                        ❔
                    </div>

                </div>


                <div
                    id="slotsMessage"
                    class="slots-message"
                >
                    Choose your demo bet.
                </div>


                <div class="slots-bets">

                    <button
                        onclick="setSlotsBet(10)"
                        class="slot-bet"
                    >
                        10
                    </button>

                    <button
                        onclick="setSlotsBet(50)"
                        class="slot-bet"
                    >
                        50
                    </button>

                    <button
                        onclick="setSlotsBet(100)"
                        class="slot-bet"
                    >
                        100
                    </button>

                    <button
                        onclick="setSlotsBet(500)"
                        class="slot-bet"
                    >
                        500
                    </button>

                </div>


                <div class="slots-selected">

                    Bet:

                    <strong id="selectedSlotsBet">
                        10
                    </strong>

                    credits

                </div>


                <button
                    id="spinSlotsButton"
                    onclick="spinSlots()"
                    class="slots-spin-button"
                >
                    🎰 SPIN
                </button>

            </div>

        `;
    }


    modal.style.display =
        "flex";


    window.selectedSlotsBet =
        10;
}




// ==========================================
// MINES INTERFACE
// ==========================================

function openMines() {

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


    if (!modal) {

        alert(
            "Mines modal not found."
        );

        return;
    }


    if (icon) {

        icon.textContent =
            "💣";
    }


    if (title) {

        title.textContent =
            "Mines";
    }


    if (text) {

        text.innerHTML = `

            <div class="mines-game">

                <div
                    id="minesMessage"
                    class="mines-message"
                >
                    Choose your demo bet and
                    number of mines.
                </div>


                <div class="mines-settings">

                    <div class="mines-setting">

                        <label>
                            Demo Bet
                        </label>

                        <select
                            id="minesBet"
                        >

                            <option value="10">
                                10 credits
                            </option>

                            <option value="50">
                                50 credits
                            </option>

                            <option value="100">
                                100 credits
                            </option>

                            <option value="500">
                                500 credits
                            </option>

                        </select>

                    </div>


                    <div class="mines-setting">

                        <label>
                            Mines
                        </label>

                        <select
                            id="minesCount"
                        >

                            <option value="3">
                                3 mines
                            </option>

                            <option
                                value="5"
                                selected
                            >
                                5 mines
                            </option>

                            <option value="7">
                                7 mines
                            </option>

                            <option value="10">
                                10 mines
                            </option>

                        </select>

                    </div>

                </div>


                <button
                    id="startMinesButton"
                    onclick="startMines()"
                    class="mines-start-button"
                >
                    💣 START MINES
                </button>


                <div
                    id="minesTestResult"
                    class="mines-test-result"
                >
                </div>

            </div>

        `;
    }


    modal.style.display =
        "flex";
}


// ==========================================
// START MINES GAME
// ==========================================

async function startMines() {

    const betElement =
        document.getElementById(
            "minesBet"
        );

    const minesElement =
        document.getElementById(
            "minesCount"
        );

    const button =
        document.getElementById(
            "startMinesButton"
        );

    const message =
        document.getElementById(
            "minesMessage"
        );

    const result =
        document.getElementById(
            "minesTestResult"
        );


    if (
        !betElement ||
        !minesElement
    ) {

        return;
    }


    const bet =
        Number(
            betElement.value
        );


    const mineCount =
        Number(
            minesElement.value
        );


    // --------------------------------------
    // BASIC FRONTEND CHECK
    // --------------------------------------

    if (bet <= 0) {

        alert(
            "Please select a valid demo bet."
        );

        return;
    }


    if (
        mineCount < 1 ||
        mineCount > 20
    ) {

        alert(
            "Invalid mine count."
        );

        return;
    }


    // --------------------------------------
    // TELEGRAM AUTH CHECK
    // --------------------------------------

    if (!tg.initData) {

        alert(
            "Telegram authentication data is unavailable."
        );

        return;
    }


    // --------------------------------------
    // DISABLE BUTTON
    // --------------------------------------

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "💣 STARTING...";
    }


    if (message) {

        message.textContent =
            "Creating your Mines game...";
    }


    if (result) {

        result.textContent =
            "";
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/game/mines/start`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        initData:
                            tg.initData,

                        bet_amount:
                            bet,

                        mine_count:
                            mineCount

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Mines start response:",
            data
        );


        if (!response.ok) {

            throw new Error(

                data.error ||
                `HTTP ${response.status}`

            );

        }


        if (!data.success) {

            throw new Error(

                data.error ||
                "Could not start Mines."

            );

        }


        // ----------------------------------
        // SAVE GAME INFORMATION
        // ----------------------------------

        window.currentMinesGame = {

            game_id:
                data.game_id,

            bet:
                data.bet,

            mine_count:
                data.mine_count,

            grid_size:
                data.grid_size,

            multiplier:
                data.multiplier,

            potential_win:
                data.potential_win

        };


        // ----------------------------------
        // UPDATE BALANCE
        // ----------------------------------

        balance =
            Number(
                data.balance
            );


        updateBalance();


        // ----------------------------------
        // DISPLAY SUCCESS
        // ----------------------------------

        if (message) {

            message.innerHTML =

                "✅ Mines game started!<br>" +

                "Bet: " +
                data.bet +
                " credits<br>" +

                "Mines: " +
                data.mine_count;

        }


        if (result) {

            result.innerHTML =

                "Game ID: " +
                data.game_id +
                "<br>" +

                "Balance: " +
                Number(
                    data.balance
                ).toLocaleString() +
                " credits<br><br>" +

                "Server successfully created " +
                "your hidden Mines board.";

        }


        console.log(
            "Mines game created:",
            window.currentMinesGame
        );


    } catch (error) {

        console.error(
            "Mines start error:",
            error
        );


        if (message) {

            message.textContent =
                error.message;

        }


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "💣 START MINES";

        }

    }
            }


// ==========================================
// SELECT SLOTS BET
// ==========================================

function setSlotsBet(amount) {

    if (spinning) {

        return;
    }


    window.selectedSlotsBet =
        amount;


    const element =
        document.getElementById(
            "selectedSlotsBet"
        );


    if (element) {

        element.textContent =
            amount;
    }


    const message =
        document.getElementById(
            "slotsMessage"
        );


    if (message) {

        message.textContent =
            `Selected bet: ${amount} credits`;
    }
}


// ==========================================
// SPIN SLOTS
// ==========================================

async function spinSlots() {

    if (spinning) {

        return;
    }


    const bet =
        Number(
            window.selectedSlotsBet || 10
        );


    if (bet <= 0) {

        alert(
            "Please select a valid bet."
        );

        return;
    }


    if (balance < bet) {

        alert(
            "Insufficient demo balance."
        );

        return;
    }


    if (!tg.initData) {

        alert(
            "Telegram authentication data is unavailable."
        );

        return;
    }


    spinning = true;


    const button =
        document.getElementById(
            "spinSlotsButton"
        );


    const message =
        document.getElementById(
            "slotsMessage"
        );


    const reels =
        document.getElementById(
            "slotsReels"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "🎰 SPINNING...";
    }


    if (message) {

        message.textContent =
            "The reels are spinning...";
    }


    if (reels) {

        reels.innerHTML = `

            <div class="slot-symbol">
                🎰
            </div>

            <div class="slot-symbol">
                🎰
            </div>

            <div class="slot-symbol">
                🎰
            </div>

        `;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/game/slots`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        initData:
                            tg.initData,

                        bet_amount:
                            bet

                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Slots response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                `HTTP ${response.status}`
            );
        }


        if (!data.success) {

            throw new Error(
                data.error ||
                "Slots game failed."
            );
        }


        // ------------------------------
        // DISPLAY RESULT
        // ------------------------------

        if (reels) {

            reels.innerHTML = `

                <div class="slot-symbol">
                    ${data.symbols[0]}
                </div>

                <div class="slot-symbol">
                    ${data.symbols[1]}
                </div>

                <div class="slot-symbol">
                    ${data.symbols[2]}
                </div>

            `;
        }


        // ------------------------------
        // UPDATE BALANCE FROM SERVER
        // ------------------------------

        balance =
            Number(
                data.balance
            );


        updateBalance();


        // ------------------------------
        // RESULT MESSAGE
        // ------------------------------

        if (message) {

            if (data.win > 0) {

                message.innerHTML =
                    `🎉 You won <strong>${data.win}</strong> credits!`;

            } else {

                message.innerHTML =
                    `No win this time. Bet: ${data.bet} credits.`;

            }
        }


    } catch (error) {

        console.error(
            "Slots error:",
            error
        );


        if (message) {

            message.textContent =
                error.message;
        }


    } finally {

        spinning =
            false;


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "🎰 SPIN";
        }
    }
}


// ==========================================
// CLOSE GAME
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


    spinning =
        false;
}


// ==========================================
// DEMO PLAY BUTTON
// ==========================================

function playDemo() {

    if (currentGame === "slots") {

        spinSlots();

        return;
    }


    alert(
        "Demo mode\n\n" +
        "This game will be added next."
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
// DEMO COINS
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
// CLOSE MODAL OUTSIDE
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
