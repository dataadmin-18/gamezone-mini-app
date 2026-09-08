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
                linear-gradien