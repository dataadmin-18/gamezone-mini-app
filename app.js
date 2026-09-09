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

    if (game === "keno") {

        openKeno();

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
// PROFESSIONAL SLOTS INTERFACE
// ==========================================

function openSlots() {
    const modal = document.getElementById("gameModal");
    const icon = document.getElementById("gameIcon");
    const title = document.getElementById("gameTitle");
    const text = document.getElementById("gameText");

    if (!modal || !text) {
        alert("Slots modal not found.");
        return;
    }

    if (icon) icon.textContent = "🎰";
    if (title) title.textContent = "Royal Slots";

    text.innerHTML = `
        <div class="slots-game">
            <div class="slots-topline">
                <span class="slots-live-dot"></span>
                DEMO PLAY • VIRTUAL CREDITS
            </div>

            <div class="slots-machine">
                <div class="slots-machine-header">
                    <span>ROYAL</span>
                    <span class="slots-jackpot">★ JACKPOT ★</span>
                    <span>777</span>
                </div>
                <div class="slots-payline"></div>
                <div id="slotsReels" class="slots-reels">
                    <div class="slot-symbol">🍒</div>
                    <div class="slot-symbol">7️⃣</div>
                    <div class="slot-symbol">💎</div>
                </div>
                <div class="slots-payline bottom"></div>
            </div>

            <div class="slots-balance-row">
                <div><span>DEMO BALANCE</span><strong id="slotsBalanceDisplay">${Number(balance).toLocaleString()}</strong></div>
                <div><span>LAST WIN</span><strong id="slotsLastWin">—</strong></div>
            </div>

            <div id="slotsMessage" class="slots-message">Choose your bet and spin the reels.</div>

            <div class="slots-control-card">
                <div class="slots-control-label">BET AMOUNT</div>
                <div class="slots-bet-picker">
                    <button type="button" onclick="changeSlotsBet(-10)" class="slots-adjust">−</button>
                    <div class="slots-current-bet"><strong id="selectedSlotsBet">10</strong><small>credits</small></div>
                    <button type="button" onclick="changeSlotsBet(10)" class="slots-adjust">+</button>
                </div>
                <div class="slots-bets">
                    <button type="button" onclick="setSlotsBet(10)" class="slot-bet active">10</button>
                    <button type="button" onclick="setSlotsBet(50)" class="slot-bet">50</button>
                    <button type="button" onclick="setSlotsBet(100)" class="slot-bet">100</button>
                    <button type="button" onclick="setSlotsBet(500)" class="slot-bet">500</button>
                </div>
            </div>

            <button id="spinSlotsButton" onclick="spinSlots()" class="slots-spin-button">
                <span>🎰</span> SPIN REELS
            </button>
            <div class="slots-hint">Match 3 symbols to win demo credits.</div>
        </div>
    `;

    modal.style.display = "flex";
    window.selectedSlotsBet = 10;
    updateSlotsBetButtons();
}

function changeSlotsBet(delta) {
    if (spinning) return;
    const allowed = [10, 50, 100, 500];
    const current = Number(window.selectedSlotsBet || 10);
    let index = allowed.indexOf(current);
    if (index < 0) index = 0;
    index = Math.max(0, Math.min(allowed.length - 1, index + (delta > 0 ? 1 : -1)));
    setSlotsBet(allowed[index]);
}

function updateSlotsBetButtons() {
    const selected = Number(window.selectedSlotsBet || 10);
    document.querySelectorAll(".slot-bet").forEach(button => {
        button.classList.toggle("active", Number(button.textContent.trim()) === selected);
    });
    const display = document.getElementById("slotsBalanceDisplay");
    if (display) display.textContent = Number(balance).toLocaleString();
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

    text.innerHTML = `
        <div class="mines-game">
            <div class="mines-hero">
                <div class="mines-bomb">💣</div>
                <div>
                    <div class="mines-kicker">DEMO GAME</div>
                    <h3>MINES</h3>
                    <p>Reveal safe gems. Avoid the mines.</p>
                </div>
            </div>

            <div class="mines-settings">
                <div class="mines-setting">
                    <label>BET</label>
                    <select id="minesBet">
                        <option value="10">10 credits</option>
                        <option value="50">50 credits</option>
                        <option value="100">100 credits</option>
                        <option value="500">500 credits</option>
                    </select>
                </div>
                <div class="mines-setting">
                    <label>MINES</label>
                    <select id="minesCount">
                        <option value="3">3 mines</option>
                        <option value="5" selected>5 mines</option>
                        <option value="7">7 mines</option>
                        <option value="10">10 mines</option>
                        <option value="15">15 mines</option>
                    </select>
                </div>
            </div>

            <div class="mines-risk-card">
                <div><span>SAFE TILES</span><strong id="minesSafePreview">20</strong></div>
                <div><span>GRID</span><strong>5 × 5</strong></div>
                <div><span>MODE</span><strong>DEMO</strong></div>
            </div>

            <button id="startMinesButton" onclick="startMines()" class="mines-start-button">
                💎 START NEW GAME
            </button>

            <div id="minesMessage" class="mines-message">Choose your risk level to begin.</div>
            <div id="minesTestResult" class="mines-test-result"></div>
        </div>
    `;

    const count = document.getElementById("minesCount");
    if (count) count.addEventListener("change", updateMinesSafePreview);
    updateMinesSafePreview();
}

function updateMinesSafePreview() {
    const count = Number(document.getElementById("minesCount")?.value || 5);
    const safe = document.getElementById("minesSafePreview");
    if (safe) safe.textContent = String(25 - count);
}

function showMinesNewGameButton() {
    const button = document.getElementById("minesNewGameButton");
    if (!button) return;
    button.disabled = false;
    button.textContent = "💎 NEW GAME";
    button.classList.remove("is-disabled");
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

    const result =
        document.getElementById("minesTestResult");


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


    if (result) {
        result.textContent = "";
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
            await readJsonResponse(response);


        console.log(
            "Mines start response:",
            data
        );


        if (
            response.status === 409 &&
            data.active === true
        ) {

            setCurrentMinesGameFromServer(
                data.active_game || data
            );

            if (typeof data.balance !== "undefined") {
                balance = Number(data.balance);
                updateBalance();
            }

            renderMinesBoard();
            return;
        }


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
                data.game_id,

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

        const slotsBalanceDisplay = document.getElementById("slotsBalanceDisplay");
        if (slotsBalanceDisplay) slotsBalanceDisplay.textContent = Number(balance).toLocaleString();


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


        if (result) {
            result.textContent =
                "";
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
    const text = document.getElementById("gameText");
    const game = window.currentMinesGame;
    if (!text || !game) return;

    const active = game.status === "active";
    const revealedCount = Array.isArray(game.revealed) ? game.revealed.length : 0;

    text.innerHTML = `
        <div class="mines-game">
            <div class="mines-board-header">
                <div>
                    <div class="mines-kicker">${active ? "GAME IN PROGRESS" : "GAME OVER"}</div>
                    <h3>MINES</h3>
                </div>
                <div class="mines-live-pill ${active ? "active" : "ended"}">
                    <span></span>${active ? "ACTIVE" : "ENDED"}
                </div>
            </div>

            <div class="mines-stats">
                <div><span>BET</span><strong>${Number(game.bet).toLocaleString()}</strong></div>
                <div><span>MULTIPLIER</span><strong id="minesMultiplier">${Number(game.multiplier).toFixed(2)}x</strong></div>
                <div><span>POTENTIAL WIN</span><strong id="minesPotentialWin">${Number(game.potential_win).toLocaleString()}</strong></div>
            </div>

            <div class="mines-grid-shell">
                <div class="mines-grid-title"><span>SAFE</span><span>5 × 5</span><span>MINES: ${game.mine_count}</span></div>
                <div id="minesGrid" class="mines-grid"></div>
            </div>

            <div id="minesMessage" class="mines-message">
                ${active ? (revealedCount ? "💎 Safe tiles found. Keep going or cash out." : "Choose a tile to reveal.") : "Game finished."}
            </div>

            <div class="mines-actions">
                <button id="cashoutMinesButton" onclick="cashoutMines()" class="mines-cashout-button" ${(!active || revealedCount < 1) ? "disabled" : ""}>
                    💰 CASH OUT <span id="minesCashoutAmount">${Number(game.potential_win).toLocaleString()}</span>
                </button>
                <button id="minesNewGameButton" onclick="startAnotherMinesGame()" class="mines-new-game-button" ${active ? "disabled" : ""}>
                    ${active ? "🔒 GAME ACTIVE" : "💎 NEW GAME"}
                </button>
            </div>

            <div id="minesStatus" class="mines-status">Revealed: ${revealedCount} / ${25 - Number(game.mine_count)}</div>
        </div>
    `;

    const grid = document.getElementById("minesGrid");
    if (!grid) return;

    for (let tile = 0; tile < 25; tile++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mines-tile";
        button.dataset.tile = tile;
        button.innerHTML = `<span>◆</span>`;
        button.addEventListener("click", () => revealMinesTile(tile));
        grid.appendChild(button);
    }

    if (Array.isArray(game.revealed)) {
        game.revealed.forEach(tile => markMinesTileSafe(Number(tile)));
    }

    updateMinesBoardInfo();
    setMinesGridEnabled(active);
}

async function startAnotherMinesGame() {
    if (window.currentMinesGame && window.currentMinesGame.status === "active") {
        return;
    }
    renderMinesStartScreen();
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

            const newGameButton = document.getElementById("minesNewGameButton");
            if (newGameButton) {
                newGameButton.disabled = false;
                newGameButton.textContent = "💎 NEW GAME";
                newGameButton.classList.remove("is-disabled");
            }

            setMinesGridEnabled(false);
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

            const newGameButton = document.getElementById("minesNewGameButton");
            if (newGameButton) {
                newGameButton.disabled = false;
                newGameButton.textContent = "💎 NEW GAME";
            }

            setMinesGridEnabled(false);
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
    button.classList.add("is-safe");

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
            button.classList.add("is-mine");

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

    const cashoutAmount = document.getElementById("minesCashoutAmount");
    if (cashoutAmount) cashoutAmount.textContent = Number(game.potential_win).toLocaleString();


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

        const newGameButton = document.getElementById("minesNewGameButton");
        if (newGameButton) {
            newGameButton.disabled = false;
            newGameButton.textContent = "💎 NEW GAME";
            newGameButton.classList.remove("is-disabled");
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

    updateSlotsBetButtons();


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

                const lastWin = document.getElementById("slotsLastWin");
                if (lastWin) lastWin.textContent = Number(data.win).toLocaleString();

                message.innerHTML =
                    `🎉 You won <strong>${data.win}</strong> credits!`;

            } else {

                const lastWin = document.getElementById("slotsLastWin");
                if (lastWin) lastWin.textContent = "0";

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
// PROFESSIONAL KENO INTERFACE
// ==========================================

window.selectedKenoNumbers = [];
window.selectedKenoBet = 10;
window.kenoBusy = false;

function openKeno() {
    const modal = document.getElementById("gameModal");
    const icon = document.getElementById("gameIcon");
    const title = document.getElementById("gameTitle");
    const text = document.getElementById("gameText");

    if (!modal || !text) {
        alert("Keno modal not found.");
        return;
    }

    if (icon) icon.textContent = "🎱";
    if (title) title.textContent = "Keno";
    modal.style.display = "flex";

    window.selectedKenoNumbers = [];
    window.selectedKenoBet = 10;
    window.kenoBusy = false;

    text.innerHTML = `
        <div class="keno-game">
            <div class="keno-hero">
                <div class="keno-icon">🎱</div>
                <div>
                    <div class="keno-kicker">DEMO GAME • VIRTUAL CREDITS</div>
                    <h3>KENO</h3>
                    <p>Pick 1–10 numbers from 1 to 80.</p>
                </div>
            </div>

            <div class="keno-stats">
                <div><span>BALANCE</span><strong id="kenoBalance">${Number(balance).toLocaleString()}</strong></div>
                <div><span>SELECTED</span><strong id="kenoSelectedCount">0 / 10</strong></div>
                <div><span>LAST WIN</span><strong id="kenoLastWin">—</strong></div>
            </div>

            <div class="keno-card">
                <div class="keno-head">
                    <div><span>YOUR NUMBERS</span><strong id="kenoSelectionText">Select your numbers</strong></div>
                    <button type="button" onclick="clearKenoSelection()" class="keno-clear">CLEAR</button>
                </div>
                <div id="kenoNumberGrid" class="keno-grid"></div>
            </div>

            <div class="keno-card">
                <div class="keno-head">
                    <div><span>BET AMOUNT</span><strong><b id="kenoBetDisplay">10</b> credits</strong></div>
                </div>
                <div class="keno-bet-picker">
                    <button type="button" onclick="changeKenoBet(-1)">−</button>
                    <div><strong id="kenoCurrentBet">10</strong><small>credits</small></div>
                    <button type="button" onclick="changeKenoBet(1)">+</button>
                </div>
                <div class="keno-bets">
                    <button type="button" onclick="setKenoBet(10)" class="keno-bet active">10</button>
                    <button type="button" onclick="setKenoBet(50)" class="keno-bet">50</button>
                    <button type="button" onclick="setKenoBet(100)" class="keno-bet">100</button>
                    <button type="button" onclick="setKenoBet(500)" class="keno-bet">500</button>
                </div>
            </div>

            <div id="kenoResult" class="keno-result">Select your numbers and press DRAW KENO.</div>

            <button type="button" id="drawKenoButton" onclick="drawKeno()" class="keno-draw">
                🎱 DRAW KENO
            </button>

            <div class="keno-hint">The server draws 20 numbers. Select 1–10 numbers.</div>

            <div id="kenoDrawArea" class="keno-card keno-results" style="display:none;">
                <div class="keno-results-title">DRAW RESULTS</div>
                <div id="kenoDrawGrid" class="keno-draw-grid"></div>
            </div>
        </div>
    `;

    renderKenoNumberGrid();
    updateKenoSelectionUI();
    updateKenoBetDisplay();
}

function renderKenoNumberGrid() {
    const grid = document.getElementById("kenoNumberGrid");
    if (!grid) return;

    grid.innerHTML = "";

    for (let n = 1; n <= 80; n++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "keno-number";
        b.dataset.number = String(n);
        b.textContent = String(n);
        b.onclick = function() { toggleKenoNumber(n); };
        grid.appendChild(b);
    }
}

function toggleKenoNumber(number) {
    if (window.kenoBusy) return;

    const selected = Array.isArray(window.selectedKenoNumbers)
        ? window.selectedKenoNumbers
        : [];

    const index = selected.indexOf(number);

    if (index >= 0) {
        selected.splice(index, 1);
    } else {
        if (selected.length >= 10) {
            const r = document.getElementById("kenoResult");
            if (r) r.textContent = "You can select a maximum of 10 numbers.";
            return;
        }
        selected.push(number);
        selected.sort((a,b) => a-b);
    }

    window.selectedKenoNumbers = selected;
    updateKenoSelectionUI();
}

function updateKenoSelectionUI() {
    const selected = Array.isArray(window.selectedKenoNumbers)
        ? window.selectedKenoNumbers
        : [];

    document.querySelectorAll(".keno-number").forEach(function(b) {
        b.classList.toggle("selected", selected.includes(Number(b.dataset.number)));
    });

    const count = document.getElementById("kenoSelectedCount");
    if (count) count.textContent = `${selected.length} / 10`;

    const label = document.getElementById("kenoSelectionText");
    if (label) label.textContent = selected.length ? selected.join(" • ") : "Select your numbers";
}

function clearKenoSelection() {
    if (window.kenoBusy) return;
    window.selectedKenoNumbers = [];
    updateKenoSelectionUI();

    const r = document.getElementById("kenoResult");
    if (r) {
        r.textContent = "Select your numbers and press DRAW KENO.";
        r.classList.remove("win");
    }
}

function setKenoBet(amount) {
    if (window.kenoBusy) return;

    const allowed = [10, 50, 100, 500];
    amount = Number(amount);
    if (!allowed.includes(amount)) amount = 10;

    window.selectedKenoBet = amount;
    updateKenoBetDisplay();
}

function changeKenoBet(direction) {
    if (window.kenoBusy) return;

    const allowed = [10, 50, 100, 500];
    let i = allowed.indexOf(Number(window.selectedKenoBet || 10));
    if (i < 0) i = 0;

    i = direction > 0
        ? Math.min(allowed.length - 1, i + 1)
        : Math.max(0, i - 1);

    setKenoBet(allowed[i]);
}

function updateKenoBetDisplay() {
    const amount = Number(window.selectedKenoBet || 10);

    const current = document.getElementById("kenoCurrentBet");
    const display = document.getElementById("kenoBetDisplay");

    if (current) current.textContent = amount;
    if (display) display.textContent = amount;

    document.querySelectorAll(".keno-bet").forEach(function(b) {
        b.classList.toggle("active", Number(b.textContent.trim()) === amount);
    });
}

async function drawKeno() {
    if (window.kenoBusy) return;

    const selected = Array.isArray(window.selectedKenoNumbers)
        ? [...window.selectedKenoNumbers]
        : [];

    const bet = Number(window.selectedKenoBet || 10);

    if (selected.length < 1) {
        alert("Please select at least 1 number.");
        return;
    }

    if (selected.length > 10) {
        alert("You can select a maximum of 10 numbers.");
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

    window.kenoBusy = true;

    const button = document.getElementById("drawKenoButton");
    const result = document.getElementById("kenoResult");
    const grid = document.getElementById("kenoNumberGrid");
    const drawArea = document.getElementById("kenoDrawArea");
    const drawGrid = document.getElementById("kenoDrawGrid");

    if (button) {
        button.disabled = true;
        button.textContent = "🎱 DRAWING...";
    }

    if (grid) grid.classList.add("drawing");
    if (result) result.textContent = "🎱 Drawing your 20 numbers...";
    if (drawArea) drawArea.style.display = "block";
    if (drawGrid) drawGrid.innerHTML = "";

    try {
        const response = await fetch(
            `${API_URL}/api/game/keno`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    initData: tg.initData,
                    bet_amount: bet,
                    numbers: selected
                })
            }
        );

        const data = await readJsonResponse(response);

        console.log("Keno response:", data);

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        if (!data.success) {
            throw new Error(data.error || "Keno game failed.");
        }

        const draw = Array.isArray(data.draw) ? data.draw.map(Number) : [];
        const matched = Array.isArray(data.matched) ? data.matched.map(Number) : [];

        await animateKenoDraw(draw, selected, matched);

        if (typeof data.balance !== "undefined") {
            balance = Number(data.balance);
            updateBalance();
        }

        const kb = document.getElementById("kenoBalance");
        if (kb) kb.textContent = Number(balance).toLocaleString();

        highlightKenoFinalNumbers(selected, draw, matched);

        const matches = Number(
            typeof data.matches !== "undefined"
                ? data.matches
                : matched.length
        );
        const multiplier = Number(data.multiplier || 0);
        const win = Number(data.win || 0);

        const last = document.getElementById("kenoLastWin");
        if (last) last.textContent = win > 0 ? Number(win).toLocaleString() : "0";

        if (result) {
            if (win > 0) {
                result.innerHTML =
                    `🏆 <strong>YOU WIN!</strong><br>${matches} match${matches === 1 ? "" : "es"} • ${multiplier.toFixed(2)}x • Won ${Number(win).toLocaleString()} credits`;
                result.classList.add("win");
            } else {
                result.innerHTML =
                    `No win this time.<br>${matches} match${matches === 1 ? "" : "es"} • Bet ${Number(data.bet || bet).toLocaleString()} credits`;
                result.classList.remove("win");
            }
        }

    } catch (error) {
        console.error("Keno error:", error);
        if (result) {
            result.textContent = error.message || "Keno game failed.";
            result.classList.remove("win");
        }
    } finally {
        window.kenoBusy = false;
        if (grid) grid.classList.remove("drawing");
        if (button) {
            button.disabled = false;
            button.textContent = "🎱 DRAW KENO";
        }
    }
}

function animateKenoDraw(draw, selected, matched) {
    return new Promise(function(resolve) {
        const grid = document.getElementById("kenoDrawGrid");

        if (!grid || !draw.length) {
            resolve();
            return;
        }

        grid.innerHTML = "";
        let i = 0;

        function next() {
            if (i >= draw.length) {
                resolve();
                return;
            }

            const n = Number(draw[i]);
            const ball = document.createElement("div");
            ball.className = "keno-draw-ball";
            ball.textContent = String(n);

            if (matched.includes(n)) {
                ball.classList.add("matched");
            } else if (selected.includes(n)) {
                ball.classList.add("selected-drawn");
            }

            grid.appendChild(ball);
            i++;
            setTimeout(next, 65);
        }

        next();
    });
}

function highlightKenoFinalNumbers(selected, draw, matched) {
    const selectedSet = new Set(selected.map(Number));
    const drawSet = new Set(draw.map(Number));
    const matchedSet = new Set(matched.map(Number));

    document.querySelectorAll(".keno-number").forEach(function(b) {
        const n = Number(b.dataset.number);
        b.classList.remove("selected", "drawn", "matched");

        if (matchedSet.has(n)) b.classList.add("matched");
        else if (selectedSet.has(n)) b.classList.add("selected");
        else if (drawSet.has(n)) b.classList.add("drawn");
    });
}

(function installKenoStyles() {
    if (document.getElementById("kenoProfessionalStyles")) return;

    const s = document.createElement("style");
    s.id = "kenoProfessionalStyles";
    s.textContent = `
        .keno-game{width:100%;max-width:620px;margin:auto;color:#f7f8fb;font-family:inherit}
        .keno-hero{display:flex;align-items:center;gap:14px;padding:16px;margin-bottom:12px;border-radius:18px;background:linear-gradient(135deg,#171c2b,#101522);border:1px solid rgba(255,255,255,.08);box-shadow:0 12px 30px rgba(0,0,0,.18)}
        .keno-icon{width:54px;height:54px;display:grid;place-items:center;border-radius:15px;background:rgba(255,255,255,.07);font-size:30px;flex:0 0 54px}
        .keno-kicker{font-size:10px;font-weight:800;letter-spacing:.12em;opacity:.62}
        .keno-hero h3{margin:3px 0;font-size:24px;letter-spacing:.04em}
        .keno-hero p{margin:0;font-size:12px;opacity:.62}
        .keno-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
        .keno-stats>div{padding:11px 8px;text-align:center;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.07)}
        .keno-stats span,.keno-head span{display:block;font-size:8px;font-weight:800;letter-spacing:.08em;opacity:.5}
        .keno-stats strong{display:block;margin-top:4px;font-size:14px}
        .keno-card{padding:13px;margin-bottom:12px;border-radius:18px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}
        .keno-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:11px}
        .keno-head strong{display:block;margin-top:3px;font-size:13px}
        .keno-clear{border:0;border-radius:9px;padding:8px 10px;background:rgba(255,255,255,.08);color:inherit;font-size:9px;font-weight:800}
        .keno-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:5px}
        .keno-number{aspect-ratio:1;min-width:0;border:1px solid rgba(255,255,255,.075);border-radius:9px;background:rgba(255,255,255,.055);color:inherit;font-size:12px;font-weight:750}
        .keno-number.selected{background:rgba(80,145,255,.28);border-color:rgba(100,160,255,.85)}
        .keno-number.drawn{background:rgba(255,255,255,.13);border-color:rgba(255,255,255,.25)}
        .keno-number.matched{background:rgba(47,205,125,.28);border-color:rgba(72,225,145,.9);box-shadow:0 0 12px rgba(72,225,145,.2)}
        .keno-bet-picker{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:11px}
        .keno-bet-picker>button{width:42px;height:42px;border:0;border-radius:12px;background:rgba(255,255,255,.08);color:inherit;font-size:25px}
        .keno-bet-picker>div{text-align:center;min-width:90px}
        .keno-bet-picker strong{display:block;font-size:22px}
        .keno-bet-picker small{font-size:10px;opacity:.5}
        .keno-bets{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
        .keno-bet{border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:9px 5px;background:rgba(255,255,255,.05);color:inherit;font-weight:800}
        .keno-bet.active{border-color:rgba(100,160,255,.8);background:rgba(80,145,255,.2)}
        .keno-result{min-height:52px;display:flex;align-items:center;justify-content:center;text-align:center;padding:11px;margin-bottom:10px;border-radius:14px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);font-size:12px;line-height:1.45}
        .keno-result.win{border-color:rgba(72,225,145,.45);background:rgba(47,205,125,.12)}
        .keno-draw{width:100%;border:0;border-radius:15px;padding:14px;background:linear-gradient(135deg,#3d79ff,#6258e8);color:#fff;font-size:14px;font-weight:900}
        .keno-draw:disabled{opacity:.55}
        .keno-hint{margin:8px 0 13px;text-align:center;font-size:10px;opacity:.45}
        .keno-results-title{text-align:center;margin-bottom:9px;font-size:9px;font-weight:850;letter-spacing:.12em;opacity:.5}
        .keno-draw-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}
        .keno-draw-ball{aspect-ratio:1;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);font-size:11px;font-weight:850;animation:kenoBallIn .22s ease both}
        .keno-draw-ball.selected-drawn{background:rgba(80,145,255,.25);border-color:rgba(100,160,255,.7)}
        .keno-draw-ball.matched{background:rgba(47,205,125,.3);border-color:rgba(72,225,145,.9)}
        @keyframes kenoBallIn{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
        @media(max-width:420px){.keno-grid{gap:4px}.keno-number{border-radius:7px;font-size:10px}.keno-draw-grid{gap:5px}.keno-draw-ball{font-size:10px}}
    `;
    document.head.appendChild(s);
})();


// ==========================================
// BINGO
// ==========================================

window.selectedBingoBet = 10;
window.bingoBusy = false;

function openBingo() {
    const modal = document.getElementById("gameModal");
    const icon = document.getElementById("gameIcon");
    const title = document.getElementById("gameTitle");
    const text = document.getElementById("gameText");
    if (!modal || !text) return alert("Bingo modal not found.");
    if (icon) icon.textContent = "🎯";
    if (title) title.textContent = "Bingo";
    modal.style.display = "flex";
    window.selectedBingoBet = 10;
    window.bingoBusy = false;
    text.innerHTML = `
      <div class="bingo-game">
        <div class="bingo-hero"><div class="bingo-icon">🎯</div><div><div class="game-kicker">DEMO GAME • VIRTUAL CREDITS</div><h3>BINGO</h3><p>Complete a row, column or diagonal.</p></div></div>
        <div class="bingo-stats"><div><span>BALANCE</span><strong id="bingoBalance">${Number(balance).toLocaleString()}</strong></div><div><span>BET</span><strong id="bingoBetValue">10</strong></div><div><span>LAST WIN</span><strong id="bingoLastWin">—</strong></div></div>
        <div id="bingoCard" class="bingo-card"></div>
        <div id="bingoDraw" class="bingo-draw"></div>
        <div class="bingo-bets"><button onclick="setBingoBet(10)" class="bingo-bet active">10</button><button onclick="setBingoBet(50)" class="bingo-bet">50</button><button onclick="setBingoBet(100)" class="bingo-bet">100</button><button onclick="setBingoBet(500)" class="bingo-bet">500</button></div>
        <div id="bingoResult" class="bingo-result">Press PLAY BINGO to draw the round.</div>
        <button id="bingoButton" onclick="playBingo()" class="bingo-button">🎯 PLAY BINGO</button>
        <div class="game-hint">A completed line pays 5× the demo bet.</div>
      </div>`;
    renderBingoCard([], []);
}

function setBingoBet(amount) {
    if (window.bingoBusy) return;
    window.selectedBingoBet = Number(amount);
    const v = document.getElementById("bingoBetValue"); if (v) v.textContent = amount;
    document.querySelectorAll(".bingo-bet").forEach(b => b.classList.toggle("active", Number(b.textContent) === Number(amount)));
}

function renderBingoCard(card, marked) {
    const el = document.getElementById("bingoCard"); if (!el) return;
    if (!card.length) { el.innerHTML = '<div class="bingo-empty">Your 5 × 5 card will appear here.</div>'; return; }
    let html = '';
    for (let r=0;r<5;r++) for (let c=0;c<5;c++) {
        const val = card[r][c]; const on = marked[r][c];
        html += `<div class="bingo-cell ${on ? 'marked' : ''} ${val === 'FREE' ? 'free' : ''}">${val}</div>`;
    }
    el.innerHTML = html;
}

async function playBingo() {
    if (window.bingoBusy) return;
    const bet = Number(window.selectedBingoBet || 10);
    if (balance < bet) return alert("Insufficient demo balance.");
    if (!tg.initData) return alert("Telegram authentication data is unavailable.");
    window.bingoBusy = true;
    const btn = document.getElementById("bingoButton"), result = document.getElementById("bingoResult");
    if (btn) { btn.disabled = true; btn.textContent = "🎯 DRAWING..."; }
    if (result) result.textContent = "Drawing your Bingo round...";
    try {
        const response = await fetch(`${API_URL}/api/game/bingo`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({initData:tg.initData, bet_amount:bet})});
        const data = await readJsonResponse(response);
        if (!response.ok || !data.success) throw new Error(data.error || `HTTP ${response.status}`);
        renderBingoCard(data.card || [], data.marked || []);
        const draw = Array.isArray(data.draw) ? data.draw : [];
        const drawEl = document.getElementById("bingoDraw");
        if (drawEl) drawEl.innerHTML = `<div class="draw-title">DRAWN NUMBERS</div><div class="draw-balls">${draw.map(n=>`<span>${n}</span>`).join('')}</div>`;
        balance = Number(data.balance); updateBalance();
        const bb = document.getElementById("bingoBalance"); if (bb) bb.textContent = balance.toLocaleString();
        const lw = document.getElementById("bingoLastWin"); if (lw) lw.textContent = Number(data.win || 0).toLocaleString();
        if (result) { result.innerHTML = data.win > 0 ? `🏆 <strong>BINGO!</strong><br>${data.winning_lines.length} line${data.winning_lines.length === 1 ? '' : 's'} • Won ${Number(data.win).toLocaleString()} credits` : `No Bingo this round.<br>Try again.`; result.classList.toggle('win', data.win > 0); }
    } catch (e) { if (result) result.textContent = e.message || "Bingo game failed."; }
    finally { window.bingoBusy=false; if (btn) { btn.disabled=false; btn.textContent="🎯 PLAY BINGO"; } }
}

// ==========================================
// WHEEL
// ==========================================

window.selectedWheelBet = 10;
window.wheelBusy = false;

function openWheel() {
    const modal=document.getElementById("gameModal"), icon=document.getElementById("gameIcon"), title=document.getElementById("gameTitle"), text=document.getElementById("gameText");
    if(!modal||!text)return alert("Wheel modal not found.");
    if(icon)icon.textContent="🎡"; if(title)title.textContent="Lucky Wheel"; modal.style.display="flex"; window.selectedWheelBet=10; window.wheelBusy=false;
    text.innerHTML=`<div class="wheel-game"><div class="wheel-hero"><div class="wheel-icon">🎡</div><div><div class="game-kicker">DEMO GAME • VIRTUAL CREDITS</div><h3>LUCKY WHEEL</h3><p>Spin the wheel and land on a multiplier.</p></div></div><div class="wheel-stage"><div class="wheel-pointer">▼</div><div id="wheelDisk" class="wheel-disk"><div class="wheel-center">SPIN</div></div></div><div class="wheel-bets"><button onclick="setWheelBet(10)" class="wheel-bet active">10</button><button onclick="setWheelBet(50)" class="wheel-bet">50</button><button onclick="setWheelBet(100)" class="wheel-bet">100</button><button onclick="setWheelBet(500)" class="wheel-bet">500</button></div><div class="wheel-stats"><div><span>BALANCE</span><strong id="wheelBalance">${Number(balance).toLocaleString()}</strong></div><div><span>BET</span><strong id="wheelBetValue">10</strong></div><div><span>LAST RESULT</span><strong id="wheelLast">—</strong></div></div><div id="wheelResult" class="wheel-result">Choose your bet and spin.</div><button id="wheelButton" onclick="spinWheel()" class="wheel-button">🎡 SPIN WHEEL</button><div class="game-hint">Demo wheel uses server-generated results.</div></div>`;
}
function setWheelBet(amount){if(window.wheelBusy)return;window.selectedWheelBet=Number(amount);const v=document.getElementById("wheelBetValue");if(v)v.textContent=amount;document.querySelectorAll('.wheel-bet').forEach(b=>b.classList.toggle('active',Number(b.textContent)===Number(amount)));}
async function spinWheel(){if(window.wheelBusy)return;const bet=Number(window.selectedWheelBet||10);if(balance<bet)return alert('Insufficient demo balance.');if(!tg.initData)return alert('Telegram authentication data is unavailable.');window.wheelBusy=true;const btn=document.getElementById('wheelButton'),disk=document.getElementById('wheelDisk'),res=document.getElementById('wheelResult');if(btn){btn.disabled=true;btn.textContent='🎡 SPINNING...';}if(res)res.textContent='The wheel is spinning...';try{const response=await fetch(`${API_URL}/api/game/wheel`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:tg.initData,bet_amount:bet})});const data=await readJsonResponse(response);if(!response.ok||!data.success)throw new Error(data.error||`HTTP ${response.status}`);const target=Number(data.segment_index||0);if(disk){disk.style.setProperty('--wheel-angle',`${1440+target*45}deg`);disk.classList.remove('wheel-spin');void disk.offsetWidth;disk.classList.add('wheel-spin');}await new Promise(r=>setTimeout(r,2200));balance=Number(data.balance);updateBalance();const wb=document.getElementById('wheelBalance');if(wb)wb.textContent=balance.toLocaleString();const wl=document.getElementById('wheelLast');if(wl)wl.textContent=data.label;if(res){res.innerHTML=data.win>0?`🏆 <strong>${data.label}</strong><br>Won ${Number(data.win).toLocaleString()} credits`:`<strong>${data.label}</strong><br>No win this time.`;res.classList.toggle('win',data.win>0);}}catch(e){if(res)res.textContent=e.message||'Wheel game failed.';}finally{window.wheelBusy=false;if(btn){btn.disabled=false;btn.textContent='🎡 SPIN WHEEL';}}}

// ==========================================
// AVIATOR
// ==========================================

window.aviatorBusy=false; window.currentAviatorGame=null; window.aviatorMultiplier=1.00; window.aviatorTimer=null;

function openAviator(){
    const modal=document.getElementById('gameModal'),icon=document.getElementById('gameIcon'),title=document.getElementById('gameTitle'),text=document.getElementById('gameText');if(!modal||!text)return alert('Aviator modal not found.');if(icon)icon.textContent='✈️';if(title)title.textContent='Aviator';modal.style.display='flex';window.aviatorBusy=false;window.currentAviatorGame=null;window.aviatorMultiplier=1;renderAviatorStart();
}
function renderAviatorStart(){const text=document.getElementById('gameText');if(!text)return;text.innerHTML=`<div class="aviator-game"><div class="aviator-hero"><div class="aviator-icon">✈️</div><div><div class="game-kicker">DEMO GAME • VIRTUAL CREDITS</div><h3>AVIATOR</h3><p>Watch the multiplier rise. Cash out before the crash.</p></div></div><div class="aviator-stage"><div class="aviator-clouds">☁︎　 ☁︎　　 ☁︎</div><div id="aviatorPlane">✈️</div><strong id="aviatorMultiplier">1.00x</strong><small id="aviatorStatus">READY FOR TAKEOFF</small></div><div class="aviator-stats"><div><span>BALANCE</span><strong id="aviatorBalance">${Number(balance).toLocaleString()}</strong></div><div><span>BET</span><strong id="aviatorBet">10</strong></div><div><span>RESULT</span><strong id="aviatorLast">—</strong></div></div><div class="aviator-bets"><button onclick="setAviatorBet(10)" class="aviator-bet active">10</button><button onclick="setAviatorBet(50)" class="aviator-bet">50</button><button onclick="setAviatorBet(100)" class="aviator-bet">100</button><button onclick="setAviatorBet(500)" class="aviator-bet">500</button></div><div id="aviatorResult" class="aviator-result">Start a demo flight.</div><button id="aviatorButton" onclick="startAviator()" class="aviator-button">✈️ START FLIGHT</button><div class="game-hint">Server decides the hidden crash point.</div></div>`;}
function setAviatorBet(amount){if(window.aviatorBusy)return;window.selectedAviatorBet=Number(amount);const v=document.getElementById('aviatorBet');if(v)v.textContent=amount;document.querySelectorAll('.aviator-bet').forEach(b=>b.classList.toggle('active',Number(b.textContent)===Number(amount)));}
async function startAviator(){if(window.aviatorBusy)return;const bet=Number(window.selectedAviatorBet||10);if(balance<bet)return alert('Insufficient demo balance.');if(!tg.initData)return alert('Telegram authentication data is unavailable.');window.aviatorBusy=true;const btn=document.getElementById('aviatorButton'),res=document.getElementById('aviatorResult'),status=document.getElementById('aviatorStatus');if(btn){btn.disabled=true;btn.textContent='✈️ TAKING OFF...';}if(res)res.textContent='Flight starting...';try{const response=await fetch(`${API_URL}/api/game/aviator/start`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:tg.initData,bet_amount:bet})});const data=await readJsonResponse(response);if(!response.ok||!data.success)throw new Error(data.error||`HTTP ${response.status}`);window.currentAviatorGame={game_id:Number(data.game_id),bet:Number(data.bet)};balance=Number(data.balance);updateBalance();const ab=document.getElementById('aviatorBalance');if(ab)ab.textContent=balance.toLocaleString();window.aviatorMultiplier=1;const mult=document.getElementById('aviatorMultiplier');if(mult)mult.textContent='1.00x';if(status)status.textContent='FLIGHT IN PROGRESS';if(res)res.textContent='Cash out whenever you want.';if(btn){btn.disabled=false;btn.textContent='💰 CASH OUT';btn.onclick=cashoutAviator;}runAviatorAnimation();}catch(e){if(res)res.textContent=e.message||'Aviator start failed.';window.aviatorBusy=false;if(btn){btn.disabled=false;btn.textContent='✈️ START FLIGHT';}}}
function runAviatorAnimation(){clearInterval(window.aviatorTimer);window.aviatorTimer=setInterval(()=>{window.aviatorMultiplier=Number((window.aviatorMultiplier+Math.max(.01,window.aviatorMultiplier*.035)).toFixed(2));const m=document.getElementById('aviatorMultiplier');if(m)m.textContent=window.aviatorMultiplier.toFixed(2)+'x';const p=document.getElementById('aviatorPlane');if(p)p.style.transform=`translate(${Math.min(150,window.aviatorMultiplier*9)}px,${-Math.min(75,window.aviatorMultiplier*4)}px)`;},120);}
async function cashoutAviator(){if(!window.currentAviatorGame)return;clearInterval(window.aviatorTimer);const btn=document.getElementById('aviatorButton'),res=document.getElementById('aviatorResult'),status=document.getElementById('aviatorStatus');if(btn)btn.disabled=true;if(res)res.textContent='Processing cash out...';try{const response=await fetch(`${API_URL}/api/game/aviator/cashout`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:tg.initData,game_id:window.currentAviatorGame.game_id,multiplier:window.aviatorMultiplier})});const data=await readJsonResponse(response);if(!response.ok||!data.success)throw new Error(data.error||`HTTP ${response.status}`);balance=Number(data.balance);updateBalance();const ab=document.getElementById('aviatorBalance');if(ab)ab.textContent=balance.toLocaleString();const al=document.getElementById('aviatorLast');if(al)al.textContent=data.result==='cashed_out'?`${Number(data.cashout).toFixed(2)}x`:`CRASH`;if(status)status.textContent=data.result==='cashed_out'?'CASHED OUT':'CRASHED';if(res)res.innerHTML=data.result==='cashed_out'?`🏆 <strong>CAShed OUT</strong><br>${Number(data.cashout).toFixed(2)}x • Won ${Number(data.win).toLocaleString()} credits`:`💥 <strong>CRASHED</strong><br>Crash point ${Number(data.crash).toFixed(2)}x`;window.currentAviatorGame=null;window.aviatorBusy=false;if(btn){btn.disabled=false;btn.textContent='✈️ NEW FLIGHT';btn.onclick=()=>{window.aviatorBusy=false;renderAviatorStart();};}}catch(e){if(res)res.textContent=e.message||'Cash out failed.';window.aviatorBusy=false;if(btn){btn.disabled=false;btn.textContent='💰 CASH OUT';}}}

(function installRemainingGameStyles(){if(document.getElementById('remainingGameStyles'))return;const s=document.createElement('style');s.id='remainingGameStyles';s.textContent=`
.game-kicker{font-size:9px;font-weight:900;letter-spacing:.13em;opacity:.52}.game-hint{text-align:center;font-size:10px;opacity:.42;margin-top:8px}
.bingo-game,.wheel-game,.aviator-game{width:100%;color:#fff}.bingo-hero,.wheel-hero,.aviator-hero{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:linear-gradient(135deg,rgba(70,90,150,.3),rgba(18,24,39,.7));border:1px solid rgba(255,255,255,.08)}.bingo-icon,.wheel-icon,.aviator-icon{width:54px;height:54px;display:grid;place-items:center;border-radius:15px;background:rgba(255,255,255,.07);font-size:29px;flex:0 0 54px}.bingo-hero h3,.wheel-hero h3,.aviator-hero h3{margin:3px 0;font-size:23px;letter-spacing:.04em}.bingo-hero p,.wheel-hero p,.aviator-hero p{margin:0;font-size:11px;opacity:.55}.bingo-stats,.wheel-stats,.aviator-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:11px 0}.bingo-stats>div,.wheel-stats>div,.aviator-stats>div{padding:10px 7px;text-align:center;border-radius:13px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06)}.bingo-stats span,.wheel-stats span,.aviator-stats span{display:block;font-size:8px;letter-spacing:.08em;opacity:.48}.bingo-stats strong,.wheel-stats strong,.aviator-stats strong{display:block;margin-top:4px;font-size:13px}.bingo-card{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;padding:10px;border-radius:17px;background:#0b1220;border:1px solid rgba(255,255,255,.07)}.bingo-cell{aspect-ratio:1;display:grid;place-items:center;border-radius:9px;background:#1a2740;font-weight:800;font-size:14px}.bingo-cell.marked{background:#1b705e;color:#75f4cf;box-shadow:0 0 0 1px rgba(72,225,145,.25)}.bingo-cell.free{background:#4b3a70;color:#fff}.bingo-empty{grid-column:1/-1;text-align:center;padding:30px 8px;font-size:12px;opacity:.5}.bingo-draw{margin:9px 0}.draw-title{text-align:center;font-size:8px;font-weight:900;letter-spacing:.12em;opacity:.45;margin-bottom:6px}.draw-balls{display:flex;flex-wrap:wrap;justify-content:center;gap:4px}.draw-balls span{width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.07);font-size:9px;font-weight:800}.bingo-bets,.wheel-bets,.aviator-bets{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0}.bingo-bet,.wheel-bet,.aviator-bet{padding:9px 4px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#172139;color:#fff;font-weight:800}.bingo-bet.active,.wheel-bet.active,.aviator-bet.active{background:#2a6df4;border-color:#5c91ff}.bingo-result,.wheel-result,.aviator-result{min-height:48px;display:grid;place-items:center;text-align:center;border-radius:13px;background:rgba(255,255,255,.045);font-size:12px;line-height:1.4;padding:9px;margin:8px 0}.bingo-result.win,.wheel-result.win,.aviator-result.win{background:rgba(47,205,125,.12);border:1px solid rgba(72,225,145,.3)}.bingo-button,.wheel-button,.aviator-button{width:100%;padding:14px;border:0;border-radius:14px;color:#fff;font-weight:900;background:linear-gradient(135deg,#3d79ff,#6258e8)}.bingo-button:disabled,.wheel-button:disabled,.aviator-button:disabled{opacity:.5}.wheel-stage{position:relative;width:min(72vw,280px);height:min(72vw,280px);margin:15px auto}.wheel-disk{width:100%;height:100%;border-radius:50%;border:8px solid #27324a;background:conic-gradient(#3d79ff 0 45deg,#1c2740 45deg 90deg,#3ccf91 90deg 135deg,#1c2740 135deg 180deg,#e9b949 180deg 225deg,#1c2740 225deg 270deg,#ef5c78 270deg 315deg,#1c2740 315deg 360deg);box-shadow:0 15px 35px rgba(0,0,0,.35);position:relative}.wheel-disk:after{content:'0.5x     2x     5x     10x     3x     1x     0x     1x';position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-weight:900;font-size:11px;line-height:5}.wheel-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:66px;height:66px;border-radius:50%;display:grid;place-items:center;background:#101828;border:3px solid #fff;font-size:10px;font-weight:900;z-index:2}.wheel-pointer{position:absolute;z-index:4;top:-6px;left:50%;transform:translateX(-50%);font-size:26px;color:#fff}.wheel-spin{animation:wheelSpin 2.2s cubic-bezier(.12,.72,.17,1) forwards}@keyframes wheelSpin{to{transform:rotate(var(--wheel-angle))}}.aviator-stage{position:relative;height:230px;margin:12px 0;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 30% 70%,rgba(55,135,255,.22),transparent 30%),linear-gradient(155deg,#122746,#07111f);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;align-items:center;justify-content:center}.aviator-stage strong{font-size:42px;letter-spacing:-1px;z-index:2}.aviator-stage small{font-size:9px;letter-spacing:.12em;opacity:.5;margin-top:5px}.aviator-clouds{position:absolute;top:20px;left:10px;right:10px;opacity:.13;font-size:26px}.aviator-stage #aviatorPlane{position:absolute;bottom:45px;left:18%;font-size:28px;transition:transform .12s linear}.aviator-button{background:linear-gradient(135deg,#16b982,#087e5d)}
@media(max-width:390px){.bingo-cell{font-size:11px}.wheel-stage{width:230px;height:230px}.aviator-stage{height:210px}.aviator-stage strong{font-size:35px}}
`;document.head.appendChild(s);})();

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

    if (currentGame === "slots") { spinSlots(); return; }
    if (currentGame === "keno") { drawKeno(); return; }
    if (currentGame === "bingo") { playBingo(); return; }
    if (currentGame === "wheel") { spinWheel(); return; }
    if (currentGame === "aviator") { startAviator(); return; }
    alert("This demo game is ready from its game card.");
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
