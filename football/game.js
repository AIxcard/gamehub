/* =========================================================
   FOOTBALL LEGENDS
   GAME.JS — COMPLETE REPLACEMENT
   ========================================================= */

"use strict";

/* =========================================================
   PLAYER DATABASE
   ========================================================= */

const PLAYERS = [
    {id:"ronaldo",name:"Cristiano Ronaldo",rating:99,position:"LW",country:"Portugal",club:"Al Nassr",rarity:"ICON",avatar:"CR7"},
    {id:"messi",name:"Lionel Messi",rating:99,position:"RW",country:"Argentina",club:"Inter Miami",rarity:"ICON",avatar:"LM10"},
    {id:"mbappe",name:"Kylian Mbappé",rating:98,position:"ST",country:"France",club:"Real Madrid",rarity:"LEGENDARY",avatar:"KM"},
    {id:"haaland",name:"Erling Haaland",rating:98,position:"ST",country:"Norway",club:"Manchester City",rarity:"LEGENDARY",avatar:"EH9"},
    {id:"vinicius",name:"Vinícius Júnior",rating:97,position:"LW",country:"Brazil",club:"Real Madrid",rarity:"LEGENDARY",avatar:"VJR"},
    {id:"bellingham",name:"Jude Bellingham",rating:97,position:"CM",country:"England",club:"Real Madrid",rarity:"LEGENDARY",avatar:"JB"},
    {id:"debruyne",name:"Kevin De Bruyne",rating:96,position:"CM",country:"Belgium",club:"Manchester City",rarity:"EPIC",avatar:"KDB"},
    {id:"salah",name:"Mohamed Salah",rating:96,position:"RW",country:"Egypt",club:"Liverpool",rarity:"EPIC",avatar:"MS"},
    {id:"kane",name:"Harry Kane",rating:95,position:"ST",country:"England",club:"Bayern Munich",rarity:"EPIC",avatar:"HK9"},
    {id:"neymar",name:"Neymar Jr",rating:95,position:"LW",country:"Brazil",club:"Santos",rarity:"EPIC",avatar:"NEY"},
    {id:"modric",name:"Luka Modrić",rating:94,position:"CM",country:"Croatia",club:"Real Madrid",rarity:"EPIC",avatar:"LM"},
    {id:"rodri",name:"Rodri",rating:94,position:"CDM",country:"Spain",club:"Manchester City",rarity:"RARE",avatar:"RD"},
    {id:"vandijk",name:"Virgil van Dijk",rating:94,position:"CB",country:"Netherlands",club:"Liverpool",rarity:"RARE",avatar:"VVD"},
    {id:"courtois",name:"Thibaut Courtois",rating:94,position:"GK",country:"Belgium",club:"Real Madrid",rarity:"RARE",avatar:"TC"},
    {id:"alisson",name:"Alisson Becker",rating:93,position:"GK",country:"Brazil",club:"Liverpool",rarity:"RARE",avatar:"AB"},
    {id:"kvara",name:"Khvicha Kvaratskhelia",rating:91,position:"LW",country:"Georgia",club:"PSG",rarity:"RARE",avatar:"KK"},
    {id:"musiala",name:"Jamal Musiala",rating:91,position:"CAM",country:"Germany",club:"Bayern Munich",rarity:"RARE",avatar:"JM"},
    {id:"saka",name:"Bukayo Saka",rating:90,position:"RW",country:"England",club:"Arsenal",rarity:"RARE",avatar:"BS"},
    {id:"foden",name:"Phil Foden",rating:90,position:"RW",country:"England",club:"Manchester City",rarity:"RARE",avatar:"PF"},
    {id:"pedri",name:"Pedri",rating:90,position:"CM",country:"Spain",club:"Barcelona",rarity:"RARE",avatar:"PD"},
    {id:"yamal",name:"Lamine Yamal",rating:89,position:"RW",country:"Spain",club:"Barcelona",rarity:"RARE",avatar:"LY"},
    {id:"gavi",name:"Gavi",rating:88,position:"CM",country:"Spain",club:"Barcelona",rarity:"COMMON",avatar:"GV"},
    {id:"wirtz",name:"Florian Wirtz",rating:89,position:"CAM",country:"Germany",club:"Liverpool",rarity:"COMMON",avatar:"FW"},
    {id:"martinez",name:"Lautaro Martínez",rating:90,position:"ST",country:"Argentina",club:"Inter",rarity:"RARE",avatar:"LM"},
    {id:"son",name:"Son Heung-min",rating:89,position:"LW",country:"South Korea",club:"LAFC",rarity:"COMMON",avatar:"SON"}
];


/* =========================================================
   TEAMS
   ========================================================= */

const TEAMS = [
    "Manchester United",
    "Manchester City",
    "Real Madrid",
    "Barcelona",
    "Liverpool",
    "Arsenal",
    "Bayern Munich",
    "Inter Milan",
    "AC Milan",
    "PSG"
];


/* =========================================================
   SAVE SYSTEM
   ========================================================= */

const SAVE_KEY = "football_legends_save_v3";

const DEFAULT_SAVE = {
    coins: 1000,
    collection: ["ronaldo"],
    squad: ["ronaldo"],
    selectedTeam: "Football Legends FC",
    settings: {
        music: true,
        effects: true,
        vibration: true,
        graphics: "High",
        controls: {
            up: "w",
            down: "s",
            left: "a",
            right: "d",
            sprint: "shift",
            shoot: "space",
            pass: "e",
            dribble: "q"
        }
    }
};

let save;

function cloneDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_SAVE));
}

function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);

        if (raw) {
            const loaded = JSON.parse(raw);

            save = {
                ...cloneDefault(),
                ...loaded,
                settings: {
                    ...cloneDefault().settings,
                    ...(loaded.settings || {}),
                    controls: {
                        ...cloneDefault().settings.controls,
                        ...((loaded.settings || {}).controls || {})
                    }
                }
            };
        } else {
            save = cloneDefault();
        }
    } catch {
        save = cloneDefault();
    }

    if (!Array.isArray(save.collection))
        save.collection = [];

    if (!Array.isArray(save.squad))
        save.squad = [];

    save.coins = Number(save.coins);

    if (!Number.isFinite(save.coins))
        save.coins = 1000;
}

function saveGame() {
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(save)
    );

    updateCoinsUI();
}

loadSave();


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function getPlayer(id) {
    return PLAYERS.find(p => p.id === id);
}

function notify(message, type = "normal") {
    let box = $("game-notification");

    if (!box) {
        box = document.createElement("div");
        box.id = "game-notification";
        box.className = "game-notification";
        document.body.appendChild(box);
    }

    box.textContent = message;
    box.dataset.type = type;
    box.classList.add("visible");

    clearTimeout(box._timer);

    box._timer = setTimeout(() => {
        box.classList.remove("visible");
    }, 1800);
}

function updateCoinsUI() {
    document.querySelectorAll("#coins, .coins-value").forEach(el => {
        el.textContent = Math.floor(save.coins);
    });
}


/* =========================================================
   PACK SYSTEM
   ========================================================= */

const PACKS = {
    bronze: {
        name: "BRONZE PACK",
        price: 100,
        chances: {
            COMMON: 60,
            RARE: 30,
            EPIC: 9,
            LEGENDARY: 1
        }
    },

    gold: {
        name: "GOLD PACK",
        price: 250,
        chances: {
            COMMON: 25,
            RARE: 45,
            EPIC: 25,
            LEGENDARY: 5
        }
    },

    elite: {
        name: "ELITE PACK",
        price: 750,
        chances: {
            RARE: 30,
            EPIC: 45,
            LEGENDARY: 20,
            ICON: 5
        }
    }
};

function weightedRarity(chances) {
    let roll = Math.random() * 100;

    for (const rarity of Object.keys(chances)) {
        roll -= chances[rarity];

        if (roll <= 0)
            return rarity;
    }

    return Object.keys(chances)[0];
}

function getPackPlayer(pack) {
    const rarity = weightedRarity(pack.chances);

    let available = PLAYERS.filter(
        p => p.rarity === rarity
    );

    if (!available.length) {
        available = PLAYERS;
    }

    return available[
        Math.floor(Math.random() * available.length)
    ];
}

function openPack(packId = "bronze") {
    const pack = PACKS[packId];

    if (!pack)
        return;

    if (save.coins < pack.price) {
        notify("Not enough coins!", "error");
        return;
    }

    save.coins -= pack.price;

    const player = getPackPlayer(pack);

    if (!save.collection.includes(player.id))
        save.collection.push(player.id);

    saveGame();

    showPackResult(player);
}

window.openPack = openPack;


/* =========================================================
   PREMIUM PACK COMPATIBILITY
   ========================================================= */

function openPremiumPack() {
    openPack("gold");
}

window.openPremiumPack = openPremiumPack;


/* =========================================================
   PACK RESULT
   ========================================================= */

function showPackResult(player) {
    const result = $("packResult");

    if (!result)
        return;

    if ($("resultRating"))
        $("resultRating").textContent = player.rating;

    if ($("resultPosition"))
        $("resultPosition").textContent = player.position;

    if ($("resultAvatar"))
        $("resultAvatar").textContent = player.avatar;

    if ($("resultName"))
        $("resultName").textContent = player.name;

    if ($("resultCountry"))
        $("resultCountry").textContent =
            `${player.country} • ${player.club}`;

    result.classList.remove("hidden");
    result.classList.add("show");
}

function closePack() {
    const result = $("packResult");

    if (!result)
        return;

    result.classList.remove("show");
    result.classList.add("hidden");

    renderSquad();
}

window.closePack = closePack;


/* =========================================================
   SQUAD
   ========================================================= */

function calculateSquadRating() {
    if (!save.squad.length)
        return 0;

    const ratings = save.squad
        .map(id => getPlayer(id))
        .filter(Boolean)
        .map(p => p.rating);

    if (!ratings.length)
        return 0;

    return Math.round(
        ratings.reduce((a, b) => a + b, 0) /
        ratings.length
    );
}

function addToSquad(id) {
    const player = getPlayer(id);

    if (!player)
        return;

    if (save.squad.includes(id)) {
        save.squad = save.squad.filter(
            playerId => playerId !== id
        );

        notify("Player removed from squad");
    } else {
        if (save.squad.length >= 11) {
            notify("Squad is full — maximum 11 players", "error");
            return;
        }

        save.squad.push(id);
        notify(`${player.name} added to squad`);
    }

    saveGame();
    renderSquad();
}

window.addToSquad = addToSquad;

function renderSquad() {
    const squad = $("squad");

    if (!squad)
        return;

    squad.innerHTML = "";

    const unique = [...new Set(save.collection)];

    if (!unique.length) {
        squad.innerHTML = `
            <div class="empty">
                <strong>Your squad is empty.</strong>
                <p>Open packs in the Shop to get players.</p>
            </div>
        `;
        return;
    }

    unique.forEach(id => {
        const player = getPlayer(id);

        if (!player)
            return;

        const card = document.createElement("div");
        card.className = `player-card rarity-${player.rarity.toLowerCase()}`;

        card.innerHTML = `
            <div class="rating">${player.rating}</div>
            <div class="position">${player.position}</div>

            <div class="player-avatar">
                ${player.avatar}
            </div>

            <h3>${player.name}</h3>

            <p>
                ${player.country} • ${player.club}
            </p>

            <button class="squad-add">
                ${
                    save.squad.includes(player.id)
                        ? "REMOVE"
                        : "ADD TO SQUAD"
                }
            </button>
        `;

        card.querySelector(".squad-add")
            .addEventListener("click", () => {
                addToSquad(player.id);
            });

        squad.appendChild(card);
    });

    const rating = $("squad-rating");

    if (rating)
        rating.textContent = calculateSquadRating();
}


/* =========================================================
   SHOP
   ========================================================= */

function renderShop() {
    const shop = $("shop");

    if (!shop)
        return;

    shop.innerHTML = "";

    Object.entries(PACKS).forEach(([id, pack]) => {
        const card = document.createElement("div");

        card.className = "pack-card";

        card.innerHTML = `
            <div class="pack-icon">⚽</div>

            <div class="pack-rarity">
                FOOTBALL PACK
            </div>

            <h2>${pack.name}</h2>

            <p>
                ${
                    id === "bronze"
                        ? "A basic pack with a chance of finding a rare player."
                        : id === "gold"
                            ? "A premium pack with much better player odds."
                            : "The ultimate pack. Your best chance at an ICON."
                }
            </p>

            <div class="pack-price">
                🪙 ${pack.price}
            </div>

            <button class="open-pack">
                OPEN PACK
            </button>
        `;

        card.querySelector(".open-pack")
            .addEventListener("click", () => {
                openPack(id);
            });

        shop.appendChild(card);
    });
}


/* =========================================================
   PAGE SYSTEM
   ========================================================= */

function closeAllPages() {
    document
        .querySelectorAll(".page-screen")
        .forEach(page => {
            page.classList.remove("active");
        });
}

function openPage(pageId) {
    closeAllPages();

    const page = $(pageId);

    if (page)
        page.classList.add("active");

    const home = $("home-screen");

    if (home)
        home.classList.remove("active");

    const nav = $("navigation");

    if (nav)
        nav.classList.add("visible");

    if (pageId === "squad-page")
        renderSquad();

    window.scrollTo(0, 0);
}

window.openPage = openPage;

function showHome() {
    closeAllPages();

    const match = $("match-screen");

    if (match)
        match.classList.remove("active");

    const home = $("home-screen");

    if (home)
        home.classList.add("active");

    const nav = $("navigation");

    if (nav)
        nav.classList.remove("visible");

    window.scrollTo(0, 0);
}

window.showHome = showHome;


/* =========================================================
   THREE.JS MATCH VARIABLES
   ========================================================= */

let scene = null;
let camera = null;
let renderer = null;

let matchInitialized = false;
let gameStarted = false;

let controlledPlayer = null;
let ball = null;

let teammates = [];
let opponents = [];

let ballVelocity = new THREE.Vector3();
let ballOwner = null;

let homeScore = 0;
let awayScore = 0;

let matchTime = 120;
let stamina = 100;

let previousFrame = performance.now();

const keys = {};

const mobileInput = {
    x: 0,
    y: 0,
    sprint: false
};

let actionLocked = false;


/* =========================================================
   MATCH OPENING
   ========================================================= */

function showMatchScreen() {
    closeAllPages();

    const home = $("home-screen");

    if (home)
        home.classList.remove("active");

    const nav = $("navigation");

    if (nav)
        nav.classList.remove("visible");

    const match = $("match-screen");

    if (match)
        match.classList.add("active");
}

function startMatch() {
    showMatchScreen();

    if (!matchInitialized)
        initializeMatch();

    gameStarted = true;

    homeScore = 0;
    awayScore = 0;
    matchTime = 120;
    stamina = 100;

    resetPositions();

    updateScore();
    updateMatchTimer();
    updateStamina();

    notify("MATCH STARTED");
}

window.startGame = startMatch;


/* =========================================================
   INITIALIZE THREE.JS
   ========================================================= */

function initializeMatch() {
    if (matchInitialized)
        return;

    const container = $("game-container");

    if (!container)
        return;

    if (typeof THREE === "undefined") {
        console.error("Three.js failed to load.");
        notify("Three.js failed to load", "error");
        return;
    }

    matchInitialized = true;

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x0b1520);

    camera = new THREE.PerspectiveCamera(
        58,
        window.innerWidth / window.innerHeight,
        0.1,
        300
    );

    camera.position.set(0, 16, 21);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);


    /* =====================================================
       LIGHTING
       ===================================================== */

    scene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x15251b,
            2
        )
    );

    const sun = new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

    sun.position.set(
        15,
        30,
        10
    );

    sun.castShadow = true;

    scene.add(sun);


    /* =====================================================
       STADIUM
       ===================================================== */

    createStadium();


    /* =====================================================
       PLAYERS
       ===================================================== */

    controlledPlayer =
        createPlayer3D(
            0x111111,
            "Cristiano Ronaldo"
        );

    scene.add(controlledPlayer);

    controlledPlayer.position.set(
        0,
        0,
        8
    );


    const teammatePositions = [
        [-6, 5],
        [6, 5],
        [-4, -2],
        [4, -3],
        [0, -8]
    ];

    teammates = [];

    teammatePositions.forEach((pos, index) => {
        const teammate =
            createPlayer3D(
                0x1464d2,
                `Teammate ${index + 1}`
            );

        teammate.position.set(
            pos[0],
            0,
            pos[1]
        );

        teammates.push(teammate);
    });


    const opponentPositions = [
        [-5, -1],
        [5, -2],
        [-3, -7],
        [3, -8],
        [0, -12],
        [-7, -9]
    ];

    opponents = [];

    opponentPositions.forEach((pos, index) => {
        const opponent =
            createPlayer3D(
                0xd51f35,
                `Rival ${index + 1}`
            );

        opponent.position.set(
            pos[0],
            0,
            pos[1]
        );

        opponents.push(opponent);
    });


    /* =====================================================
       BALL
       ===================================================== */

    ball = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.32,
            24,
            24
        ),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.35
        })
    );

    ball.castShadow = true;

    scene.add(ball);

    resetPositions();


    /* =====================================================
       CONTROLS
       ===================================================== */

    setupTouchControls();

    requestAnimationFrame(matchLoop);
}


/* =========================================================
   STADIUM CREATION
   ========================================================= */

function createStadium() {

    const fieldWidth = 24;
    const fieldLength = 40;


    /* FIELD */

    const field = new THREE.Mesh(
        new THREE.PlaneGeometry(
            fieldWidth,
            fieldLength
        ),
        new THREE.MeshStandardMaterial({
            color: 0x176b38,
            roughness: 0.9
        })
    );

    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;

    scene.add(field);


    /* STRIPES */

    for (
        let z = -fieldLength / 2;
        z < fieldLength / 2;
        z += 4
    ) {
        const stripe = new THREE.Mesh(
            new THREE.PlaneGeometry(
                fieldWidth,
                4
            ),
            new THREE.MeshBasicMaterial({
                color:
                    Math.floor(
                        (z + fieldLength / 2) / 4
                    ) % 2
                        ? 0x196f3c
                        : 0x1b7741
            })
        );

        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(
            0,
            0.01,
            z + 2
        );

        scene.add(stripe);
    }


    /* TOUCHLINE */

    createLine(
        0,
        -20,
        24,
        0.12
    );

    createLine(
        0,
        20,
        24,
        0.12
    );

    createLine(
        -12,
        0,
        0.12,
        40
    );

    createLine(
        12,
        0,
        0.12,
        40
    );


    /* HALF WAY */

    createLine(
        0,
        0,
        24,
        0.08
    );


    /* CENTER CIRCLE */

    const circlePoints = [];

    for (
        let i = 0;
        i <= 64;
        i++
    ) {
        const angle =
            (i / 64) *
            Math.PI *
            2;

        circlePoints.push(
            new THREE.Vector3(
                Math.cos(angle) * 3.2,
                0.04,
                Math.sin(angle) * 3.2
            )
        );
    }

    const centerCircle =
        new THREE.LineLoop(
            new THREE.BufferGeometry()
                .setFromPoints(circlePoints),
            new THREE.LineBasicMaterial({
                color: 0xffffff
            })
        );

    scene.add(centerCircle);


    /* PENALTY BOXES */

    createPenaltyBox(-15);
    createPenaltyBox(15);


    /* GOALS */

    createGoal(-20);
    createGoal(20);


    /* STANDS */

    createStand(
        -15,
        0,
        3,
        44
    );

    createStand(
        15,
        0,
        3,
        44
    );

    createStand(
        0,
        -23,
        30,
        3
    );

    createStand(
        0,
        23,
        30,
        3
    );


    /* FLOODLIGHTS */

    createFloodlight(-17, -17);
    createFloodlight(17, -17);
    createFloodlight(-17, 17);
    createFloodlight(17, 17);
}


function createLine(x, z, width, depth) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            0.035,
            depth
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    line.position.set(
        x,
        0.035,
        z
    );

    scene.add(line);
}


function createPenaltyBox(z) {

    const depth = 6;
    const width = 14;

    const front =
        z > 0
            ? z - depth
            : z + depth;

    createLine(
        0,
        front,
        width,
        0.07
    );

    createLine(
        -7,
        (z + front) / 2,
        0.07,
        depth
    );

    createLine(
        7,
        (z + front) / 2,
        0.07,
        depth
    );
}


function createGoal(z) {

    const group = new THREE.Group();

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

    const post1 = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.16,
            2.7,
            0.16
        ),
        material
    );

    const post2 = post1.clone();

    const crossbar = new THREE.Mesh(
        new THREE.BoxGeometry(
            5.2,
            0.16,
            0.16
        ),
        material
    );

    post1.position.set(
        -2.6,
        1.35,
        0
    );

    post2.position.set(
        2.6,
        1.35,
        0
    );

    crossbar.position.y = 2.7;

    group.add(
        post1,
        post2,
        crossbar
    );

    group.position.z = z;

    scene.add(group);
}


function createStand(
    x,
    z,
    width,
    depth
) {
    const stand = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            4,
            depth
        ),
        new THREE.MeshStandardMaterial({
            color: 0x202a35,
            roughness: 0.8
        })
    );

    stand.position.set(
        x,
        2,
        z
    );

    scene.add(stand);


    /* SEAT ROWS */

    for (
        let y = 1;
        y < 4;
        y += 0.75
    ) {
        const row = new THREE.Mesh(
            new THREE.BoxGeometry(
                width - 0.4,
                0.12,
                depth - 0.4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x364453
            })
        );

        row.position.set(
            x,
            y,
            z
        );

        scene.add(row);
    }
}


function createFloodlight(x, z) {

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.12,
            0.18,
            10,
            12
        ),
        new THREE.MeshStandardMaterial({
            color: 0x3c4652
        })
    );

    pole.position.set(
        x,
        5,
        z
    );

    scene.add(pole);


    const light = new THREE.PointLight(
        0xffffff,
        18,
        30
    );

    light.position.set(
        x,
        10,
        z
    );

    scene.add(light);
}


/* =========================================================
   PLAYER MODEL
   ========================================================= */

function createPlayer3D(color, name) {

    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.43,
            0.85,
            4,
            10
        ),
        new THREE.MeshStandardMaterial({
            color
        })
    );

    body.position.y = 1;

    body.castShadow = true;

    group.add(body);


    const head = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.3,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xc88962
        })
    );

    head.position.y = 1.85;

    head.castShadow = true;

    group.add(head);


    group.userData.name = name;

    return group;
}


/* =========================================================
   RESET MATCH
   ========================================================= */

function resetPositions() {

    if (!controlledPlayer || !ball)
        return;

    controlledPlayer.position.set(
        0,
        0,
        8
    );

    controlledPlayer.rotation.y = 0;

    teammates.forEach((p, i) => {
        const positions = [
            [-6, 5],
            [6, 5],
            [-4, -2],
            [4, -3],
            [0, -8]
        ];

        p.position.set(
            positions[i][0],
            0,
            positions[i][1]
        );
    });

    opponents.forEach((p, i) => {
        const positions = [
            [-5, -1],
            [5, -2],
            [-3, -7],
            [3, -8],
            [0, -12],
            [-7, -9]
        ];

        p.position.set(
            positions[i][0],
            0,
            positions[i][1]
        );
    });

    ballOwner = controlledPlayer;

    ballVelocity.set(0, 0, 0);

    attachBallToPlayer();
}


function attachBallToPlayer() {

    if (!ball || !controlledPlayer)
        return;

    ball.position.set(
        controlledPlayer.position.x,
        0.35,
        controlledPlayer.position.z - 1
    );
}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(delta) {

    if (!gameStarted || !controlledPlayer)
        return;

    let x = 0;
    let z = 0;

    const controls =
        save.settings.controls;

    if (
        keys[controls.left] ||
        keys["arrowleft"]
    )
        x -= 1;

    if (
        keys[controls.right] ||
        keys["arrowright"]
    )
        x += 1;

    if (
        keys[controls.up] ||
        keys["arrowup"]
    )
        z -= 1;

    if (
        keys[controls.down] ||
        keys["arrowdown"]
    )
        z += 1;

    x += mobileInput.x;
    z += mobileInput.y;

    const magnitude =
        Math.hypot(x, z);

    if (magnitude > 0) {
        x /= magnitude;
        z /= magnitude;

        const sprint =
            keys[controls.sprint] ||
            mobileInput.sprint;

        let speed = 5.2;

        if (sprint && stamina > 0) {
            speed = 8.2;
            stamina -= delta * 25;
        } else {
            stamina += delta * 15;
        }

        stamina = THREE.MathUtils.clamp(
            stamina,
            0,
            100
        );

        controlledPlayer.position.x +=
            x * speed * delta;

        controlledPlayer.position.z +=
            z * speed * delta;

        controlledPlayer.position.x =
            THREE.MathUtils.clamp(
                controlledPlayer.position.x,
                -10.8,
                10.8
            );

        controlledPlayer.position.z =
            THREE.MathUtils.clamp(
                controlledPlayer.position.z,
                -18.5,
                18.5
            );

        controlledPlayer.rotation.y =
            Math.atan2(x, z);
    }

    if (ballOwner === controlledPlayer) {
        attachBallToPlayer();
    } else {
        tryTakeBall();
    }
}


/* =========================================================
   BALL CONTROL
   ========================================================= */

function tryTakeBall() {

    if (!ball)
        return;

    const distance =
        controlledPlayer.position.distanceTo(
            ball.position
        );

    if (
        distance < 1.45 &&
        ballVelocity.length() < 0.5
    ) {
        ballOwner = controlledPlayer;
        attachBallToPlayer();
    }
}


/* =========================================================
   SHOOT
   ========================================================= */

function shoot() {

    if (
        !gameStarted ||
        !controlledPlayer ||
        !ball ||
        actionLocked
    )
        return;

    const distance =
        controlledPlayer.position.distanceTo(
            ball.position
        );

    if (
        ballOwner !== controlledPlayer &&
        distance > 1.8
    ) {
        notify("Get closer to the ball!");
        return;
    }

    actionLocked = true;
    ballOwner = null;

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        controlledPlayer.quaternion
    );

    ballVelocity.copy(
        direction.multiplyScalar(18)
    );

    ballVelocity.y = 4.5;

    notify("SHOT!");

    setTimeout(() => {
        actionLocked = false;
    }, 350);
}

window.shoot = shoot;


/* =========================================================
   PASS
   ========================================================= */

function pass() {

    if (
        !gameStarted ||
        !controlledPlayer ||
        !ball ||
        actionLocked
    )
        return;

    const distance =
        controlledPlayer.position.distanceTo(
            ball.position
        );

    if (
        ballOwner !== controlledPlayer &&
        distance > 1.8
    ) {
        notify("Get the ball first!");
        return;
    }

    if (!teammates.length)
        return;

    actionLocked = true;
    ballOwner = null;

    let target =
        teammates[0];

    let bestDistance = Infinity;

    teammates.forEach(teammate => {

        const d =
            controlledPlayer.position.distanceTo(
                teammate.position
            );

        if (d < bestDistance) {
            bestDistance = d;
            target = teammate;
        }
    });

    const direction =
        target.position
            .clone()
            .sub(ball.position)
            .normalize();

    ballVelocity.copy(
        direction.multiplyScalar(12)
    );

    ballVelocity.y = 1.2;

    notify("PASS!");

    setTimeout(() => {
        actionLocked = false;
    }, 250);
}

window.pass = pass;


/* =========================================================
   DRIBBLE
   ========================================================= */

function dribble() {

    if (!gameStarted || !controlledPlayer)
        return;

    if (ballOwner !== controlledPlayer)
        return;

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        controlledPlayer.quaternion
    );

    controlledPlayer.position.add(
        direction.multiplyScalar(0.65)
    );

    controlledPlayer.position.x =
        THREE.MathUtils.clamp(
            controlledPlayer.position.x,
            -10.8,
            10.8
        );

    controlledPlayer.position.z =
        THREE.MathUtils.clamp(
            controlledPlayer.position.z,
            -18.5,
            18.5
        );

    attachBallToPlayer();

    notify("DRIBBLE!");
}

window.dribble = dribble;


/* =========================================================
   BALL PHYSICS
   ========================================================= */

function updateBall(delta) {

    if (!ball)
        return;

    if (ballOwner === controlledPlayer) {
        attachBallToPlayer();
        return;
    }

    if (ballVelocity.lengthSq() <= 0.001)
        return;

    ball.position.addScaledVector(
        ballVelocity,
        delta
    );

    ballVelocity.multiplyScalar(
        Math.pow(0.35, delta)
    );

    ballVelocity.y -=
        18 * delta;

    if (ball.position.y <= 0.35) {
        ball.position.y = 0.35;

        ballVelocity.y *= -0.35;

        if (Math.abs(ballVelocity.y) < 0.5)
            ballVelocity.y = 0;
    }

    ball.rotation.x += delta * 8;
    ball.rotation.z += delta * 6;

    checkBallPickup();
    checkGoal();
}


function checkBallPickup() {

    if (
        !controlledPlayer ||
        !ball
    )
        return;

    if (
        ballVelocity.length() > 2
    )
        return;

    const distance =
        controlledPlayer.position.distanceTo(
            ball.position
        );

    if (distance < 1.25) {
        ballOwner = controlledPlayer;
        ballVelocity.set(0, 0, 0);
        attachBallToPlayer();
    }
}


/* =========================================================
   GOAL DETECTION
   ========================================================= */

function checkGoal() {

    if (!ball)
        return;

    if (
        ball.position.z <= -20.5 &&
        Math.abs(ball.position.x) < 2.7
    ) {
        homeScore++;

        updateScore();

        showGoal("CRISTIANO RONALDO");

        resetAfterGoal();

        return;
    }

    if (
        ball.position.z >= 20.5 &&
        Math.abs(ball.position.x) < 2.7
    ) {
        awayScore++;

        updateScore();

        showGoal("RIVAL FC");

        resetAfterGoal();
    }
}


function resetAfterGoal() {

    ballOwner = controlledPlayer;
    ballVelocity.set(0, 0, 0);

    controlledPlayer.position.set(
        0,
        0,
        8
    );

    attachBallToPlayer();
}


function showGoal(scorer) {

    const message = $("goal-message");

    if (!message)
        return;

    if ($("goal-scorer"))
        $("goal-scorer").textContent =
            scorer;

    message.classList.add("show");

    setTimeout(() => {
        message.classList.remove("show");
    }, 1800);
}


/* =========================================================
   SCORE
   ========================================================= */

function updateScore() {

    if ($("home-score"))
        $("home-score").textContent =
            homeScore;

    if ($("away-score"))
        $("away-score").textContent =
            awayScore;
}


/* =========================================================
   TIMER
   ========================================================= */

function updateMatchTimer() {

    const timer = $("timer");

    if (!timer)
        return;

    const minutes =
        Math.floor(matchTime / 60);

    const seconds =
        Math.floor(matchTime % 60);

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function updateTimer(delta) {

    if (!gameStarted)
        return;

    matchTime -= delta;

    if (matchTime <= 0) {

        matchTime = 0;

        updateMatchTimer();

        gameStarted = false;

        setTimeout(() => {

            alert(
                `FULL TIME!\n\n${homeScore} - ${awayScore}`
            );

            leaveMatch();

        }, 100);

        return;
    }

    updateMatchTimer();
}


/* =========================================================
   STAMINA
   ========================================================= */

function updateStamina() {

    const fill = $("stamina-fill");

    if (fill)
        fill.style.width =
            `${stamina}%`;
}


/* =========================================================
   AI
   ========================================================= */

function updateOpponents(delta) {

    if (!gameStarted)
        return;

    opponents.forEach((opponent, index) => {

        const target =
            index === 0 && ball
                ? ball.position
                : controlledPlayer.position;

        const direction =
            target.clone()
                .sub(opponent.position);

        direction.y = 0;

        const distance =
            direction.length();

        if (
            distance > 1.7 &&
            distance < 13
        ) {
            direction.normalize();

            opponent.position.addScaledVector(
                direction,
                delta * 1.8
            );

            opponent.rotation.y =
                Math.atan2(
                    direction.x,
                    direction.z
                );
        }

        opponent.position.x =
            THREE.MathUtils.clamp(
                opponent.position.x,
                -10.5,
                10.5
            );

        opponent.position.z =
            THREE.MathUtils.clamp(
                opponent.position.z,
                -18.5,
                18.5
            );
    });
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

    if (
        !camera ||
        !controlledPlayer
    )
        return;

    const desiredX =
        controlledPlayer.position.x;

    const desiredZ =
        controlledPlayer.position.z + 13;

    camera.position.x +=
        (desiredX - camera.position.x) *
        0.08;

    camera.position.z +=
        (desiredZ - camera.position.z) *
        0.08;

    camera.lookAt(
        controlledPlayer.position.x,
        0,
        controlledPlayer.position.z
    );
}


/* =========================================================
   MATCH LOOP
   ========================================================= */

function matchLoop() {

    requestAnimationFrame(matchLoop);

    if (!renderer)
        return;

    const now = performance.now();

    const delta =
        Math.min(
            (now - previousFrame) / 1000,
            0.05
        );

    previousFrame = now;

    updatePlayer(delta);
    updateBall(delta);
    updateOpponents(delta);
    updateTimer(delta);
    updateStamina();
    updateCamera();

    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (event.code === "Space") {
            event.preventDefault();
            shoot();
        }

        const controls =
            save.settings.controls;

        if (
            key === controls.pass &&
            key !== controls.shoot
        ) {
            pass();
        }

        if (
            key === controls.dribble &&
            key !== controls.shoot
        ) {
            dribble();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


/* =========================================================
   MOBILE CONTROLS
   ========================================================= */

function setupTouchControls() {

    const joystick = $("joystick");
    const stick = $("joystick-stick");

    if (joystick && stick) {

        let active = false;

        function moveJoystick(touch) {

            const rect =
                joystick.getBoundingClientRect();

            const centerX =
                rect.left +
                rect.width / 2;

            const centerY =
                rect.top +
                rect.height / 2;

            let dx =
                touch.clientX -
                centerX;

            let dy =
                touch.clientY -
                centerY;

            const max =
                rect.width / 2 - 25;

            const distance =
                Math.hypot(dx, dy);

            if (distance > max) {
                dx =
                    dx / distance *
                    max;

                dy =
                    dy / distance *
                    max;
            }

            mobileInput.x =
                dx / max;

            mobileInput.y =
                dy / max;

            stick.style.left =
                `${50 + mobileInput.x * 35}%`;

            stick.style.top =
                `${50 + mobileInput.y * 35}%`;
        }

        joystick.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                active = true;

                moveJoystick(
                    event.touches[0]
                );
            },
            {passive:false}
        );

        joystick.addEventListener(
            "touchmove",
            event => {

                event.preventDefault();

                if (active)
                    moveJoystick(
                        event.touches[0]
                    );
            },
            {passive:false}
        );

        joystick.addEventListener(
            "touchend",
            () => {

                active = false;

                mobileInput.x = 0;
                mobileInput.y = 0;

                stick.style.left = "50%";
                stick.style.top = "50%";
            }
        );
    }


    setupActionButton(
        "shoot-button",
        shoot
    );

    setupActionButton(
        "pass-button",
        pass
    );

    setupActionButton(
        "dribble-button",
        dribble
    );


    const sprint = $("sprint-button");

    if (sprint) {

        sprint.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                mobileInput.sprint = true;
            },
            {passive:false}
        );

        sprint.addEventListener(
            "touchend",
            () => {
                mobileInput.sprint = false;
            }
        );

        sprint.addEventListener(
            "mousedown",
            () => {
                mobileInput.sprint = true;
            }
        );

        sprint.addEventListener(
            "mouseup",
            () => {
                mobileInput.sprint = false;
            }
        );
    }
}


function setupActionButton(id, callback) {

    const button = $(id);

    if (!button)
        return;

    button.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            callback();
        },
        {passive:false}
    );

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            callback();
        }
    );
}


/* =========================================================
   LEAVE MATCH
   ========================================================= */

function leaveMatch() {

    gameStarted = false;

    const match = $("match-screen");

    if (match)
        match.classList.remove("active");

    openPage("match-menu");
}

window.leaveMatch = leaveMatch;


/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {

    document
        .querySelectorAll("[data-control]")
        .forEach(input => {

            const control =
                input.dataset.control;

            input.value =
                save.settings.controls[control] || "";

            input.addEventListener(
                "change",
                () => {

                    save.settings.controls[control] =
                        input.value.toLowerCase();

                    saveGame();

                    notify("Keybind saved");
                }
            );
        });


    const graphics =
        $("graphics-setting");

    if (graphics) {

        graphics.value =
            save.settings.graphics;

        graphics.addEventListener(
            "change",
            () => {

                save.settings.graphics =
                    graphics.value;

                saveGame();

                notify(
                    `Graphics: ${graphics.value}`
                );
            }
        );
    }
}


/* =========================================================
   TEAM SELECTION
   ========================================================= */

function setupTeams() {

    document
        .querySelectorAll(".team-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const name =
                        card.querySelector("h2");

                    if (!name)
                        return;

                    save.selectedTeam =
                        name.textContent;

                    saveGame();

                    document
                        .querySelectorAll(".team-card")
                        .forEach(c =>
                            c.classList.remove("selected")
                        );

                    card.classList.add("selected");

                    notify(
                        `${save.selectedTeam} selected`
                    );
                }
            );
        });
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCoinsUI();

        renderSquad();

        setupSettings();

        setupTeams();

        /* Fix the HTML's inline START button */

        const startButton =
            $("start-button");

        if (startButton) {
            startButton.onclick =
                startMatch;
        }

        /* Fix pack button */

        const packButton =
            $("packButton");

        if (packButton) {
            packButton.onclick =
                () => openPack("bronze");
        }

        /* Prepare Three.js */

        if ($("game-container")) {
            initializeMatch();
        }
    }
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (!camera || !renderer)
            return;

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
