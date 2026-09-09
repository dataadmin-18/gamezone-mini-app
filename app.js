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

// Mines UI state: keep the last selected bet for quick replay.
window.minesSelectedBet = 10;
window.minesSelectedMineCount = 5;


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

async function openMines() {

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

    modal.style.display = "flex";

    text.innerHTML = `
        <div style="text-align:center;padding:24px 10px;">
            <div style="font-size:30px;margin-bottom:10px;">💣</div>
            <div>Checking for your active Mines game...</div>
        </div>
    `;

    await restoreActiveMinesGame(true);
}


// ==========================================
// RESTORE ACTIVE MINES GAME FROM SERVER
// ==========================================

async function restoreActiveMinesGame(showStartScreenWhenNone = false) {

    if (!tg.initData) {

        window.currentMinesGame = null;

        if (showStartScreenWhenNone) {
            renderMinesStartScreen();
        }

        return false;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/game/mines/active`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    initData: tg.initData
                })
            }
        );

        const data = await readJsonResponse(response);

        console.log(
            "Mines active-game response:",
            data
        );

        if (!response.ok || !data.success) {
            throw new Error(
                data.error ||
                `HTTP ${response.status}`
            );
        }

        if (!data.active) {

            window.currentMinesGame = null;

            if (showStartScreenWhenNone) {
                renderMinesStartScreen();
            }

            return false;
        }

        setCurrentMinesGameFromServer(data);

        if (typeof data.balance !== "undefined") {
            balance = Number(data.balance);
            updateBalance();
        }

        renderMinesBoard();

        return true;

    } catch (error) {

        console.error(
            "Mines restore error:",
            error
        );

        if (showStartScreenWhenNone) {

            renderMinesStartScreen();

            const message =
                document.getElementById("minesMessage");

            if (message) {
                message.textContent =
                    "Could not check the previous Mines game. Please try again.";
            }
        }

        return false;
    }
}


// ==========================================
// SAVE SERVER MINES GAME IN FRONTEND MEMORY
// ==========================================

function setCurrentMinesGameFromServer(data) {

    window.minesSelectedBet = Number(data.bet || window.minesSelectedBet || 10);
    window.minesSelectedMineCount = Number(data.mine_count || window.minesSelectedMineCount || 5);

    window.currentMinesGame = {
        game_id: Number(data.game_id),
        bet: Number(data.bet),
        mine_count: Number(data.mine_count),
        grid_size: Number(data.grid_size || 25),
        multiplier: Number(data.multiplier || 1),
        potential_win: Number(
            typeof data.potential_win !== "undefined"
                ? data.potential_win
                : data.bet
        ),
        revealed: Array.isArray(data.revealed)
            ? data.revealed.map(Number)
            : [],
        status: data.status || "active"
    };
}


// ==========================================
// SAFE JSON RESPONSE READER
// ==========================================

async function readJsonResponse(response) {

    const raw = await response.text();

    if (!raw) {
        return {};
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new Error(
            `Server returned an invalid response (HTTP ${response.status}).`
        );
    }
}


// ==========================================
// MINES START SCREEN
// ==========================================

function renderMinesStartScreen() {
    const text = document.getElementById("gameText");
    if (!text) return;

    const bet = Number(window.minesSelectedBet || 10);
    const mineCount = Number(window.minesSelectedMineCount || 5);

    text.innerHTML = `
        <div class="mines-game">
            <div class="mines-header-panel">
                <div>
                    <div class="mines-kicker">MINES • DEMO</div>
                    <div class="mines-headline">Find the gems. Avoid the mines.</div>
                </div>
                <div class="mines-live-badge">● READY</div>
            </div>

            <div class="mines-wallet">
                <span>Available balance</span>
                <strong id="minesBalanceDisplay">${Number(balance).toLocaleString()} <small>credits</small></strong>
            </div>

            <div class="mines-controls">
                <div class="mines-control-card">
                    <label>BET</label>
                    <div class="mines-bet-stepper">
                        <button type="button" onclick="changeMinesBet(-10)" aria-label="Decrease bet">−</button>
                        <div class="mines-bet-value">
                            <span id="minesBetValue">${bet}</span>
                            <small>credits</small>
                        </div>
                        <button type="button" onclick="changeMinesBet(10)" aria-label="Increase bet">+</button>
                    </div>
                    <div class="mines-quick-bets">
                        <button type="button" onclick="setMinesBet(10)">10</button>
                        <button type="button" onclick="setMinesBet(50)">50</button>
                        <button type="button" onclick="setMinesBet(100)">100</button>
                        <button type="button" onclick="setMinesBet(500)">500</button>
                    </div>
                </div>

                <div class="mines-control-card">
                    <label>MINES</label>
                    <select id="minesCount" class="mines-select" onchange="window.minesSelectedMineCount = Number(this.value)">
                        <option value="3" ${mineCount === 3 ? "selected" : ""}>3 mines</option>
                        <option value="5" ${mineCount === 5 ? "selected" : ""}>5 mines</option>
                        <option value="7" ${mineCount === 7 ? "selected" : ""}>7 mines</option>
                        <option value="10" ${mineCount === 10 ? "selected" : ""}>10 mines</option>
                    </select>
                    <small class="mines-control-help">More mines = higher risk.</small>
                </div>
            </div>

            <button id="startMinesButton" onclick="startMines()" class="mines-start-button">
                💣 START GAME
            </button>

            <div id="minesMessage" class="mines-message">
                Your bet will be deducted when the demo game starts.
            </div>
        </div>
    `;
}


// ==========================================
// MINES BET CONTROLS
// ==========================================

function clampMinesBet(amount) {
    const value = Number(amount) || 10;
    const maxBet = Math.max(10, Math.min(1000, Number(balance) || 10));
    return Math.max(10, Math.min(value, maxBet));
}

function setMinesBet(amount) {
    window.minesSelectedBet = clampMinesBet(amount);

    const value = document.getElementById("minesBetValue");
    if (value) value.textContent = window.minesSelectedBet;

    const wallet = document.getElementById("minesBalanceDisplay");
    if (wallet) {
        wallet.innerHTML = `${Number(balance).toLocaleString()} <small>credits</small>`;
    }
}

function changeMinesBet(delta) {
    if (window.minesBusy || (window.currentMinesGame && window.currentMinesGame.status === "active")) {
        return;
    }

    const current = Number(window.minesSelectedBet || 10);
    setMinesBet(current + Number(delta || 0));
}

function updateMinesBalanceDisplay() {
    const wallet = document.getElementById("minesBalanceDisplay");
    if (wallet) {
        wallet.innerHTML = `${Number(balance).toLocaleString()} <small>credits</small>`;
    }
}

function renderMinesFinishedState(resultType, winAmount = 0) {
    const text = document.getElementById("gameText");
    if (!text) return;

    const game = window.currentMinesGame || {};
    const amount = Number(winAmount || 0).toLocaleString();

    let title = "GAME OVER";
    let message = "The mine was found.";
    let icon = "💥";

    if (resultType === "cashed_out") {
        title = "CASHED OUT";
        message = `You collected ${amount} demo credits.`;
        icon = "💰";
    } else if (resultType === "won") {
        title = "YOU WON";
        message = `All safe tiles found. You won ${amount} demo credits.`;
        icon = "💎";
    }

    text.innerHTML = `
        <div class="mines-game mines-finished">
            <div class="mines-result-icon">${icon}</div>
            <div class="mines-result-title">${title}</div>
            <div class="mines-result-message">${message}</div>

            <div class="mines-wallet mines-wallet-finished">
                <span>Remaining balance</span>
                <strong>${Number(balance).toLocaleString()} <small>credits</small></strong>
            </div>

            <div class="mines-result-stats">
                <div><span>Previous bet</span><strong>${Number(game.bet || window.minesSelectedBet || 10).toLocaleString()}</strong></div>
                <div><span>Mines</span><strong>${Number(game.mine_count || window.minesSelectedMineCount || 5)}</strong></div>
                <div><span>Multiplier</span><strong>${Number(game.multiplier || 1).toFixed(2)}x</strong></div>
            </div>

            <button id="newMinesGameButton" onclick="playMinesAgain()" class="mines-start-button mines-again-button">
                🔁 PLAY AGAIN • ${Number(window.minesSelectedBet || game.bet || 10).toLocaleString()}
            </button>

            <div class="mines-again-note">
                Same bet & mine settings are ready. Adjust the bet before playing again if you want.
            </div>
        </div>
    `;
}

function playMinesAgain() {
    if (window.minesBusy) return;

    const previous = window.currentMinesGame || {};
    window.minesSelectedBet = clampMinesBet(window.minesSelectedBet || previous.bet || 10);
    window.minesSelectedMineCount = Number(window.minesSelectedMineCount || previous.mine_count || 5);

    renderMinesStartScreen();

    const count = document.getElementById("minesCount");
    if (count) count.value = String(window.minesSelectedMineCount);

    startMines();
}


// ==========================================
// START MINES GAME
// ==========================================

async function startMines() {
    if (window.minesBusy) return;

    // Never create a second active game.
    if (window.currentMinesGame && window.currentMinesGame.status === "active") {
        renderMinesBoard();
        return;
    }

    const bet = clampMinesBet(window.minesSelectedBet || 10);
    const minesElement = document.getElementById("minesCount");
    const button = document.getElementById("startMinesButton");
    const message = document.getElementById("minesMessage");

    const mineCount = Number(
        minesElement ? minesElement.value : (window.minesSelectedMineCount || 5)
    );

    window.minesSelectedBet = bet;
    window.minesSelectedMineCount = mineCount;

    if (mineCount < 1 || mineCount > 20) {
        alert("Invalid mine count.");
        return;
    }

    if (balance < bet) {
        alert("Insufficient demo balance.");
        return;
    }

    if (!tg.initData) {
        alert("Telegram authentication data is unavailable.");
        return;
    }

    window.minesBusy = true;

    if (button) {
        button.disabled = true;
        button.textContent = "💣 STARTING...";
    }

    if (message) {
        message.textContent = "Creating your Mines game...";
    }

    try {
        const response = await fetch(`${API_URL}/api/game/mines/start`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                initData: tg.initData,
                bet_amount: bet,
                mine_count: mineCount
            })
        });

        const data = await readJsonResponse(response);

        if (response.status === 409 && data.active === true) {
            setCurrentMinesGameFromServer(data.active_game || data);

            if (typeof data.balance !== "undefined") {
                balance = Number(data.balance);
                updateBalance();
            }

            renderMinesBoard();
            return;
        }

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        if (!data.success) {
            throw new Error(data.error || "Could not start Mines.");
        }

        window.currentMinesGame = {
            game_id: data.game_id,
            bet: Number(data.bet),
            mine_count: Number(data.mine_count),
            grid_size: Number(data.grid_size),
            multiplier: Number(data.multiplier),
            potential_win: Number(data.potential_win),
            revealed: [],
            status: "active"
        };

        balance = Number(data.balance);
        updateBalance();
        renderMinesBoard();

    } catch (error) {
        console.error("Mines start error:", error);

        if (message) {
            message.textContent = error.message;
        }
    } finally {
        window.minesBusy = false;

        // The start button may no longer exist because renderMinesBoard()
        // replaced the screen, so only update it if it is still present.
        const currentButton = document.getElementById("startMinesButton");
        if (currentButton) {
            currentButton.disabled = false;
            currentButton.textContent = "💣 START GAME";
        }
    }
}


// ==========================================
// RENDER MINES BOARD
// ==========================================

function renderMinesBoard() {
    const text = document.getElementById("gameText");
    const game = window.currentMinesGame;

    if (!text || !game) return;

    window.minesSelectedBet = Number(game.bet || window.minesSelectedBet || 10);
    window.minesSelectedMineCount = Number(game.mine_count || window.minesSelectedMineCount || 5);

    text.innerHTML = `
        <div class="mines-game mines-live-game">
            <div class="mines-header-panel">
                <div>
                    <div class="mines-kicker">MINES • DEMO</div>
                    <div class="mines-headline">Choose a tile</div>
                </div>
                <div class="mines-live-badge active">● LIVE</div>
            </div>

            <div class="mines-wallet">
                <span>Available balance</span>
                <strong id="minesBalanceDisplay">${Number(balance).toLocaleString()} <small>credits</small></strong>
            </div>

            <div class="mines-live-stats">
                <div><span>BET</span><strong>${Number(game.bet).toLocaleString()}</strong></div>
                <div><span>MULTIPLIER</span><strong id="minesMultiplier">${Number(game.multiplier).toFixed(2)}x</strong></div>
                <div><span>POTENTIAL WIN</span><strong id="minesPotentialWin">${Number(game.potential_win).toLocaleString()}</strong></div>
            </div>

            <div class="mines-grid-shell">
                <div class="mines-grid-label">SAFE TILES <span>${Number(game.mine_count)} MINES</span></div>
                <div id="minesGrid" class="mines-grid"></div>
            </div>

            <button id="cashoutMinesButton" onclick="cashoutMines()" class="mines-cashout-button" disabled>
                💰 CASH OUT <span id="cashoutAmount">${Number(game.potential_win).toLocaleString()}</span>
            </button>

            <div id="minesMessage" class="mines-message">Find a safe tile to increase your multiplier.</div>
            <div id="minesStatus" class="mines-status">Revealed: ${game.revealed.length}</div>
        </div>
    `;

    const grid = document.getElementById("minesGrid");
    if (!grid) return;

    for (let tile = 0; tile < 25; tile++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mines-tile";
        button.dataset.tile = tile;
        button.textContent = "✦";
        button.setAttribute("aria-label", `Mines tile ${tile + 1}`);
        button.addEventListener("click", () => revealMinesTile(tile));
        grid.appendChild(button);
    }

    if (Array.isArray(game.revealed)) {
        game.revealed.forEach(tile => markMinesTileSafe(Number(tile)));
    }

    updateMinesBoardInfo();
    updateMinesBalanceDisplay();

    const cashout = document.getElementById("cashoutMinesButton");
    if (cashout) {
        cashout.disabled = game.status !== "active" || game.revealed.length < 1;
    }

    setMinesGridEnabled(game.status === "active");

    const message = document.getElementById("minesMessage");
    if (message && game.revealed.length > 0) {
        message.textContent = "✓ Safe tile found. Continue or cash out.";
    }
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


    setMinesGridEnabled(
        false
    );


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


        // ----------------------------------
        // UPDATE BALANCE
        // ----------------------------------

        if (
            typeof data.balance !==
            "undefined"
        ) {

            balance =
                Number(data.balance);

            updateBalance();
        }


        // ----------------------------------
        // MINE
        // ----------------------------------

        if (data.result === "mine") {

            game.status =
                "lost";

            game.revealed =
                data.revealed || game.revealed;


            revealAllMines(
                data.mines || []
            );


            const message =
                document.getElementById(
                    "minesMessage"
                );


            if (message) {

                message.innerHTML =
                    "💥 <strong>Mine hit!</strong> Game over.";
            }


            const cashout =
                document.getElementById(
                    "cashoutMinesButton"
                );


            if (cashout) {
                cashout.disabled = true;
            }


            setMinesGridEnabled(
                false
            );


            return;
        }


        // ----------------------------------
        // SAFE TILE
        // ----------------------------------

        game.revealed =
            data.revealed || [];


        game.multiplier =
            Number(data.multiplier);


        game.potential_win =
            Number(data.potential_win);


        updateMinesBoardInfo();


        markMinesTileSafe(
            tile
        );


        // ----------------------------------
        // AUTOMATIC WIN
        // ----------------------------------

        if (data.status === "won") {

            game.status =
                "won";


            revealAllMines(
                data.mines || []
            );


            const message =
                document.getElementById(
                    "minesMessage"
                );


            if (message) {

                message.innerHTML =
                    `🎉 <strong>All safe tiles found!</strong><br>
                     Won ${Number(data.win_amount || 0).toLocaleString()} credits.`;
            }


            const cashout =
                document.getElementById(
                    "cashoutMinesButton"
                );


            if (cashout) {
                cashout.disabled = true;
            }


            setMinesGridEnabled(
                false
            );


            return;
        }


        // ----------------------------------
        // ENABLE CASH OUT
        // ----------------------------------

        const cashout =
            document.getElementById(
                "cashoutMinesButton"
            );


        if (cashout) {

            cashout.disabled =
                game.revealed.length < 1;
        }


        const message =
            document.getElementById(
                "minesMessage"
            );


        if (message) {

            message.innerHTML =
                "✅ Safe! Continue or cash out.";
        }


        setMinesGridEnabled(
            true
        );


    } catch (error) {

        console.error(
            "Mines reveal error:",
            error
        );


        const message =
            document.getElementById(
                "minesMessage"
            );


        if (message) {
            message.textContent =
                error.message;
        }


        setMinesGridEnabled(
            true
        );


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
            `${game.multiplier.toFixed(2)}x`;
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


// ==========================================
// ENABLE / DISABLE MINES GRID
// ==========================================

function setMinesGridEnabled(enabled) {

    const buttons =
        document.querySelectorAll(
            ".mines-tile"
        );


    buttons.forEach(
        function(button) {

            if (
                button.textContent ===
                "💎" ||
                button.textContent ===
                "💣"
            ) {

                button.disabled =
                    true;

                return;
            }


            button.disabled =
                !enabled;
        }
    );
}


// ==========================================
// MINES CASH OUT
// ==========================================

async function cashoutMines() {

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
        !game.revealed ||
        game.revealed.length < 1
    ) {

        alert(
            "Reveal at least one safe tile before cashing out."
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


    const cashout =
        document.getElementById(
            "cashoutMinesButton"
        );

    const message =
        document.getElementById(
            "minesMessage"
        );


    if (cashout) {

        cashout.disabled =
            true;

        cashout.textContent =
            "💰 CASHING OUT...";
    }


    if (message) {

        message.textContent =
            "Processing your demo cash out...";
    }


    setMinesGridEnabled(
        false
    );


    try {

        const response =
            await fetch(
                `${API_URL}/api/game/mines/cashout`,
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
                            game.game_id

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Mines cashout response:",
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
                "Cash out failed."
            );
        }


        balance =
            Number(data.balance);

        updateBalance();


        game.status =
            "cashed_out";


        game.potential_win =
            Number(data.win_amount);


        const amount =
            Number(
                data.win_amount
            ).toLocaleString();


        if (message) {

            message.innerHTML =
                `💰 <strong>Cashed out!</strong><br>
                 You received ${amount} demo credits.`;
        }


        const status =
            document.getElementById(
                "minesStatus"
            );


        if (status) {

            status.textContent =
                `Final multiplier: ${
                    Number(data.multiplier).toFixed(2)
                }x`;
        }


        setMinesGridEnabled(
            false
        );


    } catch (error) {

        console.error(
            "Mines cashout error:",
            error
        );


        if (message) {

            message.textContent =
                error.message;
        }


        setMinesGridEnabled(
            true
        );


    } finally {

        window.minesBusy = false;


        if (cashout) {

            cashout.disabled =
                true;

            cashout.textContent =
                "💰 CASH OUT";
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
    async function() {

        console.log(
            "Game Zone Mini App started."
        );

        updateBalance();

        await loadUser();

        // A full Telegram Mini App close destroys
        // JavaScript memory. Re-check the server so
        // any unfinished Mines game is restored.
        await restoreActiveMinesGame(false);
    }
);
