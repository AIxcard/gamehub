/* =========================================================
   GAMEHUB FOOTBALL
   Version 1.0
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x07120b);

/* CAMERA */

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 15, 18);

/* RENDERER */

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document
    .getElementById("game-container")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(10, 25, 10);

sun.castShadow = true;

scene.add(sun);


/* =========================================================
   FIELD
   ========================================================= */

const fieldWidth = 22;
const fieldLength = 34;

const field = new THREE.Mesh(
    new THREE.BoxGeometry(
        fieldWidth,
        0.25,
        fieldLength
    ),
    new THREE.MeshStandardMaterial({
        color: 0x176b36
    })
);

field.position.y = -0.15;

field.receiveShadow = true;

scene.add(field);


/* FIELD LINES */

function createLine(
    x,
    z,
    width,
    depth
) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            0.03,
            depth
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    line.position.set(
        x,
        0.01,
        z
    );

    scene.add(line);
}


/* Outer lines */

createLine(
    0,
    -fieldLength / 2,
    fieldWidth,
    0.12
);

createLine(
    0,
    fieldLength / 2,
    fieldWidth,
    0.12
);

createLine(
    -fieldWidth / 2,
    0,
    0.12,
    fieldLength
);

createLine(
    fieldWidth / 2,
    0,
    0.12,
    fieldLength
);


/* Halfway line */

createLine(
    0,
    0,
    fieldWidth,
    0.08
);


/* Centre circle */

const circle = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
        Array.from(
            { length: 65 },
            (_, i) => {

                const angle =
                    (i / 64) * Math.PI * 2;

                return new THREE.Vector3(
                    Math.cos(angle) * 3,
                    0.03,
                    Math.sin(angle) * 3
                );
            }
        )
    ),
    new THREE.LineBasicMaterial({
        color: 0xffffff
    })
);

scene.add(circle);


/* =========================================================
   GOALS
   ========================================================= */

function createGoal(z) {

    const goalGroup = new THREE.Group();

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

    const post1 = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.15,
            2.4,
            0.15
        ),
        material
    );

    const post2 = post1.clone();

    const crossbar = new THREE.Mesh(
        new THREE.BoxGeometry(
            5,
            0.15,
            0.15
        ),
        material
    );

    post1.position.x = -2.5;
    post1.position.y = 1.2;

    post2.position.x = 2.5;
    post2.position.y = 1.2;

    crossbar.position.y = 2.4;

    goalGroup.add(
        post1,
        post2,
        crossbar
    );

    goalGroup.position.z = z;

    scene.add(goalGroup);
}

createGoal(-fieldLength / 2);
createGoal(fieldLength / 2);


/* =========================================================
   PLAYER
   ========================================================= */

function createPlayer(
    color,
    name
) {

    const group = new THREE.Group();

    /* Body */

    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.45,
            0.8,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color
        })
    );

    body.position.y = 1;

    body.castShadow = true;

    group.add(body);


    /* Head */

    const head = new THREE.Mesh(
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


/* MAIN PLAYER */

const player = createPlayer(
    0xffffff,
    "Cristiano Ronaldo"
);

player.position.set(
    0,
    0,
    7
);


/* TEAMMATES */

const teammate1 = createPlayer(
    0xffffff,
    "Teammate"
);

teammate1.position.set(
    -5,
    0,
    4
);

const teammate2 = createPlayer(
    0xffffff,
    "Teammate"
);

teammate2.position.set(
    5,
    0,
    -2
);


/* OPPONENTS */

const opponent1 = createPlayer(
    0xd62828,
    "Opponent"
);

opponent1.position.set(
    4,
    0,
    -5
);

const opponent2 = createPlayer(
    0xd62828,
    "Opponent"
);

opponent2.position.set(
    -4,
    0,
    -8
);

const opponent3 = createPlayer(
    0xd62828,
    "Opponent"
);

opponent3.position.set(
    2,
    0,
    -12
);


/* =========================================================
   BALL
   ========================================================= */

const ball = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.3,
        20,
        20
    ),
    new THREE.MeshStandardMaterial({
        color: 0xffffff
    })
);

ball.position.set(
    0,
    0.35,
    5.5
);

ball.castShadow = true;

scene.add(ball);


/* =========================================================
   GAME VARIABLES
   ========================================================= */

let gameStarted = false;

let homeScore = 0;
let awayScore = 0;

let matchTime = 120;

let stamina = 100;

let shooting = false;

const keys = {};

const mobileInput = {
    x: 0,
    y: 0,
    sprint: false
};


/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
    "keydown",
    event => {

        keys[event.key.toLowerCase()] = true;

        if (
            event.code === "Space" &&
            gameStarted
        ) {

            shoot();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key.toLowerCase()] = false;
    }
);


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(delta) {

    if (!gameStarted) return;

    let x = 0;
    let z = 0;

    if (
        keys["w"] ||
        keys["arrowup"]
    ) z -= 1;

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) z += 1;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) x -= 1;

    if (
        keys["d"] ||
        keys["arrowright"]
    ) x += 1;


    x += mobileInput.x;
    z += mobileInput.y;


    const length =
        Math.sqrt(
            x * x +
            z * z
        );

    if (length > 0) {

        x /= length;
        z /= length;


        let speed = 6;

        const sprint =
            keys["shift"] ||
            mobileInput.sprint;


        if (
            sprint &&
            stamina > 0
        ) {

            speed = 9;

            stamina -=
                delta * 20;

        } else {

            stamina +=
                delta * 10;
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


        player.rotation.y =
            Math.atan2(
                x,
                z
            );

    }


    /* Keep player inside field */

    player.position.x =
        Math.max(
            -fieldWidth / 2 + 0.7,
            Math.min(
                fieldWidth / 2 - 0.7,
                player.position.x
            )
        );

    player.position.z =
        Math.max(
            -fieldLength / 2 + 0.7,
            Math.min(
                fieldLength / 2 - 0.7,
                player.position.z
            )
        );


    /* Ball follows player */

    const distance =
        player.position.distanceTo(
            ball.position
        );

    if (distance < 1.6) {

        ball.position.x =
            player.position.x;

        ball.position.z =
            player.position.z - 0.8;

    }
}


/* =========================================================
   SHOOTING
   ========================================================= */

function shoot() {

    if (!gameStarted) return;

    const distance =
        player.position.distanceTo(
            ball.position
        );

    if (distance > 2) return;

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

    let power = 14;

    const start =
        ball.position.clone();

    const target =
        start.clone().add(
            direction.multiplyScalar(power)
        );


    animateBall(
        start,
        target,
        0.45
    );
}


/* =========================================================
   BALL ANIMATION
   ========================================================= */

function animateBall(
    start,
    target,
    duration
) {

    const startTime =
        performance.now();


    function animate() {

        const elapsed =
            performance.now() -
            startTime;

        const progress =
            Math.min(
                elapsed /
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
            ) * 1.5;


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            ball.position.y = 0.35;

            checkGoal();

            shooting = false;
        }
    }

    animate();
}


/* =========================================================
   GOAL CHECK
   ========================================================= */

function checkGoal() {

    if (
        ball.position.z <
        -fieldLength / 2 - 0.5
    ) {

        homeScore++;

        showGoal(
            "Cristiano Ronaldo"
        );

        resetBall();

    } else if (
        ball.position.z >
        fieldLength / 2 + 0.5
    ) {

        awayScore++;

        updateScore();

        resetBall();
    }
}


/* =========================================================
   RESET BALL
   ========================================================= */

function resetBall() {

    ball.position.set(
        0,
        0.35,
        5.5
    );
}


/* =========================================================
   SCORE
   ========================================================= */

function updateScore() {

    document.getElementById(
        "home-score"
    ).textContent = homeScore;

    document.getElementById(
        "away-score"
    ).textContent = awayScore;
}


/* =========================================================
   GOAL MESSAGE
   ========================================================= */

function showGoal(
    scorer
) {

    updateScore();

    const message =
        document.getElementById(
            "goal-message"
        );

    document.getElementById(
        "goal-scorer"
    ).textContent =
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
   MATCH TIMER
   ========================================================= */

function updateTimer(delta) {

    if (!gameStarted) return;

    matchTime -= delta;

    if (matchTime <= 0) {

        matchTime = 0;

        gameStarted = false;

        setTimeout(
            () => {

                alert(
                    `FULL TIME!\n${homeScore} - ${awayScore}`
                );

            },
            200
        );
    }


    const minutes =
        Math.floor(
            matchTime / 60
        );

    const seconds =
        Math.floor(
            matchTime % 60
        );


    document.getElementById(
        "timer"
    ).textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* =========================================================
   STAMINA UI
   ========================================================= */

function updateStamina() {

    document.getElementById(
        "stamina-fill"
    ).style.width =
        `${stamina}%`;
}


/* =========================================================
   MOBILE JOYSTICK
   ========================================================= */

const joystick =
    document.getElementById(
        "joystick"
    );

const joystickStick =
    document.getElementById(
        "joystick-stick"
    );

let joystickActive = false;

function updateJoystick(
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
        28;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance > max) {

        dx =
            (dx / distance) *
            max;

        dy =
            (dy / distance) *
            max;
    }


    joystickStick.style.left =
        `${50 + (dx / rect.width) * 100}%`;

    joystickStick.style.top =
        `${50 + (dy / rect.height) * 100}%`;


    mobileInput.x =
        dx / max;

    mobileInput.y =
        dy / max;
}


joystick.addEventListener(
    "touchstart",
    event => {

        joystickActive = true;

        updateJoystick(
            event.touches[0]
        );
    },
    {
        passive: true
    }
);


joystick.addEventListener(
    "touchmove",
    event => {

        if (!joystickActive) return;

        updateJoystick(
            event.touches[0]
        );
    },
    {
        passive: true
    }
);


joystick.addEventListener(
    "touchend",
    () => {

        joystickActive = false;

        mobileInput.x = 0;
        mobileInput.y = 0;

        joystickStick.style.left = "50%";
        joystickStick.style.top = "50%";
    }
);


/* =========================================================
   MOBILE BUTTONS
   ========================================================= */

document
    .getElementById("shoot-button")
    .addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            shoot();
        },
        {
            passive: false
        }
    );


document
    .getElementById("sprint-button")
    .addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            mobileInput.sprint = true;
        },
        {
            passive: false
        }
    );


document
    .getElementById("sprint-button")
    .addEventListener(
        "touchend",
        () => {

            mobileInput.sprint = false;
        }
    );


/* PASS */

document
    .getElementById("pass-button")
    .addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            pass();
        },
        {
            passive: false
        }
    );


function pass() {

    const distance =
        player.position.distanceTo(
            ball.position
        );

    if (distance > 2) return;

    const target =
        teammate1.position.clone();

    target.y = 0.35;

    animateBall(
        ball.position.clone(),
        target,
        0.35
    );
}


/* =========================================================
   START GAME
   ========================================================= */

document
    .getElementById("start-button")
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    document.getElementById(
        "start-screen"
    ).style.display = "none";

    gameStarted = true;

    matchTime = 120;

    homeScore = 0;
    awayScore = 0;

    updateScore();

    resetBall();
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

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
   ANIMATION LOOP
   ========================================================= */

let previousTime =
    performance.now();


function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );


    const currentTime =
        performance.now();

    const delta =
        Math.min(
            (currentTime -
                previousTime) /
                1000,
            0.05
        );

    previousTime =
        currentTime;


    updatePlayer(delta);

    updateTimer(delta);

    updateStamina();

    updateCamera();


    /* Small ball rotation */

    ball.rotation.x +=
        delta * 5;

    ball.rotation.z +=
        delta * 3;


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


/* START */

gameLoop();
