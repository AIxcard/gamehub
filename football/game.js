/* =========================================================
   FOOTBALL LEGENDS
   GAME.JS
   Match + Squad + Packs + Shop + Settings
   ========================================================= */

"use strict";

/* =========================================================
   PLAYER DATABASE
   ========================================================= */

const PLAYERS = [
    {
        id: "ronaldo",
        name: "Cristiano Ronaldo",
        rating: 99,
        position: "LW",
        country: "Portugal",
        club: "Al Nassr",
        rarity: "ICON",
        avatar: "CR7"
    },
    {
        id: "messi",
        name: "Lionel Messi",
        rating: 99,
        position: "RW",
        country: "Argentina",
        club: "Inter Miami",
        rarity: "ICON",
        avatar: "LM10"
    },
    {
        id: "mbappe",
        name: "Kylian Mbappé",
        rating: 98,
        position: "ST",
        country: "France",
        club: "Real Madrid",
        rarity: "LEGENDARY",
        avatar: "KM"
    },
    {
        id: "haaland",
        name: "Erling Haaland",
        rating: 98,
        position: "ST",
        country: "Norway",
        club: "Manchester City",
        rarity: "LEGENDARY",
        avatar: "EH9"
    },
    {
        id: "vinicius",
        name: "Vinícius Júnior",
        rating: 97,
        position: "LW",
        country: "Brazil",
        club: "Real Madrid",
        rarity: "LEGENDARY",
        avatar: "VJR"
    },
    {
        id: "bellingham",
        name: "Jude Bellingham",
        rating: 97,
        position: "CM",
        country: "England",
        club: "Real Madrid",
        rarity: "LEGENDARY",
        avatar: "JB"
    },
    {
        id: "debruyne",
        name: "Kevin De Bruyne",
        rating: 96,
        position: "CM",
        country: "Belgium",
        club: "Manchester City",
        rarity: "EPIC",
        avatar: "KDB"
    },
    {
        id: "salah",
        name: "Mohamed Salah",
        rating: 96,
        position: "RW",
        country: "Egypt",
        club: "Liverpool",
        rarity: "EPIC",
        avatar: "MS"
    },
    {
        id: "kane",
        name: "Harry Kane",
        rating: 95,
        position: "ST",
        country: "England",
        club: "Bayern Munich",
        rarity: "EPIC",
        avatar: "HK9"
    },
    {
        id: "neymar",
        name: "Neymar Jr",
        rating: 95,
        position: "LW",
        country: "Brazil",
        club: "Santos",
        rarity: "EPIC",
        avatar: "NEY"
    },
    {
        id: "modric",
        name: "Luka Modrić",
        rating: 94,
        position: "CM",
        country: "Croatia",
        club: "Real Madrid",
        rarity: "EPIC",
        avatar: "LM"
    },
    {
        id: "rodri",
        name: "Rodri",
        rating: 94,
        position: "CDM",
        country: "Spain",
        club: "Manchester City",
        rarity: "RARE",
        avatar: "RD"
    },
    {
        id: "van_dijk",
        name: "Virgil van Dijk",
        rating: 94,
        position: "CB",
        country: "Netherlands",
        club: "Liverpool",
        rarity: "RARE",
        avatar: "VVD"
    },
    {
        id: "courtois",
        name: "Thibaut Courtois",
        rating: 94,
        position: "GK",
        country: "Belgium",
        club: "Real Madrid",
        rarity: "RARE",
        avatar: "TC"
    },
    {
        id: "alisson",
        name: "Alisson Becker",
        rating: 93,
        position: "GK",
        country: "Brazil",
        club: "Liverpool",
        rarity: "RARE",
        avatar: "AB"
    },
    {
        id: "kvaratskhelia",
        name: "Khvicha Kvaratskhelia",
        rating: 91,
        position: "LW",
        country: "Georgia",
        club: "PSG",
        rarity: "RARE",
        avatar: "KK"
    },
    {
        id: "musiala",
        name: "Jamal Musiala",
        rating: 91,
        position: "CAM",
        country: "Germany",
        club: "Bayern Munich",
        rarity: "RARE",
        avatar: "JM"
    },
    {
        id: "saka",
        name: "Bukayo Saka",
        rating: 90,
        position: "RW",
        country: "England",
        club: "Arsenal",
        rarity: "RARE",
        avatar: "BS"
    },
    {
        id: "foden",
        name: "Phil Foden",
        rating: 90,
        position: "RW",
        country: "England",
        club: "Manchester City",
        rarity: "RARE",
        avatar: "PF"
    },
    {
        id: "pedri",
        name: "Pedri",
        rating: 90,
        position: "CM",
        country: "Spain",
        club: "Barcelona",
        rarity: "RARE",
        avatar: "PD"
    },
    {
        id: "yamal",
        name: "Lamine Yamal",
        rating: 89,
        position: "RW",
        country: "Spain",
        club: "Barcelona",
        rarity: "RARE",
        avatar: "LY"
    },
    {
        id: "gavi",
        name: "Gavi",
        rating: 88,
        position: "CM",
        country: "Spain",
        club: "Barcelona",
        rarity: "COMMON",
        avatar: "GV"
    },
    {
        id: "wirtz",
        name: "Florian Wirtz",
        rating: 89,
        position: "CAM",
        country: "Germany",
        club: "Liverpool",
        rarity: "COMMON",
        avatar: "FW"
    },
    {
        id: "martinez",
        name: "Lautaro Martínez",
        rating: 90,
        position: "ST",
        country: "Argentina",
        club: "Inter",
        rarity: "RARE",
        avatar: "LM"
    },
    {
        id: "son",
        name: "Son Heung-min",
        rating: 89,
        position: "LW",
        country: "South Korea",
        club: "LAFC",
        rarity: "COMMON",
        avatar: "SON"
    }
];


/* =========================================================
   SAVE DATA
   ========================================================= */

const SAVE_KEY = "football_legends_save_v2";

const defaultSave = {
    coins: 1000,
    collection: [],
    squad: [],
    settings: {
        music: true,
        effects: true,
        vibration: true,
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

function loadSave() {

    try {

        const stored =
            localStorage.getItem(SAVE_KEY);

        save = stored
            ? {
                ...defaultSave,
                ...JSON.parse(stored)
            }
            : structuredClone(defaultSave);

    } catch {

        save = structuredClone(defaultSave);
    }

    save.coins =
        Number(save.coins) || 1000;

    if (!Array.isArray(save.collection))
        save.collection = [];

    if (!Array.isArray(save.squad))
        save.squad = [];

    if (!save.settings)
        save.settings = structuredClone(defaultSave.settings);

    if (!save.settings.controls)
        save.settings.controls =
            structuredClone(defaultSave.settings.controls);
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
   DOM HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function createElement(tag, className, text) {

    const element =
        document.createElement(tag);

    if (className)
        element.className = className;

    if (text !== undefined)
        element.textContent = text;

    return element;
}


/* =========================================================
   COINS
   ========================================================= */

function updateCoinsUI() {

    const elements =
        document.querySelectorAll(
            "#coins, .coins-value"
        );

    elements.forEach(
        element => {
            element.textContent =
                save.coins;
        }
    );
}


/* =========================================================
   PACKS
   ========================================================= */

const PACKS = {
    bronze: {
        name: "BRONZE PACK",
        price: 100,
        description: "A basic pack with a chance of finding a rare player.",
        chances: {
            COMMON: 60,
            RARE: 30,
            EPIC: 9,
            LEGENDARY: 1
        }
    },

    gold: {
        name: "GOLD PACK",
        price: 300,
        description: "Better players. Better chances.",
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
        description: "High chance of an elite footballer.",
        chances: {
            RARE: 30,
            EPIC: 45,
            LEGENDARY: 20,
            ICON: 5
        }
    }
};


function weightedRarity(chances) {

    const random =
        Math.random() * 100;

    let total = 0;

    for (const rarity in chances) {

        total += chances[rarity];

        if (random <= total)
            return rarity;
    }

    return Object.keys(chances)[0];
}


function getPlayerFromPack(pack) {

    const rarity =
        weightedRarity(pack.chances);

    const possible =
        PLAYERS.filter(
            player =>
                player.rarity === rarity
        );

    if (!possible.length) {

        const fallback =
            PLAYERS.filter(
                player =>
                    player.rating >= 85
            );

        return fallback[
            Math.floor(
                Math.random() *
                fallback.length
            )
        ];
    }

    return possible[
        Math.floor(
            Math.random() *
            possible.length
        )
    ];
}


function openPack(packId = "bronze") {

    const pack = PACKS[packId];

    if (!pack)
        return;

    if (save.coins < pack.price) {

        showNotification(
            "Not enough coins!",
            "error"
        );

        return;
    }

    save.coins -= pack.price;

    const player =
        getPlayerFromPack(pack);

    save.collection.push(player.id);

    if (save.squad.length < 11) {

        save.squad.push(
            player.id
        );
    }

    saveGame();

    showPackResult(player);
}


window.openPack = openPack;


/* =========================================================
   PACK RESULT
   ========================================================= */

function showPackResult(player) {

    const result =
        $("packResult");

    if (!result)
        return;

    if ($("resultRating"))
        $("resultRating").textContent =
            player.rating;

    if ($("resultPosition"))
        $("resultPosition").textContent =
            player.position;

    if ($("resultAvatar"))
        $("resultAvatar").textContent =
            player.avatar;

    if ($("resultName"))
        $("resultName").textContent =
            player.name;

    if ($("resultCountry"))
        $("resultCountry").textContent =
            `${player.country} • ${player.club}`;

    result.classList.remove("hidden");
    result.classList.add("show");
}


function closePack() {

    const result =
        $("packResult");

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

function getPlayer(id) {

    return PLAYERS.find(
        player => player.id === id
    );
}


function renderSquad() {

    const squad =
        $("squad");

    if (!squad)
        return;

    squad.innerHTML = "";

    if (!save.collection.length) {

        squad.innerHTML =
            `<div class="empty">
                Open a pack to get your first player!
            </div>`;

        return;
    }

    const uniquePlayers =
        [...new Set(save.collection)];

    uniquePlayers.forEach(
        id => {

            const player =
                getPlayer(id);

            if (!player)
                return;

            const card =
                createElement(
                    "div",
                    "player-card"
                );

            card.innerHTML = `
                <div class="rating">
                    ${player.rating}
                </div>

                <div class="position">
                    ${player.position}
                </div>

                <div class="player-avatar">
                    ${player.avatar}
                </div>

                <h3>${player.name}</h3>

                <p>
                    ${player.country}
                    •
                    ${player.club}
                </p>

                <button class="squad-add">
                    ${save.squad.includes(player.id)
                        ? "IN SQUAD"
                        : "ADD TO SQUAD"}
                </button>
            `;

            const button =
                card.querySelector(
                    ".squad-add"
                );

            button.addEventListener(
                "click",
                () => {

                    addToSquad(
                        player.id
                    );
                }
            );

            squad.appendChild(card);
        }
    );
}


function addToSquad(id) {

    if (save.squad.includes(id)) {

        save.squad =
            save.squad.filter(
                playerId =>
                    playerId !== id
            );

        showNotification(
            "Removed from squad"
        );

    } else {

        if (save.squad.length >= 11) {

            showNotification(
                "Your squad already has 11 players!",
                "error"
            );

            return;
        }

        save.squad.push(id);

        showNotification(
            "Player added to squad"
        );
    }

    saveGame();
    renderSquad();
}


/* =========================================================
   SHOP
   ========================================================= */

function renderShop() {

    let shop =
        $("shop");

    if (!shop)
        return;

    shop.innerHTML = "";

    Object.entries(PACKS)
        .forEach(
            ([id, pack]) => {

                const card =
                    createElement(
                        "div",
                        "pack-card"
                    );

                card.innerHTML = `
                    <div class="pack-icon">⚽</div>

                    <div class="pack-rarity">
                        FOOTBALL PACK
                    </div>

                    <h2>${pack.name}</h2>

                    <p>${pack.description}</p>

                    <div class="pack-price">
                        🪙 ${pack.price}
                    </div>

                    <button class="open-pack">
                        OPEN PACK
                    </button>
                `;

                card
                    .querySelector(".open-pack")
                    .addEventListener(
                        "click",
                        () => openPack(id)
                    );

                shop.appendChild(card);
            }
        );
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification(
    message,
    type = "normal"
) {

    let notification =
        $("game-notification");

    if (!notification) {

        notification =
            createElement(
                "div",
                "game-notification"
            );

        notification.id =
            "game-notification";

        document.body.appendChild(
            notification
        );
    }

    notification.textContent =
        message;

    notification.dataset.type =
        type;

    notification.classList.add(
        "visible"
    );

    clearTimeout(
        notification._timer
    );

    notification._timer =
        setTimeout(
            () => {
                notification.classList.remove(
                    "visible"
                );
            },
            1800
        );
}


/* =========================================================
   THREE.JS MATCH
   ========================================================= */

let scene = null;
let camera = null;
let renderer = null;

let player = null;
let ball = null;

let gameStarted = false;

let homeScore = 0;
let awayScore = 0;

let matchTime = 180;

let stamina = 100;

let shooting = false;
let passing = false;

const keys = {};

const mobileInput = {
    x: 0,
    y: 0,
    sprint: false
};

let teammates = [];
let opponents = [];


/* =========================================================
   INITIALIZE MATCH
   ========================================================= */

function initializeMatch() {

    if (typeof THREE === "undefined") {

        console.error(
            "Three.js was not loaded."
        );

        return;
    }

    const container =
        $("game-container");

    if (!container)
        return;

    if (renderer)
        return;

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x6fa8dc
        );


    camera =
        new THREE.PerspectiveCamera(
            55,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );

    camera.position.set(
        0,
        13,
        18
    );


    renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.shadowMap.enabled =
        true;

    container.appendChild(
        renderer.domElement
    );


    /* LIGHT */

    scene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x315d3b,
            2
        )
    );

    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    sun.position.set(
        10,
        25,
        10
    );

    sun.castShadow = true;

    scene.add(sun);


    /* FIELD */

    const fieldWidth = 22;
    const fieldLength = 34;

    const field =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                fieldWidth,
                0.25,
                fieldLength
            ),
            new THREE.MeshStandardMaterial({
                color: 0x208548,
                roughness: 0.9
            })
        );

    field.position.y = -0.15;
    field.receiveShadow = true;

    scene.add(field);


    /* FIELD STRIPES */

    for (
        let z = -fieldLength / 2;
        z < fieldLength / 2;
        z += 4
    ) {

        const stripe =
            new THREE.Mesh(
                new THREE.PlaneGeometry(
                    fieldWidth,
                    4
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        Math.floor(
                            (z + fieldLength / 2) /
                            4
                        ) % 2 === 0
                            ? 0x208548
                            : 0x1c7a40
                })
            );

        stripe.rotation.x =
            -Math.PI / 2;

        stripe.position.set(
            0,
            0.01,
            z + 2
        );

        scene.add(stripe);
    }


    /* FIELD LINES */

    createMatchLine(
        0,
        -17,
        22,
        0.12
    );

    createMatchLine(
        0,
        17,
        22,
        0.12
    );

    createMatchLine(
        -11,
        0,
        0.12,
        34
    );

    createMatchLine(
        11,
        0,
        0.12,
        34
    );

    createMatchLine(
        0,
        0,
        22,
        0.08
    );


    /* CENTER CIRCLE */

    const points = [];

    for (
        let i = 0;
        i <= 64;
        i++
    ) {

        const angle =
            i / 64 *
            Math.PI *
            2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) * 3,
                0.04,
                Math.sin(angle) * 3
            )
        );
    }

    const centerCircle =
        new THREE.LineLoop(
            new THREE.BufferGeometry()
                .setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 0xffffff
            })
        );

    scene.add(centerCircle);


    /* GOALS */

    createGoal(
        -17
    );

    createGoal(
        17
    );


    /* PLAYERS */

    player =
        createPlayer3D(
            0xffffff,
            "Cristiano Ronaldo"
        );

    player.position.set(
        0,
        0,
        7
    );


    const teammatePositions = [
        [-5, 0, 3],
        [5, 0, 1],
        [-3, 0, -4],
        [4, 0, -7]
    ];

    teammates = [];

    teammatePositions.forEach(
        position => {

            const p =
                createPlayer3D(
                    0x1769aa,
                    "Teammate"
                );

            p.position.set(
                position[0],
                position[1],
                position[2]
            );

            teammates.push(p);
        }
    );


    const opponentPositions = [
        [-4, 0, -3],
        [4, 0, -5],
        [0, 0, -9],
        [-5, 0, -11],
        [5, 0, -12]
    ];

    opponents = [];

    opponentPositions.forEach(
        position => {

            const p =
                createPlayer3D(
                    0xd62828,
                    "Opponent"
                );

            p.position.set(
                position[0],
                position[1],
                position[2]
            );

            opponents.push(p);
        }
    );


    /* BALL */

    ball =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.3,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4
            })
        );

    ball.position.set(
        0,
        0.35,
        5.5
    );

    ball.castShadow = true;

    scene.add(ball);


    setupMatchControls();

    gameLoop();
}


/* =========================================================
   MATCH FIELD LINE
   ========================================================= */

function createMatchLine(
    x,
    z,
    width,
    depth
) {

    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.04,
                depth
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    line.position.set(
        x,
        0.03,
        z
    );

    scene.add(line);
}


/* =========================================================
   GOAL
   ========================================================= */

function createGoal(z) {

    const group =
        new THREE.Group();

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

    const left =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.15,
                2.5,
                0.15
            ),
            material
        );

    const right =
        left.clone();

    const crossbar =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.15,
                0.15
            ),
            material
        );

    left.position.set(
        -2.5,
        1.25,
        0
    );

    right.position.set(
        2.5,
        1.25,
        0
    );

    crossbar.position.y =
        2.5;

    group.add(
        left,
        right,
        crossbar
    );

    group.position.z =
        z;

    scene.add(group);
}


/* =========================================================
   3D PLAYER
   ========================================================= */

function createPlayer3D(
    color,
    name
) {

    const group =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.45,
                0.8,
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


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.3,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd69b73
            })
        );

    head.position.y =
        1.85;

    head.castShadow = true;

    group.add(head);

    group.userData.name =
        name;

    scene.add(group);

    return group;
}


/* =========================================================
   START MATCH
   ========================================================= */

function startMatch() {

    if (!renderer)
        initializeMatch();

    gameStarted = true;

    homeScore = 0;
    awayScore = 0;

    matchTime = 180;
    stamina = 100;

    resetBall();

    updateScore();
    updateMatchTimer();

    const start =
        $("start-screen");

    if (start)
        start.style.display =
            "none";

    showNotification(
        "MATCH STARTED"
    );
}


window.startGame = startMatch;


/* =========================================================
   MATCH MOVEMENT
   ========================================================= */

function updatePlayer(delta) {

    if (!gameStarted || !player)
        return;

    let x = 0;
    let z = 0;

    const controls =
        save.settings.controls;

    if (
        keys[
            controls.left
        ] ||
        keys["arrowleft"]
    )
        x -= 1;

    if (
        keys[
            controls.right
        ] ||
        keys["arrowright"]
    )
        x += 1;

    if (
        keys[
            controls.up
        ] ||
        keys["arrowup"]
    )
        z -= 1;

    if (
        keys[
            controls.down
        ] ||
        keys["arrowdown"]
    )
        z += 1;


    x += mobileInput.x;
    z += mobileInput.y;


    const length =
        Math.hypot(x, z);

    if (length <= 0)
        return;

    x /= length;
    z /= length;


    const sprint =
        keys[
            controls.sprint
        ] ||
        mobileInput.sprint;


    let speed = 5.5;

    if (
        sprint &&
        stamina > 0
    ) {

        speed = 8.5;

        stamina -=
            delta * 22;

    } else {

        stamina +=
            delta * 12;
    }


    stamina =
        Math.max(
            0,
            Math.min(
                100,
                stamina
            )
        );


    player.position.x +=
        x * speed * delta;

    player.position.z +=
        z * speed * delta;


    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -9.8,
            9.8
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -15.8,
            15.8
        );


    player.rotation.y =
        Math.atan2(
            x,
            z
        );


    /* BALL CONTROL */

    const distance =
        player.position.distanceTo(
            ball.position
        );

    if (
        distance < 1.7 &&
        !shooting &&
        !passing
    ) {

        ball.position.x =
            player.position.x -
            Math.sin(
                player.rotation.y
            ) * 0.9;

        ball.position.z =
            player.position.z -
            Math.cos(
                player.rotation.y
            ) * 0.9;
    }
}


/* =========================================================
   SHOOT
   ========================================================= */

function shoot() {

    if (!gameStarted || shooting)
        return;

    if (
        player.position.distanceTo(
            ball.position
        ) > 2
    )
        return;

    shooting = true;

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        player.quaternion
    );

    const start =
        ball.position.clone();

    const target =
        start.clone().add(
            direction.multiplyScalar(15)
        );

    animateBall(
        start,
        target,
        0.5,
        "shoot"
    );
}


/* =========================================================
   PASS
   ========================================================= */

function pass() {

    if (!gameStarted || passing)
        return;

    if (
        player.position.distanceTo(
            ball.position
        ) > 2
    )
        return;

    if (!teammates.length)
        return;

    passing = true;

    let closest =
        teammates[0];

    let closestDistance =
        Infinity;

    teammates.forEach(
        teammate => {

            const distance =
                player.position.distanceTo(
                    teammate.position
                );

            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest =
                    teammate;
            }
        }
    );

    const start =
        ball.position.clone();

    const target =
        closest.position.clone();

    target.y = 0.35;

    animateBall(
        start,
        target,
        0.4,
        "pass"
    );
}


/* =========================================================
   DRIBBLE
   ========================================================= */

function dribble() {

    if (!gameStarted)
        return;

    if (
        player.position.distanceTo(
            ball.position
        ) > 2
    )
        return;

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        player.quaternion
    );

    ball.position.x =
        player.position.x +
        direction.x * 1.1;

    ball.position.z =
        player.position.z +
        direction.z * 1.1;

    showNotification(
        "DRIBBLE!"
    );
}


/* =========================================================
   BALL ANIMATION
   ========================================================= */

function animateBall(
    start,
    target,
    duration,
    type
) {

    const startTime =
        performance.now();

    function animate() {

        const progress =
            Math.min(
                (
                    performance.now() -
                    startTime
                ) /
                (duration * 1000),
                1
            );

        ball.position.lerpVectors(
            start,
            target,
            progress
        );

        ball.position.y =
            0.35 +
            Math.sin(
                progress * Math.PI
            ) *
            (
                type === "shoot"
                    ? 1.4
                    : 0.4
            );

        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            ball.position.y =
                0.35;

            if (type === "shoot")
                checkGoal();

            if (type === "pass") {

                passing = false;

                setTimeout(
                    () => {

                        ball.position.copy(
                            target
                        );

                    },
                    50
                );

            } else {

                shooting = false;
            }
        }
    }

    animate();
}


/* =========================================================
   GOAL
   ========================================================= */

function checkGoal() {

    if (
        ball.position.z <
        -17.5
    ) {

        homeScore++;

        showGoal(
            "CRISTIANO RONALDO"
        );

        resetBall();

    } else if (
        ball.position.z >
        17.5
    ) {

        awayScore++;

        updateScore();

        resetBall();
    }
}


function resetBall() {

    if (!ball)
        return;

    ball.position.set(
        player
            ? player.position.x
            : 0,
        0.35,
        player
            ? player.position.z - 1
            : 5.5
    );
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
   GOAL MESSAGE
   ========================================================= */

function showGoal(
    scorer
) {

    updateScore();

    const message =
        $("goal-message");

    if (!message)
        return;

    if ($("goal-scorer"))
        $("goal-scorer").textContent =
            scorer;

    message.classList.add(
        "show"
    );

    setTimeout(
        () => {

            message.classList.remove(
                "show"
            );

        },
        1800
    );
}


/* =========================================================
   TIMER
   ========================================================= */

function updateMatchTimer() {

    if ($("timer")) {

        const minutes =
            Math.floor(
                matchTime / 60
            );

        const seconds =
            Math.floor(
                matchTime % 60
            );

        $("timer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}


function updateTimer(delta) {

    if (!gameStarted)
        return;

    matchTime -= delta;

    if (matchTime <= 0) {

        matchTime = 0;

        gameStarted = false;

        updateMatchTimer();

        setTimeout(
            () => {

                alert(
                    `FULL TIME!\n${homeScore} - ${awayScore}`
                );

            },
            100
        );

        return;
    }

    updateMatchTimer();
}


/* =========================================================
   STAMINA
   ========================================================= */

function updateStamina() {

    if ($("stamina-fill")) {

        $("stamina-fill").style.width =
            `${stamina}%`;
    }
}


/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            if (gameStarted)
                shoot();
        }

        const controls =
            save.settings.controls;

        if (
            key === controls.pass
        )
            pass();

        if (
            key === controls.dribble
        )
            dribble();
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

function setupMatchControls() {

    const joystick =
        $("joystick");

    const stick =
        $("joystick-stick");

    if (joystick && stick) {

        let active = false;

        function moveJoystick(
            touch
        ) {

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
                rect.width / 2 -
                25;

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

                active = true;

                moveJoystick(
                    event.touches[0]
                );
            },
            { passive: true }
        );


        joystick.addEventListener(
            "touchmove",
            event => {

                if (!active)
                    return;

                moveJoystick(
                    event.touches[0]
                );
            },
            { passive: true }
        );


        joystick.addEventListener(
            "touchend",
            () => {

                active = false;

                mobileInput.x = 0;
                mobileInput.y = 0;

                stick.style.left =
                    "50%";

                stick.style.top =
                    "50%";
            }
        );
    }


    setupTouchButton(
        "shoot-button",
        shoot
    );

    setupTouchButton(
        "pass-button",
        pass
    );

    setupTouchButton(
        "dribble-button",
        dribble
    );


    const sprint =
        $("sprint-button");

    if (sprint) {

        sprint.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                mobileInput.sprint =
                    true;
            },
            { passive: false }
        );

        sprint.addEventListener(
            "touchend",
            () => {

                mobileInput.sprint =
                    false;
            }
        );
    }
}


function setupTouchButton(
    id,
    callback
) {

    const button =
        $(id);

    if (!button)
        return;

    button.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            callback();
        },
        { passive: false }
    );

    /* Also allow mouse clicks on PC */

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

    const match =
        $("match-screen");

    if (match)
        match.classList.remove(
            "active"
        );

    const home =
        $("home-screen");

    if (home)
        home.classList.add(
            "active"
        );

    const navigation =
        $("navigation");

    if (navigation)
        navigation.classList.add(
            "visible"
        );
}


window.leaveMatch =
    leaveMatch;


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

    if (!player || !camera)
        return;

    const targetX =
        player.position.x;

    const targetZ =
        player.position.z + 13;

    camera.position.x +=
        (
            targetX -
            camera.position.x
        ) * 0.08;

    camera.position.z +=
        (
            targetZ -
            camera.position.z
        ) * 0.08;

    camera.lookAt(
        player.position.x,
        0,
        player.position.z
    );
}


/* =========================================================
   GAME LOOP
   ========================================================= */

let previousTime =
    performance.now();


function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );

    if (!renderer)
        return;

    const now =
        performance.now();

    const delta =
        Math.min(
            (now - previousTime) /
            1000,
            0.05
        );

    previousTime = now;

    updatePlayer(delta);
    updateTimer(delta);
    updateStamina();
    updateCamera();

    if (ball) {

        ball.rotation.x +=
            delta * 5;

        ball.rotation.z +=
            delta * 3;
    }

    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   WINDOW RESIZE
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


/* =========================================================
   PAGE BUTTONS
   ========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.page;

                        showPage(page);
                    }
                );
            }
        );
}


function showPage(page) {

    document
        .querySelectorAll(
            ".page-screen"
        )
        .forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );
            }
        );

    const target =
        document.getElementById(
            `${page}-screen`
        );

    if (target)
        target.classList.add(
            "active"
        );

    const home =
        $("home-screen");

    if (home)
        home.classList.remove(
            "active"
        );

    if (page === "squad")
        renderSquad();

    if (page === "shop")
        renderShop();
}


function showHome() {

    document
        .querySelectorAll(
            ".page-screen"
        )
        .forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );
            }
        );

    const home =
        $("home-screen");

    if (home)
        home.classList.add(
            "active"
        );
}


/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {

    const controls =
        save.settings.controls;

    document
        .querySelectorAll(
            "[data-control]"
        )
        .forEach(
            element => {

                const control =
                    element.dataset.control;

                if (
                    controls[control]
                ) {

                    element.value =
                        controls[control];
                }

                element.addEventListener(
                    "change",
                    () => {

                        controls[control] =
                            element.value
                                .toLowerCase();

                        saveGame();

                        showNotification(
                            "Keybind saved"
                        );
                    }
                );
            }
        );
}


/* =========================================================
   INITIAL UI
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCoinsUI();

        renderSquad();

        renderShop();

        setupNavigation();

        setupSettings();

        const startButton =
            $("start-button");

        if (startButton) {

            startButton.addEventListener(
                "click",
                startMatch
            );
        }


        const leaveButton =
            $("leave-match");

        if (leaveButton) {

            leaveButton.addEventListener(
                "click",
                leaveMatch
            );
        }


        /* Current HTML pack button */

        const packButton =
            $("packButton");

        if (packButton) {

            packButton.onclick =
                () => openPack("bronze");
        }


        /* Match controls */

        if ($("game-container"))
            initializeMatch();
    }
);
