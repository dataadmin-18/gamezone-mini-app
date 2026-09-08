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

window.currentMinesGame = null;
window.minesBusy = false;


// ==========================================
// OPEN MINES
// ==========================================

function openMines() {

    const modal =
        document.getElementById("gameModal");

    const icon =
        document.getElementById("gameIcon");

    const title =
        document.getElementById("gameTitle");

    const text =
        document.getElementById("gameText");


    if (!modal || !text) {

        alert("Mines modal not found.");

        return;
    }


    if (icon) {
        icon.textContent = "💣";
    }


    if (title) {
        title.textContent = "Mines";
    }


    renderMinesStartScreen();

    modal.style.display = "flex";
}


// ==========================================
// MINES START SCREEN
// ==========================================

function renderMinesStartScreen() {

    const text =
        document.getElementById("gameText");

    if (!text) {
        return;
    }


    text.innerHTML = `

        <div
            class="mines-game"
            style="
                width:100%;
                max-width:420px;
                margin:0 auto;
            "
        >

            <div
                id="minesMessage"
                style="
                    text-align:center;
                    margin-bottom:15px;
                    font-weight:bold;
                "
            >
                Choose your demo bet and number of mines.
            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-bottom:15px;
                "
            >

                <div style="flex:1;">

                    <label
                        style="
                            display:block;
                            margin-bottom:6px;
                            font-weight:bold;
                        "
                    >
                        Demo Bet
                    </label>

                    <select
                        id="minesBet"
                        style="
                            width:100%;
                            padding:10px;
                            border-radius:8px;
                            box-sizing:border-box;
                        "
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


                <div style="flex:1;">

                    <label
                        style="
                            display:block;
                            margin-bottom:6px;
                            font-weight:bold;
                        "
                    >
                        Mines
                    </label>

                    <select
                        id="minesCount"
                        style="
                            width:100%;
                            padding:10px;
                            border-radius:8px;
                            box-sizing:border-box;
                        "
                    >

                        <option value="3">
                            3 mines
                        </option>

                        <option value="5" selected>
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
                style="
                    width:100%;
                    padding:13px;
                    border:0;
                    border-radius:10px;
                    cursor:pointer;
                    font-weight:bold;
                    font-size:16px;
                "
            >
                💣 START MINES
            </button>

        </div>

    `;
}


// ==========================================
// START MINES GAME
// ==========================================

async function startMines() {

    if (window.minesBusy) {
        return;
    }


    const betElement =
        document.getElementById("minesBet");

    const minesElement =
        document.getElementById("minesCount");

    const button =
        document.getElementById("startMinesButton");

    const message =
        document.getElementById("minesMessage");


    if (!betElement || !minesElement) {
        return;
    }


    const bet =
        Number(betElement.value);

    const mineCount =
        Number(minesElement.value);


    if (bet <= 0) {

        alert(
            "Please select a valid demo bet."
        );

        return;
    }


    if (mineCount < 1 || mineCount > 20) {

        alert(
            "Invalid mine count."
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


    window.minesBusy = true;


    if (button) {

        button.disabled = true;

        button.textContent =
            "💣 STARTING...";
    }


    if (message) {

        message.textContent =
            "Creating your Mines game...";
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


        window.currentMinesGame = {

            game_id:
                Number(data.game_id),

            bet:
                Number(data.bet),

            mine_count:
                Number(data.mine_count),

            grid_size:
                Number(data.grid_size),

            multiplier:
                Number(data.multiplier),

            potential_win:
                Number(data.potential_win),

            revealed:
                [],

            status:
                "active"

        };


        balance =
            Number(data.balance);

        updateBalance();


        renderMinesBoard();


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

        window.minesBusy = false;


        if (button) {

            button.disabled = false;

            button.textContent =
                "💣 START MINES";
        }

    }
}


// ==========================================
// RENDER MINES BOARD
// ==========================================

function renderMinesBoard() {

    const text =
        document.getElementById("gameText");

    const game =
        window.currentMinesGame;


    if (!text || !game) {
        return;
    }


    text.innerHTML = `

        <div
            class="mines-game"
            style="
                width:100%;
                max-width:420px;
                margin:0 auto;
            "
        >

            <div
                id="minesMessage"
                style="
                    text-align:center;
                    margin-bottom:12px;
                    font-weight:bold;
                "
            >
                💣 Find the safe tiles!
            </div>


            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:8px;
                    margin-bottom:12px;
                    text-align:center;
                "
            >

                <div style="flex:1;">

                    <small>Bet</small>

                    <br>

                    <strong id="minesBetDisplay">
                        ${game.bet}
                    </strong>

                </div>


                <div style="flex:1;">

                    <small>Multiplier</small>

                    <br>

                    <strong id="minesMultiplier">
                        ${game.multiplier.toFixed(2)}x
                    </strong>

                </div>


                <div style="flex:1;">

                    <small>Potential Win</small>

                    <br>

                    <strong id="minesPotentialWin">
                        ${Number(game.potential_win).toLocaleString()}
                    </strong>

                </div>

            </div>


            <div
                id="minesStatus"
                style="
                    text-align:center;
                    margin-bottom:12px;
                    font-size:13px;
                    opacity:.8;
                "
            >
                Revealed: 0
            </div>


            <div
                id="minesGrid"
                style="
                    display:grid;
                    grid-template-columns:repeat(5,1fr);
                    gap:7px;
                    width:100%;
                    max-width:360px;
                    margin:0 auto 15px;
                "
            >
            </div>


            <button
                id="cashoutMinesButton"
                onclick="cashoutMines()"
                disabled
                style="
                    width:100%;
                    padding:13px;
                    border:0;
                    border-radius:10px;
                    cursor:pointer;
                    font-weight:bold;
                    font-size:16px;
                    margin-top:5px;
                "
            >
                💰 CASH OUT
            </button>


            <button
                onclick="renderMinesStartScreen()"
                style="
                    width:100%;
                    padding:10px;
                    border:0;
                    border-radius:10px;
                    cursor:pointer;
                    font-size:14px;
                    margin-top:8px;
                "
            >
                🔄 NEW GAME
            </button>

        </div>

    `;


    const grid =
        document.getElementById("minesGrid");


    if (!grid) {
        return;
    }


    for (
        let tile = 0;
        tile < game.grid_size;
        tile++
    ) {

        const button =
            document.createElement("button");


        button.type =
            "button";

        button.className =
            "mines-tile";

        button.dataset.tile =
            tile;

        button.textContent =
            "❔";


        button.style.width =
            "100%";

        button.style.aspectRatio =
            "1";

        button.style.minHeight =
            "52px";

        button.style.border =
            "0";

        button.style.borderRadius =
            "9px";

        button.style.cursor =
            "pointer";

        button.style.fontSize =
            "22px";

        button.style.fontWeight =
            "bold";


        button.onclick =
            function() {
                revealMinesTile(tile);
            };


        grid.appendChild(button);
    }


    updateMinesBoardInfo();

    setMinesGridEnabled(true);
}


// ==========================================
// REVEAL MINES TILE
// ==========================================

async function revealMinesTile(tile) {

    const game =
        window.currentMinesGame;


    if (!game) {
        return;
    }


    if (
        game.status !== "active" ||
        window.minesBusy
    ) {
        return;
    }


    if (
        game.revealed &&
        game.revealed.includes(tile)
    ) {
        return;
    }


    if (!tg.initData) {

        alert(
            "Telegram authentication data is unavailable."
        );

        return;
    }


    window.minesBusy = true;


    setMinesGridEnabled(false);


    const message =
        document.getElementById(
            "minesMessage"
        );


    if (message) {

        message.textContent =
            "Checking tile...";
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/game/mines/reveal`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        initData:
                            tg.initData,

                        game_id:
                            game.game_id,

                        tile:
                            tile

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Mines reveal response:",
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
                "Could not reveal tile."
            );
        }


        if (
            typeof data.balance !==
            "undefined"
        ) {

            balance =
                Number(data.balance);

            updateBalance();
        }


        // ==================================
        // MINE HIT
        // ==================================

        if (data.result === "mine") {

            game.status =
                "lost";


            game.revealed =
                data.revealed || game.revealed;


            revealAllMines(
                data.mines || []
            );


            if (message) {

                message.innerHTML =
                    "💥 <strong>Mine hit!</strong><br>Game over.";
            }


            const cashout =
                document.getElementById(
                    "cashoutMinesButton"
                );


            if (cashout) {
                cashout.disabled = true;
            }


            setMinesGridEnabled(false);

            return;
        }


        // ==================================
        // SAFE TILE
        // ==================================

        game.revealed =
            data.revealed || game.revealed;


        game.multiplier =
            Number(data.multiplier);


        game.potential_win =
            Number(data.potential_win);


        markMinesTileSafe(tile);

        updateMinesBoardInfo();


        // ==================================
        // AUTOMATIC WIN
        // ==================================

        if (data.status === "won") {

            game.status =
                "won";


            revealAllMines(
                data.mines || []
            );


            if (message) {

                message.innerHTML =
                    `🎉 <strong>All safe tiles found!</strong><br>
                     Won ${Number(
                         data.win_amount || 0
                     ).toLocaleString()} credits.`;
            }


            const cashout =
                document.getElementById(
                    "cashoutMinesButton"
                );


            if (cashout) {
                cashout.disabled = true;
            }


            setMinesGridEnabled(false);

            return;
        }


        // ==================================
        // ENABLE CASH OUT
        // ==================================

        const cashout =
            document.getElementById(
                "cashoutMinesButton"
            );


        if (cashout) {

            cashout.disabled =
                game.revealed.length < 1;
        }


        if (message) {

            message.innerHTML =
                "✅ <strong>Safe!</strong> Continue or cash out.";
        }


        setMinesGridEnabled(true);


    } catch (error) {

        console.error(
            "Mines reveal error:",
            error
        );


        if (message) {

            message.textContent =
                error.message;
        }


        setMinesGridEnabled(true);


    } finally {

        window.minesBusy = false;
    }
}


// ==========================================
// MARK SAFE TILE
// ==========================================

function markMinesTileSafe(tile) {

    const button =
        document.querySelector(
            `.mines-tile[data-tile="${tile}"]`
        );


    if (!button) {
        return;
    }


    button.textContent =
        "💎";


    button.disabled =
        true;


    button.style.cursor =
        "default";

    button.style.opacity =
        "0.85";
}


// ==========================================
// REVEAL ALL MINES
// ==========================================

function revealAllMines(mines) {

    if (!Array.isArray(mines)) {
        return;
    }


    mines.forEach(
        function(tile) {

            const button =
                document.querySelector(
                    `.mines-tile[data-tile="${tile}"]`
                );


            if (!button) {
                return;
            }


            button.textContent =
                "💣";


            button.disabled =
                true;


            button.style.cursor =
                "default";

            button.style.opacity =
                "0.9";
        }
    );
}


// ==========================================
// UPDATE MINES INFORMATION
// ==========================================

function updateMinesBoardInfo() {

    const game =
        window.currentMinesGame;


    if (!game) {
        return;
    }


    const multiplier =
        document.getElementById(
            "minesMultiplier"
        );


    const potentialWin =
        document.getElementById(
            "minesPotentialWin"
        );


    const status =
        document.getElementById(
            "minesStatus"
        );


    if (multiplier) {

        multiplier.textContent =
            `${Number(
                game.multiplier
            ).toFixed(2)}x`;
    }


    if (potentialWin) {

        potentialWin.textContent =
            Number(
                game.potential_win
            ).toLocaleString();
    }


    if (status) {

        status.textContent =
            `Revealed: ${
                game.revealed.length
            }`;
    }
}


// ===========

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
