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

    updateMinesBalanceDisplay();
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
window.minesSelectedBet = 10;
window.minesSelectedMineCount = 5;


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


function clampMinesBet(amount) {
    const maxBet = Math.max(10, Math.min(500, Math.floor(Number(balance) || 0)));
    let value = Math.floor(Number(amount) || 10);
    value = Math.max(10, Math.min(maxBet, value));
    return Math.floor(value / 10) * 10 || 10;
}

function setMinesBet(amount) {
    if (window.minesBusy) return;
    const value = clampMinesBet(amount);
    window.minesSelectedBet = value;

    const display = document.getElementById("minesSelectedBet");
    if (display) display.textContent = value.toLocaleString();

    const preview = document.getElementById("minesPreviewBet");
    if (preview) preview.textContent = value.toLocaleString();

    const replay = document.getElementById("minesReplayBet");
    if (replay) replay.textContent = value.toLocaleString() + " credits";

    updateMinesBetButtons();
    updateMinesBalanceDisplay();
}

function changeMinesBet(delta) {
    if (window.minesBusy) return;
    const current = Number(window.minesSelectedBet || 10);
    setMinesBet(current + (delta > 0 ? 10 : -10));
}

function updateMinesBetButtons() {
    const selected = Number(window.minesSelectedBet || 10);
    document.querySelectorAll(".mines-quick-bet").forEach(button => {
        button.classList.toggle("active", Number(button.textContent.trim()) === selected);
        button.disabled = window.minesBusy;
    });
}

function updateMinesBalanceDisplay() {
    const display = document.getElementById("minesAvailableBalance");
    if (display) display.textContent = Number(balance).toLocaleString();

    const start = document.getElementById("startMinesButton");
    if (start && !window.minesBusy) {
        start.disabled = balance < Number(window.minesSelectedBet || 10);
    }
}

function rememberMinesSettings() {
    const count = document.getElementById("minesCount");
    if (count) window.minesSelectedMineCount = Number(count.value);
}

function renderMinesStartScreen() {
    const text = document.getElementById("gameText");
    if (!text) return;

    const savedBet = Number(window.minesSelectedBet || 10);
    const savedMines = Number(window.minesSelectedMineCount || 5);

    text.innerHTML = `
        <div class="mines-game">
            <div class="mines-hero">
                <div class="mines-bomb">💣</div>
                <div>
                    <div class="mines-kicker">DEMO GAME • VIRTUAL CREDITS</div>
                    <h3>MINES</h3>
                    <p>Reveal gems and build your multiplier.</p>
                </div>
            </div>

            <div class="mines-wallet-card">
                <div>
                    <span>AVAILABLE BALANCE</span>
                    <strong id="minesAvailableBalance">${Number(balance).toLocaleString()}</strong>
                </div>
                <div class="mines-wallet-icon">🪙</div>
            </div>

            <div class="mines-control-card">
                <div class="mines-control-title">BET AMOUNT</div>
                <div class="mines-bet-picker">
                    <button type="button" class="mines-adjust" onclick="changeMinesBet(-10)">−</button>
                    <div class="mines-current-bet">
                        <strong id="minesSelectedBet">${savedBet}</strong>
                        <small>credits</small>
                    </div>
                    <button type="button" class="mines-adjust" onclick="changeMinesBet(10)">+</button>
                </div>

                <div class="mines-quick-bets">
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(10)">10</button>
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(50)">50</button>
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(100)">100</button>
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(500)">500</button>
                </div>
            </div>

            <div class="mines-settings">
                <div class="mines-setting">
                    <label>MINES</label>
                    <select id="minesCount">
                        <option value="3" ${savedMines === 3 ? "selected" : ""}>3 mines</option>
                        <option value="5" ${savedMines === 5 ? "selected" : ""}>5 mines</option>
                        <option value="7" ${savedMines === 7 ? "selected" : ""}>7 mines</option>
                        <option value="10" ${savedMines === 10 ? "selected" : ""}>10 mines</option>
                        <option value="15" ${savedMines === 15 ? "selected" : ""}>15 mines</option>
                    </select>
                </div>
                <div class="mines-setting">
                    <label>GRID</label>
                    <div class="mines-grid-fixed">5 × 5</div>
                </div>
            </div>

            <div class="mines-risk-card">
                <div><span>SAFE TILES</span><strong id="minesSafePreview">${25 - savedMines}</strong></div>
                <div><span>BET</span><strong id="minesPreviewBet">${savedBet}</strong></div>
                <div><span>MODE</span><strong>DEMO</strong></div>
            </div>

            <button id="startMinesButton" onclick="startMines()" class="mines-start-button">
                💎 START GAME
            </button>

            <div id="minesMessage" class="mines-message">Set your bet and choose the number of mines.</div>
            <div id="minesTestResult" class="mines-test-result"></div>
        </div>
    `;

    const count = document.getElementById("minesCount");
    if (count) count.addEventListener("change", updateMinesSafePreview);
    updateMinesSafePreview();
    updateMinesBetButtons();
    updateMinesBalanceDisplay();
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


    const bet = clampMinesBet(
        Number(window.minesSelectedBet || betElement?.value || 10)
    );

    const mineCount = Number(
        window.minesSelectedMineCount ||
        minesElement?.value ||
        5
    );


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
                    <div class="mines-kicker">${active ? "GAME IN PROGRESS" : "ROUND COMPLETE"}</div>
                    <h3>MINES</h3>
                </div>
                <div class="mines-live-pill ${active ? "active" : "ended"}">
                    <span></span>${active ? "LIVE" : "ENDED"}
                </div>
            </div>

            <div class="mines-wallet-card active-wallet">
                <div>
                    <span>AVAILABLE BALANCE</span>
                    <strong id="minesAvailableBalance">${Number(balance).toLocaleString()}</strong>
                </div>
                <div class="mines-wallet-meta">
                    <small>BET</small>
                    <b>${Number(game.bet).toLocaleString()}</b>
                </div>
            </div>

            <div class="mines-stats">
                <div><span>BET</span><strong>${Number(game.bet).toLocaleString()}</strong></div>
                <div><span>MULTIPLIER</span><strong id="minesMultiplier">${Number(game.multiplier).toFixed(2)}x</strong></div>
                <div><span>WIN</span><strong id="minesPotentialWin">${Number(game.potential_win).toLocaleString()}</strong></div>
            </div>

            <div class="mines-grid-shell">
                <div class="mines-grid-title">
                    <span>REVEAL SAFE TILES</span>
                    <span>5 × 5</span>
                    <span>${game.mine_count} MINES</span>
                </div>
                <div id="minesGrid" class="mines-grid"></div>
            </div>

            <div id="minesMessage" class="mines-message">
                ${active
                    ? (revealedCount
                        ? "💎 Safe tile found. Continue or secure your current win."
                        : "Select a tile to start the round.")
                    : "Round complete. Your previous bet is ready for the next round."}
            </div>

            <div class="mines-actions">
                <button id="cashoutMinesButton" onclick="cashoutMines()" class="mines-cashout-button" ${(!active || revealedCount < 1) ? "disabled" : ""}>
                    💰 CASH OUT <span id="minesCashoutAmount">${Number(game.potential_win).toLocaleString()}</span>
                </button>

                ${active ? `
                    <button id="minesNewGameButton" class="mines-new-game-button" disabled>
                        🔒 ROUND ACTIVE
                    </button>
                ` : `
                    <div class="mines-replay-card">
                        <div class="mines-replay-copy">
                            <span>QUICK REPLAY</span>
                            <strong>${Number(window.minesSelectedBet || game.bet).toLocaleString()} credits</strong>
                        </div>
                        <div class="mines-replay-controls">
                            <button type="button" class="mines-adjust small" onclick="changeMinesBet(-10)">−</button>
                            <button type="button" class="mines-replay-button" onclick="startAnotherMinesGame()">
                                🔁 PLAY AGAIN
                            </button>
                            <button type="button" class="mines-adjust small" onclick="changeMinesBet(10)">+</button>
                        </div>
                    </div>
                `}
            </div>

            <div id="minesStatus" class="mines-status">
                ${active
                    ? `Revealed: ${revealedCount} / ${25 - Number(game.mine_count)}`
                    : `Last round • ${revealedCount} safe tiles revealed`}
            </div>
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
    updateMinesBalanceDisplay();
    setMinesGridEnabled(active);

    if (!active) {
        revealAllMines(game.mines || []);
    }
}

async function startAnotherMinesGame() {
    if (window.currentMinesGame && window.currentMinesGame.status === "active") {
        return;
    }

    const bet = clampMinesBet(
        Number(window.minesSelectedBet || (window.currentMinesGame && window.currentMinesGame.bet) || 10)
    );
    window.minesSelectedBet = bet;

    const mineCount = Number(
        window.minesSelectedMineCount ||
        (window.currentMinesGame && window.currentMinesGame.mine_count) ||
        5
    );

    if (balance < bet) {
        renderMinesStartScreen();
        const message = document.getElementById("minesMessage");
        if (message) {
            message.textContent = "Your balance is too low for this bet. Reduce the bet to continue.";
        }
        return;
    }

    await startMines();
}

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

function renderMinesFinishedState(resultType) {
    const game = window.currentMinesGame;
    const text = document.getElementById("gameText");
    if (!game || !text) return;

    const titles = {
        mine: "Mine hit",
        won: "Round won",
        cashed_out: "Win secured"
    };

    const messages = {
        mine: "The round has ended. Your saved bet is ready for quick replay.",
        won: "All safe tiles were revealed. Your saved bet is ready for another round.",
        cashed_out: "Your demo win has been secured. Your saved bet is ready for another round."
    };

    text.innerHTML = `
        <div class="mines-game mines-finished">
            <div class="mines-result-card ${resultType}">
                <div class="mines-result-icon">${resultType === "mine" ? "💥" : "✓"}</div>
                <div class="mines-kicker">${resultType === "mine" ? "ROUND ENDED" : "ROUND COMPLETE"}</div>
                <h3>${titles[resultType] || "Round complete"}</h3>
                <p>${messages[resultType] || "Round complete."}</p>
            </div>

            <div class="mines-wallet-card">
                <div>
                    <span>AVAILABLE BALANCE</span>
                    <strong id="minesAvailableBalance">${Number(balance).toLocaleString()}</strong>
                </div>
                <div class="mines-wallet-meta">
                    <small>LAST BET</small>
                    <b>${Number(window.minesSelectedBet || game.bet).toLocaleString()}</b>
                </div>
            </div>

            <div class="mines-stats">
                <div><span>LAST BET</span><strong>${Number(game.bet).toLocaleString()}</strong></div>
                <div><span>MULTIPLIER</span><strong>${Number(game.multiplier).toFixed(2)}x</strong></div>
                <div><span>RESULT</span><strong>${resultType === "mine" ? "0" : Number(game.potential_win).toLocaleString()}</strong></div>
            </div>

            <div class="mines-replay-card">
                <div class="mines-replay-heading">
                    <div>
                        <span>QUICK REPLAY</span>
                        <strong id="minesReplayBet">${Number(window.minesSelectedBet || game.bet).toLocaleString()} credits</strong>
                    </div>
                    <small>Same setup, one tap</small>
                </div>

                <div class="mines-replay-controls">
                    <button type="button" class="mines-adjust small" onclick="changeMinesBet(-10)">−</button>
                    <button type="button" class="mines-replay-button" onclick="startAnotherMinesGame()">
                        🔁 PLAY AGAIN
                    </button>
                    <button type="button" class="mines-adjust small" onclick="changeMinesBet(10)">+</button>
                </div>

                <div class="mines-quick-bets">
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(10)">10</button>
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(50)">50</button>
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(100)">100</button>
                    <button type="button" class="mines-quick-bet" onclick="setMinesBet(500)">500</button>
                </div>
            </div>

            <div id="minesMessage" class="mines-message">
                ${resultType === "mine" ? "Try again with the same bet or adjust it below." : "Play another round with the same bet or adjust it below."}
            </div>

            <div class="mines-status">
                ${Number(game.mine_count)} mines • 5 × 5 grid
            </div>
        </div>
    `;

    updateMinesBetButtons();
    updateMinesBalanceDisplay();
}
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

        renderMinesFinishedState("cashed_out");


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
