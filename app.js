// ============================================================
// GAME ZONE - TELEGRAM MINI APP
// Slots + Mines Demo
// ============================================================

const tg = window.Telegram.WebApp;


// ============================================================
// RENDER BACKEND
// ============================================================

const API_URL =
    "https://gamezone-backend-1-luwe.onrender.com";


// ============================================================
// TELEGRAM INITIALIZATION
// ============================================================

tg.ready();
tg.expand();


// ============================================================
// APPLICATION VARIABLES
// ============================================================

let balance = 10000;
let currentUser = null;
let currentGame = null;

let spinning = false;

let selectedSlotsBet = 10;

let currentMinesGame = null;
let minesBusy = false;


// ============================================================
// GET TELEGRAM USER
// ============================================================

function getTelegramUser() {

    if (
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user
    ) {
        return tg.initDataUnsafe.user;
    }

    return null;
}


// ============================================================
// LOAD USER
// ============================================================

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

        const response =
            await fetch(
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


        const responseText =
    await response.text();

console.log(
    "Slots raw server response:",
    responseText
);

let data;

try {

    data =
        JSON.parse(responseText);

} catch (jsonError) {

    console.error(
        "Slots returned invalid JSON:",
        jsonError
    );

    throw new Error(
        "Server returned an invalid response. Check Render logs."
    );
}


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

            updateUsername();

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


// ============================================================
// UPDATE USERNAME
// ============================================================

function updateUsername() {

    const user =
        getTelegramUser();

    if (!user) {
        return;
    }

    const elements =
        document.querySelectorAll(
            "#username"
        );

    elements.forEach(
        function(element) {

            element.textContent =
                user.first_name ||
                user.username ||
                "Player";
        }
    );
}


// ============================================================
// UPDATE BALANCE
// ============================================================

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


// ============================================================
// GAME MODAL
// ============================================================

function openGame(game) {

    currentGame =
        game;


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


    const selected =
        games[game];


    if (!selected) {

        title.textContent =
            "Game";

        text.textContent =
            "Game not found.";

        return;
    }


    if (icon) {

        icon.textContent =
            selected.icon;
    }


    title.textContent =
        selected.title;


    text.textContent =
        selected.text;


    modal.style.display =
        "flex";
}


// ============================================================
// SLOTS
// ============================================================

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


    if (!modal || !text) {

        alert(
            "Slots modal not found."
        );

        return;
    }


    currentGame =
        "slots";


    spinning =
        false;


    selectedSlotsBet =
        10;


    if (icon) {

        icon.textContent =
            "🎰";
    }


    if (title) {

        title.textContent =
            "Lucky Slots";
    }


    text.innerHTML = `

        <div
            id="slotsGame"
            style="
                width:100%;
                max-width:420px;
                margin:0 auto;
                box-sizing:border-box;
            "
        >

            <!-- TOP STATUS -->

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:12px;
                    gap:10px;
                "
            >

                <div
                    style="
                        flex:1;
                        padding:10px;
                        border-radius:12px;
                        background:rgba(255,255,255,.08);
                        text-align:center;
                    "
                >

                    <div
                        style="
                            font-size:11px;
                            opacity:.7;
                        "
                    >
                        DEMO BALANCE
                    </div>

                    <strong
                        id="slotsBalance"
                        style="
                            display:block;
                            margin-top:3px;
                            font-size:17px;
                        "
                    >
                        ${Number(balance).toLocaleString()}
                    </strong>

                </div>


                <div
                    style="
                        flex:1;
                        padding:10px;
                        border-radius:12px;
                        background:rgba(255,255,255,.08);
                        text-align:center;
                    "
                >

                    <div
                        style="
                            font-size:11px;
                            opacity:.7;
                        "
                    >
                        CURRENT BET
                    </div>

                    <strong
                        id="selectedSlotsBet"
                        style="
                            display:block;
                            margin-top:3px;
                            font-size:17px;
                        "
                    >
                        10
                    </strong>

                </div>

            </div>


            <!-- JACKPOT DISPLAY -->

            <div
                style="
                    text-align:center;
                    margin:5px 0 12px;
                    padding:9px;
                    border-radius:12px;
                    background:linear-gradient(
                        135deg,
                        rgba(255,215,0,.18),
                        rgba(255,120,0,.10)
                    );
                    border:1px solid rgba(255,215,0,.25);
                "
            >

                <div
                    style="
                        font-size:11px;
                        opacity:.7;
                        letter-spacing:1px;
                    "
                >
                    ⭐ LUCKY SLOTS ⭐
                </div>

                <div
                    style="
                        font-size:13px;
                        margin-top:3px;
                    "
                >
                    Match 3 symbols to win
                </div>

            </div>


            <!-- REEL MACHINE -->

            <div
                style="
                    position:relative;
                    padding:12px;
                    border-radius:20px;
                    background:
                        linear-gradient(
                            145deg,
                            #151515,
                            #292929
                        );
                    border:2px solid rgba(255,255,255,.15);
                    box-shadow:
                        0 12px 30px rgba(0,0,0,.35),
                        inset 0 1px 0 rgba(255,255,255,.08);
                "
            >

                <!-- PAYLINE -->

                <div
                    style="
                        position:absolute;
                        left:7px;
                        right:7px;
                        top:50%;
                        height:3px;
                        transform:translateY(-50%);
                        background:rgba(255,215,0,.65);
                        box-shadow:
                            0 0 10px rgba(255,215,0,.55);
                        z-index:3;
                        pointer-events:none;
                        border-radius:5px;
                    "
                ></div>


                <!-- REELS -->

                <div
                    id="slotsReels"
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(3,1fr);
                        gap:8px;
                        position:relative;
                        z-index:2;
                    "
                >

                    ${createSlotReel("❔", 0)}

                    ${createSlotReel("❔", 1)}

                    ${createSlotReel("❔", 2)}

                </div>

            </div>


            <!-- MESSAGE -->

            <div
                id="slotsMessage"
                style="
                    min-height:42px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    text-align:center;
                    padding:8px;
                    font-size:14px;
                    font-weight:600;
                "
            >
                Choose your demo bet.
            </div>


            <!-- BET CONTROLS -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap:8px;
                    margin-bottom:10px;
                "
            >

                <button
                    id="slotsMinusButton"
                    onclick="changeSlotsBet(-10)"
                    style="
                        width:45px;
                        height:42px;
                        border:0;
                        border-radius:12px;
                        font-size:20px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    −
                </button>


                <div
                    style="
                        flex:1;
                        max-width:180px;
                        text-align:center;
                        padding:10px;
                        border-radius:12px;
                        background:rgba(255,255,255,.08);
                    "
                >

                    <span
                        style="
                            font-size:11px;
                            opacity:.65;
                            display:block;
                        "
                    >
                        BET AMOUNT
                    </span>

                    <strong
                        id="slotsBetAmount"
                        style="
                            font-size:20px;
                        "
                    >
                        10
                    </strong>

                    <span
                        style="
                            font-size:11px;
                            opacity:.65;
                        "
                    >
                        credits
                    </span>

                </div>


                <button
                    id="slotsPlusButton"
                    onclick="changeSlotsBet(10)"
                    style="
                        width:45px;
                        height:42px;
                        border:0;
                        border-radius:12px;
                        font-size:20px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    +
                </button>

            </div>


            <!-- QUICK BETS -->

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(4,1fr);
                    gap:7px;
                    margin-bottom:12px;
                "
            >

                <button
                    onclick="setSlotsBet(10)"
                    class="slotsQuickBet"
                    data-bet="10"
                >
                    10
                </button>

                <button
                    onclick="setSlotsBet(50)"
                    class="slotsQuickBet"
                    data-bet="50"
                >
                    50
                </button>

                <button
                    onclick="setSlotsBet(100)"
                    class="slotsQuickBet"
                    data-bet="100"
                >
                    100
                </button>

                <button
                    onclick="setSlotsBet(500)"
                    class="slotsQuickBet"
                    data-bet="500"
                >
                    500
                </button>

            </div>


            <!-- SPIN BUTTON -->

            <button
                id="spinSlotsButton"
                onclick="spinSlots()"
                style="
                    width:100%;
                    min-height:56px;
                    border:0;
                    border-radius:16px;
                    cursor:pointer;
                    font-size:19px;
                    font-weight:900;
                    letter-spacing:.5px;
                    background:
                        linear-gradient(
                            135deg,
                            #ffcf33,
                            #ff8a00
                        );
                    box-shadow:
                        0 7px 18px
                        rgba(255,145,0,.30);
                "
            >
                🎰 SPIN
            </button>


            <!-- DEMO NOTICE -->

            <div
                style="
                    text-align:center;
                    margin-top:10px;
                    font-size:10px;
                    opacity:.5;
                "
            >
                Demo credits only
            </div>

        </div>

    `;


    addSlotsStyles();

    updateSlotsBetUI();

    updateSlotsBalanceUI();

    modal.style.display =
        "flex";
}


// ============================================================
// CREATE SLOT REEL
// ============================================================

function createSlotReel(symbol, index) {

    return `

        <div
            id="slotReel${index}"
            class="slotReel"
            style="
                height:105px;
                overflow:hidden;
                border-radius:14px;
                background:
                    linear-gradient(
                        180deg,
                        #f7f7f7,
                        #dddddd
                    );
                display:flex;
                align-items:center;
                justify-content:center;
                position:relative;
                box-shadow:
                    inset 0 0 12px
                    rgba(0,0,0,.25);
            "
        >

            <div
                class="slot-symbol"
                style="
                    width:100%;
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:50px;
                    line-height:1;
                    color:#111;
                    text-shadow:
                        0 2px 3px
                        rgba(0,0,0,.15);
                "
            >
                ${symbol}
            </div>

        </div>

    `;
}


// ============================================================
// SLOT STYLES
// ============================================================

function addSlotsStyles() {

    if (
        document.getElementById(
            "gamezoneSlotsStyles"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "gamezoneSlotsStyles";


    style.textContent = `

        .slotsQuickBet {
            min-height:40px;
            border:0;
            border-radius:10px;
            cursor:pointer;
            font-weight:800;
            background:rgba(255,255,255,.08);
            transition:
                transform .15s ease,
                background .15s ease;
        }

        .slotsQuickBet:active {
            transform:scale(.94);
        }

        .slotsQuickBet.selected {
            background:
                linear-gradient(
                    135deg,
                    #ffd43b,
                    #ff9800
                );
            color:#111;
        }

        .slotReel.spinning {
            animation:
                slotShake .12s
                linear infinite;
        }

        .slotReel.win {
            box-shadow:
                0 0 0 3px
                rgba(255,215,0,.9),
                0 0 22px
                rgba(255,215,0,.75);
            animation:
                slotWin .45s
                ease-in-out
                infinite alternate;
        }

        @keyframes slotShake {

            0% {
                transform:translateY(-2px);
            }

            50% {
                transform:translateY(2px);
            }

            100% {
                transform:translateY(-2px);
            }
        }

        @keyframes slotWin {

            from {
                transform:scale(1);
            }

            to {
                transform:scale(1.035);
            }
        }

        .slots-win-message {
            animation:
                slotsWinMessage
                .4s
                ease-out;
        }

        @keyframes slotsWinMessage {

            from {
                transform:scale(.85);
                opacity:.3;
            }

            to {
                transform:scale(1);
                opacity:1;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


// ============================================================
// SET SLOTS BET
// ============================================================

function setSlotsBet(amount) {

    if (spinning) {
        return;
    }


    amount =
        Number(amount);


    if (
        amount < 10
    ) {

        amount =
            10;
    }


    if (
        amount > 500
    ) {

        amount =
            500;
    }


    selectedSlotsBet =
        amount;


    updateSlotsBetUI();
}


// ============================================================
// CHANGE SLOTS BET
// ============================================================

function changeSlotsBet(change) {

    if (spinning) {
        return;
    }


    setSlotsBet(
        selectedSlotsBet +
        change
    );
}


// ============================================================
// UPDATE SLOTS BET UI
// ============================================================

function updateSlotsBetUI() {

    const selected =
        document.getElementById(
            "selectedSlotsBet"
        );

    const amount =
        document.getElementById(
            "slotsBetAmount"
        );


    if (selected) {

        selected.textContent =
            selectedSlotsBet;
    }


    if (amount) {

        amount.textContent =
            selectedSlotsBet;
    }


    const buttons =
        document.querySelectorAll(
            ".slotsQuickBet"
        );


    buttons.forEach(
        function(button) {

            const bet =
                Number(
                    button.dataset.bet
                );


            if (
                bet ===
                selectedSlotsBet
            ) {

                button.classList.add(
                    "selected"
                );

            } else {

                button.classList.remove(
                    "selected"
                );
            }
        }
    );
}


// ============================================================
// UPDATE SLOTS BALANCE
// ============================================================

function updateSlotsBalanceUI() {

    const element =
        document.getElementById(
            "slotsBalance"
        );


    if (element) {

        element.textContent =
            Number(
                balance
            ).toLocaleString();
    }
}


// ============================================================
// SPIN SLOTS
// ============================================================

async function spinSlots() {

    if (spinning) {
        return;
    }


    const bet =
        Number(
            selectedSlotsBet
        );


    if (
        bet < 10 ||
        bet > 500
    ) {

        alert(
            "Please select a valid demo bet."
        );

        return;
    }


    if (
        balance <
        bet
    ) {

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


    spinning =
        true;


    const button =
        document.getElementById(
            "spinSlotsButton"
        );

    const message =
        document.getElementById(
            "slotsMessage"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "🎰 SPINNING...";
    }


    disableSlotsControls(
        true
    );


    clearSlotWin();


    if (message) {

        message.className = "";

        message.innerHTML =
            "🎰 Reels spinning...";
    }


    startFakeSlotAnimation();


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


        stopFakeSlotAnimation();


        await revealSlotResult(
            data.symbols
        );


        balance =
            Number(
                data.balance
            );


        updateBalance();

        updateSlotsBalanceUI();


        if (
            Number(data.win) >
            0
        ) {

            highlightWinningSlots();

            showSlotsWin(
                Number(data.win),
                data.symbols
            );

        } else {

            if (message) {

                message.innerHTML =
                    `
                    <span>
                        😔 No win this time.
                        <br>
                        <small>
                            Try another spin!
                        </small>
                    </span>
                    `;
            }
        }


    } catch (error) {

        console.error(
            "Slots error:",
            error
        );


        stopFakeSlotAnimation();


        if (message) {

            message.innerHTML =
                `
                <span>
                    ⚠️ ${escapeHtml(
                        error.message
                    )}
                </span>
                `;
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


        disableSlotsControls(
            false
        );


        updateSlotsBalanceUI();
    }
}


// ============================================================
// FAKE SLOT ANIMATION
// ============================================================

let slotAnimationTimer =
    null;


function startFakeSlotAnimation() {

    const symbols = [
        "🍒",
        "🍋",
        "🍊",
        "🍉",
        "⭐",
        "💎",
        "7️⃣"
    ];


    const reels =
        [
            document.getElementById(
                "slotReel0"
            ),

            document.getElementById(
                "slotReel1"
            ),

            document.getElementById(
                "slotReel2"
            )
        ];


    reels.forEach(
        function(reel) {

            if (reel) {

                reel.classList.add(
                    "spinning"
                );
            }
        }
    );


    slotAnimationTimer =
        setInterval(
            function() {

                reels.forEach(
                    function(reel) {

                        if (!reel) {
                            return;
                        }


                        const symbol =
                            symbols[
                                Math.floor(
                                    Math.random() *
                                    symbols.length
                                )
                            ];


                        const child =
                            reel.querySelector(
                                ".slot-symbol"
                            );


                        if (child) {

                            child.textContent =
                                symbol;
                        }
                    }
                );

            },
            90
        );
}


// ============================================================
// STOP SLOT ANIMATION
// ============================================================

function stopFakeSlotAnimation() {

    if (
        slotAnimationTimer
    ) {

        clearInterval(
            slotAnimationTimer
        );

        slotAnimationTimer =
            null;
    }


    const reels =
        document.querySelectorAll(
            ".slotReel"
        );


    reels.forEach(
        function(reel) {

            reel.classList.remove(
                "spinning"
            );
        }
    );
}


// ============================================================
// REVEAL SLOT RESULT
// ============================================================

function revealSlotResult(
    symbols
) {

    return new Promise(
        function(resolve) {

            if (
                !Array.isArray(
                    symbols
                )
            ) {

                resolve();

                return;
            }


            symbols =
                symbols.slice(
                    0,
                    3
                );


            symbols.forEach(
                function(symbol, index) {

                    setTimeout(
                        function() {

                            const reel =
                                document.getElementById(
                                    `slotReel${index}`
                                );


                            if (!reel) {
                                return;
                            }


                            const child =
                                reel.querySelector(
                                    ".slot-symbol"
                                );


                            if (child) {

                                child.textContent =
                                    symbol;
                            }


                            if (
                                index ===
                                symbols.length - 1
                            ) {

                                setTimeout(
                                    resolve,
                                    250
                                );
                            }

                        },
                        index * 180
                    );
                }
            );

        }
    );
}


// ============================================================
// HIGHLIGHT WINNING SLOTS
// ============================================================

function highlightWinningSlots() {

    const reels =
        document.querySelectorAll(
            ".slotReel"
        );


    reels.forEach(
        function(reel) {

            reel.classList.add(
                "win"
            );
        }
    );


    setTimeout(
        clearSlotWin,
        1800
    );
}


// ============================================================
// CLEAR SLOT WIN
// ============================================================

function clearSlotWin() {

    const reels =
        document.querySelectorAll(
            ".slotReel"
        );


    reels.forEach(
        function(reel) {

            reel.classList.remove(
                "win"
            );
        }
    );
}


// ============================================================
// SHOW SLOT WIN
// ============================================================

function showSlotsWin(
    amount,
    symbols
) {

    const message =
        document.getElementById(
            "slotsMessage"
        );


    if (!message) {
        return;
    }


    message.className =
        "slots-win-message";


    message.innerHTML =
        `
        🎉 <strong>YOU WIN!</strong>
        <br>
        <span style="
            font-size:20px;
        ">
            +${Number(
                amount
            ).toLocaleString()}
            🪙
        </span>
        `;
}


// ============================================================
// DISABLE SLOT CONTROLS
// ============================================================

function disableSlotsControls(
    disabled
) {

    const buttons =
        document.querySelectorAll(
            ".slotsQuickBet"
        );


    buttons.forEach(
        function(button) {

            button.disabled =
                disabled;
        }
    );


    const minus =
        document.getElementById(
            "slotsMinusButton"
        );

    const plus =
        document.getElementById(
            "slotsPlusButton"
        );


    if (minus) {

        minus.disabled =
            disabled;
    }


    if (plus) {

        plus.disabled =
            disabled;
    }
}

// ==========================================
// OPEN MINES
// ==========================================

async function openMines() {

    const modal =
        document.getElementById("gameModal");

    const title =
        document.getElementById("gameModalTitle");

    const text =
        document.getElementById("gameModalText");

    if (!modal || !text) {
        console.error("Mines modal elements not found.");
        return;
    }

    if (title) {
        title.textContent = "Mines";
    }

    text.innerHTML = `
        <div class="mines-game">

            <div
                id="minesMessage"
                class="mines-message"
            >
                Checking for an active Mines game...
            </div>

            <div
                id="minesContent"
            >
                <div
                    style="
                        text-align:center;
                        padding:25px;
                        opacity:0.8;
                    "
                >
                    💣 Loading Mines...
                </div>
            </div>

        </div>
    `;

    modal.style.display = "flex";

    // ------------------------------------------
    // IMPORTANT:
    // Check the server every time Mines opens.
    // This is what allows resume after reopening
    // the Telegram Mini App.
    // ------------------------------------------

    await checkActiveMines();
}


// ==========================================
// CHECK ACTIVE MINES GAME
// ==========================================

async function checkActiveMines() {

    const message =
        document.getElementById("minesMessage");

    const content =
        document.getElementById("minesContent");

    if (!content) {
        return;
    }

    if (!tg.initData) {

        content.innerHTML = `
            <div style="text-align:center;padding:20px;">
                Telegram authentication data is unavailable.
            </div>
        `;

        return;
    }

    if (message) {
        message.textContent =
            "Checking your Mines game...";
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/game/mines/active`,
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

        const data =
            await response.json();

        console.log(
            "Active Mines response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.error ||
                `HTTP ${response.status}`
            );
        }

        // --------------------------------------
        // NO ACTIVE GAME
        // --------------------------------------

        if (!data.active) {

            window.currentMinesGame = null;

            showMinesStartScreen();

            return;
        }

        // --------------------------------------
        // ACTIVE GAME FOUND
        // --------------------------------------

        window.currentMinesGame = {

            game_id:
                Number(data.game_id),

            bet:
                Number(data.bet),

            mine_count:
                Number(data.mine_count),

            grid_size:
                Number(data.grid_size || 25),

            multiplier:
                Number(data.multiplier || 1),

            potential_win:
                Number(data.potential_win || data.bet),

            revealed:
                Array.isArray(data.revealed)
                    ? data.revealed.map(Number)
                    : [],

            status:
                data.status || "active"
        };

        balance =
            Number(data.balance);

        updateBalance();

        console.log(
            "Resuming Mines game:",
            window.currentMinesGame
        );

        showMinesBoard();

    } catch (error) {

        console.error(
            "Active Mines check error:",
            error
        );

        if (message) {
            message.textContent =
                "Could not check your active Mines game.";
        }

        content.innerHTML = `
            <div
                style="
                    text-align:center;
                    padding:20px;
                "
            >

                <div
                    style="
                        margin-bottom:15px;
                        color:#ff6b6b;
                    "
                >
                    ❌ ${escapeHtml(error.message)}
                </div>

                <button
                    onclick="checkActiveMines()"
                    style="
                        padding:12px 20px;
                        border:none;
                        border-radius:10px;
                        cursor:pointer;
                    "
                >
                    🔄 TRY AGAIN
                </button>

            </div>
        `;
    }
}


// ==========================================
// MINES START SCREEN
// ==========================================

function showMinesStartScreen() {

    const message =
        document.getElementById("minesMessage");

    const content =
        document.getElementById("minesContent");

    if (!content) {
        return;
    }

    if (message) {
        message.textContent =
            "Choose your demo bet and number of mines.";
    }

    content.innerHTML = `

        <div class="mines-settings">

            <div class="mines-setting">

                <label>
                    Demo Bet
                </label>

                <select id="minesBet">

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

                <select id="minesCount">

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

    `;
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

    if (!betElement ||
        !minesElement) {

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
    // VALIDATION
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


        // --------------------------------------
        // IMPORTANT:
        // If the server says an active game
        // already exists, immediately retrieve it.
        // --------------------------------------

        if (!response.ok) {

            const errorText =
                String(
                    data.error || ""
                ).toLowerCase();

            if (
                errorText.includes(
                    "active mines"
                ) ||
                errorText.includes(
                    "already have"
                ) ||
                errorText.includes(
                    "active game"
                )
            ) {

                await checkActiveMines();

                return;
            }


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


        // --------------------------------------
        // SAVE GAME
        // --------------------------------------

        window.currentMinesGame = {

            game_id:
                Number(data.game_id),

            bet:
                Number(data.bet),

            mine_count:
                Number(data.mine_count),

            grid_size:
                Number(data.grid_size || 25),

            multiplier:
                Number(data.multiplier || 1),

            potential_win:
                Number(
                    data.potential_win ||
                    data.bet
                ),

            revealed: [],

            status:
                data.status || "active"
        };


        // --------------------------------------
        // UPDATE BALANCE
        // --------------------------------------

        balance =
            Number(data.balance);

        updateBalance();


        console.log(
            "Mines game created:",
            window.currentMinesGame
        );


        // --------------------------------------
        // SHOW BOARD
        // --------------------------------------

        showMinesBoard();


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

            button.disabled = false;

            button.textContent =
                "💣 START MINES";
        }
    }
}


// ==========================================
// SHOW MINES BOARD
// ==========================================

function showMinesBoard() {

    const game =
        window.currentMinesGame;

    const message =
        document.getElementById(
            "minesMessage"
        );

    const content =
        document.getElementById(
            "minesContent"
        );

    if (!game || !content) {

        return;
    }


    const revealed =
        Array.isArray(game.revealed)
            ? game.revealed
            : [];


    if (message) {

        message.innerHTML =
            "💣 <strong>Mines in progress</strong>";
    }


    let boardHtml = "";


    // --------------------------------------
    // 25 TILES = 5 x 5
    // --------------------------------------

    for (
        let tile = 0;
        tile < 25;
        tile++
    ) {

        const isRevealed =
            revealed.includes(tile);


        boardHtml += `

            <button
                id="minesTile${tile}"
                class="mines-tile"
                ${isRevealed
                    ? "disabled"
                    : ""}
                onclick="revealMines(${tile})"
                style="
                    width:100%;
                    aspect-ratio:1;
                    border:none;
                    border-radius:12px;
                    font-size:25px;
                    cursor:${isRevealed
                        ? "default"
                        : "pointer"};
                    background:${
                        isRevealed
                            ? "#2e7d32"
                            : "#263238"
                    };
                    color:white;
                    box-shadow:
                        0 3px 8px
                        rgba(0,0,0,0.25);
                "
            >

                ${
                    isRevealed
                        ? "💎"
                        : "?"
                }

            </button>

        `;
    }


    content.innerHTML = `

        <div
            style="
                display:flex;
                justify-content:space-between;
                gap:10px;
                margin-bottom:15px;
                flex-wrap:wrap;
            "
        >

            <div>
                <strong>Bet</strong><br>
                ${game.bet} credits
            </div>

            <div>
                <strong>Mines</strong><br>
                ${game.mine_count}
            </div>

            <div>
                <strong>Multiplier</strong><br>
                <span id="minesMultiplier">
                    ${Number(
                        game.multiplier
                    ).toFixed(2)}x
                </span>
            </div>

            <div>
                <strong>Potential Win</strong><br>
                <span id="minesPotentialWin">
                    ${Number(
                        game.potential_win
                    ).toLocaleString()}
                </span>
            </div>

        </div>


        <div
            id="minesGrid"
            style="
                display:grid;
                grid-template-columns:
                    repeat(5, 1fr);
                gap:8px;
                width:100%;
                max-width:420px;
                margin:0 auto 18px auto;
            "
        >

            ${boardHtml}

        </div>


        <button
            id="cashoutMinesButton"
            onclick="cashoutMines()"
            style="
                width:100%;
                padding:14px;
                border:none;
                border-radius:12px;
                font-size:16px;
                font-weight:bold;
                cursor:pointer;
                margin-top:5px;
            "
            ${
                revealed.length < 1
                    ? "disabled"
                    : ""
            }
        >
            💰 CASH OUT
        </button>


        <div
            style="
                margin-top:12px;
                text-align:center;
                font-size:13px;
                opacity:0.75;
            "
        >
            Tap a tile to reveal it.
            <br>
            You can close and reopen the Mini App
            and continue this game.
        </div>

    `;
}


// ==========================================
// REVEAL MINES TILE
// ==========================================

async function revealMines(tile) {

    const game =
        window.currentMinesGame;

    if (!game) {

        alert(
            "No active Mines game."
        );

        return;
    }


    if (
        game.status !== "active"
    ) {

        return;
    }


    const numericTile =
        Number(tile);


    if (
        numericTile < 0 ||
        numericTile > 24
    ) {

        return;
    }


    const revealed =
        Array.isArray(game.revealed)
            ? game.revealed
            : [];


    if (
        revealed.includes(
            numericTile
        )
    ) {

        return;
    }


    const button =
        document.getElementById(
            `minesTile${numericTile}`
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "⏳";
    }


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
                            numericTile
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


        // --------------------------------------
        // MINE
        // --------------------------------------

        if (
            data.result === "mine"
        ) {

            game.status =
                "lost";


            balance =
                Number(data.balance);


            updateBalance();


            if (message) {

                message.innerHTML =
                    "💥 <strong>MINE!</strong> Game over.";
            }


            revealAllMines(
                data.mines || [],
                numericTile
            );


            disableMinesBoard();


            return;
        }


        // --------------------------------------
        // SAFE TILE
        // --------------------------------------

        if (
            data.result === "safe"
        ) {

            game.revealed =
                Array.isArray(
                    data.revealed
                )
                    ? data.revealed.map(Number)
                    : revealed.concat(
                        numericTile
                    );


            game.multip

// ============================================================
// DEMO PLAY BUTTON
// ============================================================

function playDemo() {

    if (
        currentGame ===
        "slots"
    ) {

        spinSlots();

        return;
    }


    if (
        currentGame ===
        "mines"
    ) {

        return;
    }


    alert(
        "Demo mode\n\nThis game will be added next."
    );
}


// ============================================================
// NAVIGATION
// ============================================================

function showPage(
    page
) {

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


// ============================================================
// DEMO COINS
// ============================================================

function addDemoCoins() {

    balance +=
        100;


    updateBalance();


    updateSlotsBalanceUI();


    console.log(
        "Demo balance increased:",
        balance
    );
}


// ============================================================
// SHOW DEMO BALANCE
// ============================================================

function showDemoBalance() {

    addDemoCoins();


    if (
        tg &&
        typeof tg.showAlert ===
            "function"
    ) {

        tg.showAlert(
            "100 demo coins added!"
        );

    } else {

        alert(
            "100 demo coins added!"
        );
    }
}


// ============================================================
// PROFILE
// ============================================================

function showProfile() {

    const user =
        getTelegramUser();


    let message =
        "PLAYER PROFILE\n\n";


    if (user) {

        message +=
            "Name: " +
            (
                user.first_name ||
                "Player"
            ) +
            "\n";

        if (user.username) {

            message +=
                "Username: @" +
                user.username +
                "\n";
        }

        message +=
            "\nDemo Balance: " +
            Number(
                balance
            ).toLocaleString() +
            " credits";

    } else {

        message +=
            "Telegram user information unavailable.";
    }


    if (
        tg &&
        typeof tg.showAlert ===
            "function"
    ) {

        tg.showAlert(
            message
        );

    } else {

        alert(
            message
        );
    }
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ============================================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "gameModal"
            );


        if (
            modal &&
            event.target ===
                modal
        ) {

            closeGame();
        }
    }
);


// ============================================================
// START APPLICATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "================================"
        );

        console.log(
            "GAME ZONE MINI APP STARTED"
        );

        console.log(
            "================================"
        );


        updateBalance();

        updateUsername();

        loadUser();

    }
);
