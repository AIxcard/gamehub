/* =========================================================
   FOOTBALL LEGENDS
   GAME.JS
   FULL WORKING VERSION
   ========================================================= */

"use strict";

/* =========================================================
   PLAYER DATABASE
   ========================================================= */

const PLAYERS = [
    { id:"ronaldo", name:"Cristiano Ronaldo", rating:99, position:"LW", country:"Portugal", club:"Al Nassr", rarity:"ICON", avatar:"CR7" },
    { id:"messi", name:"Lionel Messi", rating:99, position:"RW", country:"Argentina", club:"Inter Miami", rarity:"ICON", avatar:"LM10" },
    { id:"mbappe", name:"Kylian Mbappé", rating:98, position:"ST", country:"France", club:"Real Madrid", rarity:"LEGENDARY", avatar:"KM" },
    { id:"haaland", name:"Erling Haaland", rating:98, position:"ST", country:"Norway", club:"Manchester City", rarity:"LEGENDARY", avatar:"EH9" },
    { id:"vinicius", name:"Vinícius Júnior", rating:97, position:"LW", country:"Brazil", club:"Real Madrid", rarity:"LEGENDARY", avatar:"VJR" },
    { id:"bellingham", name:"Jude Bellingham", rating:97, position:"CM", country:"England", club:"Real Madrid", rarity:"LEGENDARY", avatar:"JB" },
    { id:"debruyne", name:"Kevin De Bruyne", rating:96, position:"CM", country:"Belgium", club:"Manchester City", rarity:"EPIC", avatar:"KDB" },
    { id:"salah", name:"Mohamed Salah", rating:96, position:"RW", country:"Egypt", club:"Liverpool", rarity:"EPIC", avatar:"MS" },
    { id:"kane", name:"Harry Kane", rating:95, position:"ST", country:"England", club:"Bayern Munich", rarity:"EPIC", avatar:"HK9" },
    { id:"neymar", name:"Neymar Jr", rating:95, position:"LW", country:"Brazil", club:"Santos", rarity:"EPIC", avatar:"NEY" },
    { id:"modric", name:"Luka Modrić", rating:94, position:"CM", country:"Croatia", club:"Real Madrid", rarity:"EPIC", avatar:"LM" },
    { id:"rodri", name:"Rodri", rating:94, position:"CDM", country:"Spain", club:"Manchester City", rarity:"RARE", avatar:"RD" },
    { id:"van_dijk", name:"Virgil van Dijk", rating:94, position:"CB", country:"Netherlands", club:"Liverpool", rarity:"RARE", avatar:"VVD" },
    { id:"courtois", name:"Thibaut Courtois", rating:94, position:"GK", country:"Belgium", club:"Real Madrid", rarity:"RARE", avatar:"TC" },
    { id:"alisson", name:"Alisson Becker", rating:93, position:"GK", country:"Brazil", club:"Liverpool", rarity:"RARE", avatar:"AB" },
    { id:"kvaratskhelia", name:"Khvicha Kvaratskhelia", rating:91, position:"LW", country:"Georgia", club:"PSG", rarity:"RARE", avatar:"KK" },
    { id:"musiala", name:"Jamal Musiala", rating:91, position:"CAM", country:"Germany", club:"Bayern Munich", rarity:"RARE", avatar:"JM" },
    { id:"saka", name:"Bukayo Saka", rating:90, position:"RW", country:"England", club:"Arsenal", rarity:"RARE", avatar:"BS" },
    { id:"foden", name:"Phil Foden", rating:90, position:"RW", country:"England", club:"Manchester City", rarity:"RARE", avatar:"PF" },
    { id:"pedri", name:"Pedri", rating:90, position:"CM", country:"Spain", club:"Barcelona", rarity:"RARE", avatar:"PD" },
    { id:"yamal", name:"Lamine Yamal", rating:89, position:"RW", country:"Spain", club:"Barcelona", rarity:"RARE", avatar:"LY" },
    { id:"gavi", name:"Gavi", rating:88, position:"CM", country:"Spain", club:"Barcelona", rarity:"COMMON", avatar:"GV" },
    { id:"wirtz", name:"Florian Wirtz", rating:89, position:"CAM", country:"Germany", club:"Liverpool", rarity:"COMMON", avatar:"FW" },
    { id:"martinez", name:"Lautaro Martínez", rating:90, position:"ST", country:"Argentina", club:"Inter", rarity:"RARE", avatar:"LM" },
    { id:"son", name:"Son Heung-min", rating:89, position:"LW", country:"South Korea", club:"LAFC", rarity:"COMMON", avatar:"SON" }
];


/* =========================================================
   SAVE SYSTEM
   ========================================================= */

const SAVE_KEY = "football_legends_save_v3";

const defaultSave = {
    coins: 1000,
    collection: [],
    squad: [],
    selectedTeam: "Legends FC",
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

function cloneDefault() {
    return JSON.parse(JSON.stringify(defaultSave));
}

function loadSave() {

    try {

        const stored = localStorage.getItem(SAVE_KEY);

        if (stored) {
            const parsed = JSON.parse(stored);

            save = {
                ...cloneDefault(),
                ...parsed,
                settings: {
                    ...cloneDefault().settings,
                    ...(parsed.settings || {}),
                    controls: {
                        ...cloneDefault().settings.controls,
                        ...(parsed.settings?.controls || {})
                    }
                }
            };

        } else {
            save = cloneDefault();
        }

    } catch (error) {

        console.error("Save loading error:", error);

        save = cloneDefault();
    }

    if (!Number.isFinite(Number(save.coins))) {
        save.coins = 1000;
    }

    save.coins = Number(save.coins);

    if (!Array.isArray(save.collection)) {
        save.collection = [];
    }

    if (!Array.isArray(save.squad)) {
        save.squad = [];
    }
}

function saveGame() {

    try {
        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(save)
        );
    } catch (error) {
        console.error("Save error:", error);
    }

    updateCoinsUI();
}


/* =========================================================
   DOM
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function updateCoinsUI() {

    document
        .querySelectorAll("#coins, .coins-value")
        .forEach(element => {
            element.textContent = save.coins;
        });
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification(message, type = "normal") {

    let notification = $("game-notification");

    if (!notification) {

        notification = document.createElement("div");

        notification.id = "game-notification";
        notification.className = "game-notification";

        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.dataset.type = type;

    notification.classList.add("visible");

    clearTimeout(notification._timer);

    notification._timer = setTimeout(() => {
        notification.classList.remove("visible");
    }, 1800);
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

/*
   IMPORTANT:
   Your HTML uses:

   openPage("match-menu")
   openPage("squad-page")
   openPage("shop-page")
   openPage("teams-page")
   openPage("settings-page")

   So this function matches that EXACT system.
*/

function openPage(pageId) {

    /* Stop a running match when entering a menu */
    if (pageId !== "match-menu" && gameStarted) {
        gameStarted = false;
    }

    document
        .querySelectorAll(".page-screen")
        .forEach(page => {
            page.classList.remove("active");
        });

    const page = $(pageId);

    if (page) {
        page.classList.add("active");
    }

    const home = $("home-screen");

    if (home) {
        home.classList.remove("active");
    }

    const navigation = $("navigation");

    if (navigation) {
        navigation.classList.add("visible");
    }

    const match = $("match-screen");

    if (match && pageId !== "match-menu") {
        match.classList.remove("active");
    }

    window.scrollTo(0, 0);

    if (pageId === "squad-page") {
        renderSquad();
    }

    if (pageId === "shop-page") {
        renderShop();
    }
}

window.openPage = openPage;


function showHome() {

    gameStarted = false;

    document
        .querySelectorAll(".page-screen")
        .forEach(page => {
            page.classList.remove("active");
        });

    const match = $("match-screen");

    if (match) {
        match.classList.remove("active");
    }

    const home = $("home-screen");

    if (home) {
        home.classList.add("active");
    }

    const navigation = $("navigation");

    if (navigation) {
        navigation.classList.remove("visible");
    }

    window.scrollTo(0, 0);
}

window.showHome = showHome;


/* =========================================================
   PACK SYSTEM
   ========================================================= */

const PACKS = {

    standard: {
        name: "Football Pack",
        price: 100,
        chances: {
            COMMON: 50,
            RARE: 35,
            EPIC: 12,
            LEGENDARY: 2.5,
            ICON: 0.5
        }
    },

    premium: {
        name: "Legend Pack",
        price: 250,
        chances: {
            RARE: 30,
            EPIC: 40,
            LEGENDARY: 25,
            ICON: 5
        }
    },

    bronze: {
        name: "Football Pack",
        price: 100,
        chances: {
            COMMON: 50,
            RARE: 35,
            EPIC: 12,
            LEGENDARY: 2.5,
            ICON: 0.5
        }
    },

    gold: {
        name: "Legend Pack",
        price: 250,
        chances: {
            RARE: 30,
            EPIC: 40,
            LEGENDARY: 25,
            ICON: 5
        }
    }
};


function weightedRarity(chances) {

    const random = Math.random() * 100;

    let total = 0;

    for (const rarity in chances) {

        total += chances[rarity];

        if (random < total) {
            return rarity;
        }
    }

    return Object.keys(chances)[
        Object.keys(chances).length - 1
    ];
}


function getPlayerFromPack(pack) {

    let rarity = weightedRarity(pack.chances);

    let possible = PLAYERS.filter(
        player => player.rarity === rarity
    );

    /*
       Safety fallback if a rarity somehow has
       no players.
    */

    if (!possible.length) {

        possible = PLAYERS.filter(
            player =>
                player.rarity === "RARE" ||
                player.rarity === "EPIC"
        );
    }

    return possible[
        Math.floor(Math.random() * possible.length)
    ];
}


function openPack(packId = "standard") {

    const pack = PACKS[packId];

    if (!pack) {
        console.error("Unknown pack:", packId);
        return;
    }

    if (save.coins < pack.price) {

        showNotification(
            "Not enough coins!",
            "error"
        );

        return;
    }

    save.coins -= pack.price;

    const player = getPlayerFromPack(pack);

    if (!player) {
        save.coins += pack.price;
        return;
    }

    save.collection.push(player.id);

    /*
       Automatically put the first 11 different
       players into the squad.
    */

    if (
        save.squad.length < 11 &&
        !save.squad.includes(player.id)
    ) {
        save.squad.push(player.id);
    }

    saveGame();

    showPackResult(player);

    renderSquad();
}

window.openPack = openPack;


/* =========================================================
   PREMIUM PACK
   ========================================================= */

function openPremiumPack() {
    openPack("premium");
}

window.openPremiumPack = openPremiumPack;


/* =========================================================
   PACK RESULT
   ========================================================= */

function showPackResult(player) {

    const result = $("packResult");

    if (!result) {
        return;
    }

    if ($("resultRating")) {
        $("resultRating").textContent = player.rating;
    }

    if ($("resultPosition")) {
        $("resultPosition").textContent = player.position;
    }

    if ($("resultAvatar")) {
        $("resultAvatar").textContent = player.avatar;
    }

    if ($("resultName")) {
        $("resultName").textContent = player.name;
    }

    if ($("resultCountry")) {
        $("resultCountry").textContent =
            `${player.country} • ${player.club}`;
    }

    result.classList.remove("hidden");
    result.classList.add("show");
}

window.showPackResult = showPackResult;


function closePack() {

    const result = $("packResult");

    if (!result) {
        return;
    }

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


function calculateSquadRating() {

    if (!save.squad.length) {
        return 0;
    }

    const ratings = save.squad
        .map(id => getPlayer(id))
        .filter(Boolean)
        .map(player => player.rating);

    if (!ratings.length) {
        return 0;
    }

    return Math.round(
        ratings.reduce(
            (sum, rating) => sum + rating,
            0
        ) / ratings.length
    );
}


function renderSquad() {

    const squad = $("squad");

    if (!squad) {
        return;
    }

    squad.innerHTML = "";

    const rating = calculateSquadRating();

    if ($("squad-rating")) {
        $("squad-rating").textContent =
            rating || 0;
    }

    if (!save.collection.length) {

        squad.innerHTML = `
            <div class="empty">
                <strong>Your squad is empty.</strong>
                <p>Open packs in the Shop to get players.</p>
            </div>
        `;

        return;
    }

    const uniquePlayers = [
        ...new Set(save.collection)
    ];

    uniquePlayers.forEach(id => {

        const player = getPlayer(id);

        if (!player) {
            return;
        }

        const card =
            document.createElement("div");

        card.className = "player-card";

        const inSquad =
            save.squad.includes(player.id);

        card.innerHTML = `
            <div class="rating">${player.rating}</div>

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
                ${inSquad ? "REMOVE" : "ADD TO SQUAD"}
            </button>
        `;

        const button =
            card.querySelector(".squad-add");

        button.addEventListener(
            "click",
            () => addToSquad(player.id)
        );

        squad.appendChild(card);
    });
}


function addToSquad(id) {

    const player = getPlayer(id);

    if (!player) {
        return;
    }

    if (save.squad.includes(id)) {

        save.squad =
            save.squad.filter(
                playerId => playerId !== id
            );

        showNotification(
            `${player.name} removed`
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
            `${player.name} added`
        );
    }

    saveGame();
    renderSquad();
}

window.addToSquad = addToSquad;


/* =========================================================
   SHOP
   ========================================================= */

function renderShop() {

    /*
       We intentionally DO NOT delete the HTML shop cards.
       The HTML already contains the correct visual design.

       This function only ensures the buttons work.
    */

    const standardButtons =
        document.querySelectorAll(
            "#shop-page .standard-pack .pack-button"
        );

    standardButtons.forEach(button => {

        button.onclick = function(event) {

            event.preventDefault();

            openPack("standard");
        };
    });


    const premiumButtons =
        document.querySelectorAll(
            "#shop-page .premium-pack .pack-button"
        );

    premiumButtons.forEach(button => {

        button.onclick = function(event) {

            event.preventDefault();

            openPremiumPack();
        };
    });
}


/* =========================================================
   TEAMS
   ========================================================= */

function setupTeams() {

    const teamCards =
        document.querySelectorAll(
            ".team-card"
        );

    teamCards.forEach(card => {

        card.style.cursor = "pointer";

        card.addEventListener(
            "click",
            () => {

                const title =
                    card.querySelector("h2");

                if (!title) {
                    return;
                }

                save.selectedTeam =
                    title.textContent.trim();

                saveGame();

                showNotification(
                    `${save.selectedTeam} selected!`
                );

                teamCards.forEach(
                    other =>
                        other.classList.remove(
                            "selected"
                        )
                );

                card.classList.add("selected");
            }
        );
    });
}


/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {

    const graphics =
        $("graphics-setting");

    if (graphics) {

        graphics.addEventListener(
            "change",
            () => {

                localStorage.setItem(
                    "football_graphics",
                    graphics.value
                );

                showNotification(
                    `Graphics: ${graphics.value}`
                );
            }
        );

        const savedGraphics =
            localStorage.getItem(
                "football_graphics"
            );

        if (savedGraphics) {
            graphics.value = savedGraphics;
        }
    }
}


/* =========================================================
   THREE.JS MATCH
   ========================================================= */

let scene = null;
let camera = null;
let renderer = null;

let player = null;
let ball = null;

let teammates = [];
let opponents = [];

let gameStarted = false;

let homeScore = 0;
let awayScore = 0;

let matchTime = 120;
let stamina = 100;

let shooting = false;
let passing = false;

const keys = {};

const mobileInput = {
    x: 0,
    y: 0,
    sprint: false
};

let previousTime = performance.now();


/* =========================================================
   MATCH INITIALIZATION
   ========================================================= */

function initializeMatch() {

    if (typeof THREE === "undefined") {

        console.error(
            "Three.js is not loaded."
        );

        showNotification(
            "Three.js failed to load!",
            "error"
        );

        return false;
    }

    const container =
        $("game-container");

    if (!container) {

        console.error(
            "game-container not found."
        );

        return false;
    }

    if (renderer) {
        return true;
    }


    /* SCENE */

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x78b7e8);


    /* CAMERA */

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


    /* RENDERER */

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

    renderer.shadowMap.enabled = true;

    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );


    /* LIGHTING */

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


    /* STRIPES */

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
                            (z +
                                fieldLength / 2) /
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
        0, -17, 22, 0.12
    );

    createMatchLine(
        0, 17, 22, 0.12
    );

    createMatchLine(
        -11, 0, 0.12, 34
    );

    createMatchLine(
        11, 0, 0.12, 34
    );

    createMatchLine(
        0, 0, 22, 0.08
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

    createGoal(-17);
    createGoal(17);


    /* PLAYER */

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


    /* TEAMMATES */

    const teammatePositions = [
        [-5, 0, 3],
        [5, 0, 1],
        [-3, 0, -4],
        [4, 0, -7]
    ];

    teammates = [];

    teammatePositions.forEach(
        position => {

            const teammate =
                createPlayer3D(
                    0x1769aa,
                    "Teammate"
                );

            teammate.position.set(
                position[0],
                position[1],
                position[2]
            );

            teammates.push(teammate);
        }
    );


    /* OPPONENTS */

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

            const opponent =
                createPlayer3D(
                    0xd62828,
                    "Opponent"
                );

            opponent.position.set(
                position[0],
                position[1],
                position[2]
            );

            opponents.push(opponent);
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

    previousTime =
        performance.now();

    gameLoop();

    return true;
}


/* =========================================================
   FIELD LINE
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

    crossbar.position.y = 2.5;

    group.add(
        left,
        right,
        crossbar
    );

    group.position.z = z;

    scene.add(group);
}


/* =========================================================
   PLAYER MODEL
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
                color: color
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

    head.position.y = 1.85;
    head.castShadow = true;

    group.add(head);

    group.userData.name = name;

    scene.add(group);

    return group;
}


/* =========================================================
   START MATCH
   ========================================================= */

function startMatch() {

    if (!initializeMatch()) {
        return;
    }

    /*
       THIS WAS ONE OF THE BIG PROBLEMS
       IN THE OLD VERSION.

       The match existed, but the match-screen
       wasn't actually being activated.
    */

    const matchScreen =
        $("match-screen");

    if (matchScreen) {
        matchScreen.classList.add("active");
    }


    document
        .querySelectorAll(".page-screen")
        .forEach(page => {
            page.classList.remove("active");
        });


    const home =
        $("home-screen");

    if (home) {
        home.classList.remove("active");
    }


    const navigation =
        $("navigation");

    if (navigation) {
        navigation.classList.remove("visible");
    }


    gameStarted = true;

    homeScore = 0;
    awayScore = 0;

    matchTime = 120;
    stamina = 100;

    shooting = false;
    passing = false;

    player.position.set(
        0,
        0,
        7
    );

    resetBall();

    updateScore();
    updateMatchTimer();
    updateStamina();

    showNotification(
        "MATCH STARTED"
    );
}

window.startGame = startMatch;


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(delta) {

    if (!gameStarted || !player) {
        return;
    }

    let x = 0;
    let z = 0;

    const controls =
        save.settings.controls;


    if (
        keys[controls.left] ||
        keys["arrowleft"]
    ) {
        x -= 1;
    }

    if (
        keys[controls.right] ||
        keys["arrowright"]
    ) {
        x += 1;
    }

    if (
        keys[controls.up] ||
        keys["arrowup"]
    ) {
        z -= 1;
    }

    if (
        keys[controls.down] ||
        keys["arrowdown"]
    ) {
        z += 1;
    }


    x += mobileInput.x;
    z += mobileInput.y;


    const length =
        Math.hypot(x, z);

    if (length <= 0) {

        stamina += delta * 10;

        stamina =
            Math.min(
                100,
                stamina
            );

        return;
    }


    x /= length;
    z /= length;


    const sprint =
        keys[controls.sprint] ||
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

    if (!gameStarted || shooting) {
        return;
    }

    if (
        player.position.distanceTo(
            ball.position
        ) > 2
    ) {
        return;
    }

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

    /*
       Make the shot travel forward.
    */

    const target =
        start.clone().add(
            direction.multiplyScalar(18)
        );

    animateBall(
        start,
        target,
        0.55,
        "shoot"
    );
}

window.shoot = shoot;


/* =========================================================
   PASS
   ========================================================= */

function pass() {

    if (!gameStarted || passing) {
        return;
    }

    if (
        player.position.distanceTo(
            ball.position
        ) > 2
    ) {
        return;
    }

    if (!teammates.length) {
        return;
    }

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

                closestDistance = distance;
                closest = teammate;
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
        0.45,
        "pass"
    );
}

window.pass = pass;


/* =========================================================
   DRIBBLE
   ========================================================= */

function dribble() {

    if (!gameStarted) {
        return;
    }

    if (
        player.position.distanceTo(
            ball.position
        ) > 2
    ) {
        return;
    }

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

window.dribble = dribble;


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

        if (!ball) {
            return;
        }

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

            ball.position.y = 0.35;

            if (type === "shoot") {

                shooting = false;

                checkGoal();

            } else {

                passing = false;
            }
        }
    }

    animate();
}


/* =========================================================
   GOALS
   ========================================================= */

function checkGoal() {

    if (!ball) {
        return;
    }


    if (
        ball.position.z < -17.5
    ) {

        homeScore++;

        updateScore();

        showGoal(
            "CRISTIANO RONALDO"
        );

        resetBall();

    } else if (
        ball.position.z > 17.5
    ) {

        awayScore++;

        updateScore();

        resetBall();
    }
}


function resetBall() {

    if (!ball) {
        return;
    }

    if (player) {

        ball.position.set(
            player.position.x,
            0.35,
            player.position.z - 1
        );

    } else {

        ball.position.set(
            0,
            0.35,
            5.5
        );
    }

    shooting = false;
    passing = false;
}


/* =========================================================
   SCORE
   ========================================================= */

function updateScore() {

    if ($("home-score")) {
        $("home-score").textContent =
            homeScore;
    }

    if ($("away-score")) {
        $("away-score").textContent =
            awayScore;
    }
}


/* =========================================================
   GOAL MESSAGE
   ========================================================= */

function showGoal(scorer) {

    updateScore();

    const message =
        $("goal-message");

    if (!message) {
        return;
    }

    if ($("goal-scorer")) {
        $("goal-scorer").textContent =
            scorer;
    }

    message.classList.add("show");

    setTimeout(
        () => {
            message.classList.remove("show");
        },
        1800
    );
}


/* =========================================================
   TIMER
   ========================================================= */

function updateMatchTimer() {

    const timer = $("timer");

    if (!timer) {
        return;
    }

    const minutes =
        Math.floor(matchTime / 60);

    const seconds =
        Math.floor(matchTime % 60);

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function updateTimer(delta) {

    if (!gameStarted) {
        return;
    }

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

                leaveMatch();

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

    const fill =
        $("stamina-fill");

    if (!fill) {
        return;
    }

    fill.style.width =
        `${stamina}%`;
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

            shoot();
        }


        const controls =
            save.settings.controls;


        if (
            key === controls.pass
        ) {
            pass();
        }


        if (
            key === controls.dribble
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

function setupMatchControls() {

    const joystick =
        $("joystick");

    const stick =
        $("joystick-stick");


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
                    dx / distance * max;

                dy =
                    dy / distance * max;
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

                if (!active) {
                    return;
                }

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

                stick.style.left = "50%";
                stick.style.top = "50%";
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


    const sprint =
        $("sprint-button");

    if (sprint) {

        sprint.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                mobileInput.sprint = true;
            },
            { passive: false }
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


function setupTouchButton(
    id,
    callback
) {

    const button = $(id);

    if (!button) {
        return;
    }


    button.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            callback();
        },
        { passive: false }
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

    shooting = false;
    passing = false;

    mobileInput.x = 0;
    mobileInput.y = 0;
    mobileInput.sprint = false;


    const match =
        $("match-screen");

    if (match) {
        match.classList.remove("active");
    }


    /*
       Return to the actual match menu,
       NOT directly into a match.
    */

    openPage("match-menu");
}

window.leaveMatch = leaveMatch;


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

    if (!player || !camera) {
        return;
    }


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

function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );


    if (!renderer) {
        return;
    }


    const now =
        performance.now();


    const delta =
        Math.min(
            (now - previousTime) / 1000,
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
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (!camera || !renderer) {
            return;
        }

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
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Football Legends game.js loaded successfully."
        );


        loadSave();

        updateCoinsUI();

        renderSquad();

        renderShop();

        setupTeams();

        setupSettings();


        /*
           Fix the existing pack button if it exists.
        */

        const packButton =
            $("packButton");

        if (packButton) {

            packButton.onclick =
                () => openPack("standard");
        }


        /*
           The HTML already has onclick="startGame()",
           but this makes sure the button works too.
        */

        const startButton =
            $("start-button");

        if (startButton) {

            startButton.onclick =
                event => {

                    event.preventDefault();

                    startMatch();
                };
        }


        /*
           The HTML already has onclick="leaveMatch()".
        */

        const leaveButton =
            $("leave-match");

        if (leaveButton) {

            leaveButton.onclick =
                event => {

                    event.preventDefault();

                    leaveMatch();
                };
        }


        /*
           Make sure premium pack works even
           if the inline HTML function isn't found.
        */

        document
            .querySelectorAll(
                ".premium-pack .pack-button"
            )
            .forEach(button => {

                button.onclick =
                    event => {

                        event.preventDefault();

                        openPremiumPack();
                    };
            });


        /*
           Standard pack.
        */

        document
            .querySelectorAll(
                ".standard-pack .pack-button"
            )
            .forEach(button => {

                button.onclick =
                    event => {

                        event.preventDefault();

                        openPack("standard");
                    };
            });


        console.log(
            "Football Legends initialized."
        );

    }
);
