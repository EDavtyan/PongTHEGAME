const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1264;
canvas.height = 680;

const score = {
    sideL: 0
    , sideR: 0
}

const box = {
    left: {
        x: 0
        , y: canvas.height / 2 - 50
        , w: 10
        , h: 100
        , ydir: 0
    }
    , right: {
        x: canvas.width - 10
        , y: canvas.height / 2 - 50
        , w: 10
        , h: 100
        , ydir: 0
    }
    , speed: 0
};

const circle = {
    draw: (X, Y, R) => {
        ctx.beginPath();
        ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
    , x: canvas.width / 2
    , y: canvas.height / 2
    , r: 7
    , xDelta: [-1, 1][Math.round(Math.random())]
    , yDelta: [-1, 1][Math.round(Math.random())]
    , speed: 0
}

const sounds = {
    wall: new Audio('soundEffects/wall.wav')
    , bars: new Audio('soundEffects/bars.wav')
    , out: new Audio('soundEffects/out.wav')
    , emerge: new Audio('soundEffects/emerge.wav')
}

const scoreTxt = (x, y) => {
    ctx.fillStyle = "#2C2C2E";
    ctx.font = "200px Helvetica";
    ctx.fillText(x + "", canvas.width / 4 - 50, canvas.height / 2 + 50);
    ctx.fillText(y + "", canvas.width * 3 / 4 - 50, canvas.height / 2 + 50);
};

const RectCircleColliding = () => {
    if ((circle.y + circle.r >= box.left.y && circle.y - circle.r <= box.left.y + box.left.h) &&
        (circle.x <= box.left.x + box.left.w && circle.x + circle.r >= box.left.x)) {
        return true;
    } else if ((circle.y + circle.r >= box.right.y && circle.y - circle.r <= box.right.y + box.right.h) &&
        (circle.x + circle.r <= box.right.x + box.right.w && circle.x >= box.right.x)) {
        return true;
    }
};

const out = () => {
    if (circle.x + circle.r < 0) {
        sounds.out.play();
        score.sideR++;
        circle.x = canvas.width / 2;
        circle.y = canvas.height / 2;
        box.speed = 0;
        box.left.y = 280;
        box.right.y = 280;
        circle.speed = 0;
        circle.xDelta = 1;
        circle.yDelta = [-1, 1][Math.round(Math.random())];

    } else if (circle.x - circle.r > canvas.width) {
        sounds.out.play();
        score.sideL++;
        circle.x = canvas.width / 2;
        circle.y = canvas.height / 2;
        box.speed = 0;
        box.left.y = 280;
        box.right.y = 280;
        circle.speed = 0;
        circle.xDelta = -1;
        circle.yDelta = [-1, 1][Math.round(Math.random())];
    }
};

const background = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const boxMethods = {
    draw: box => {
        ctx.fillRect(box.left.x, box.left.y, box.left.w, box.left.h);
    }
    , draw2: box => {
        ctx.fillRect(box.right.x, box.right.y, box.right.w, box.right.h);
    }
    , update: box => {
        box.left.y += box.left.ydir * box.speed;
        circle.x += circle.xDelta * circle.speed;
        circle.y += circle.yDelta * circle.speed;
        if (document.getElementById('checkbox').checked) {
            box.right.y = circle.y - box.right.h / 2;
        } else {
            box.right.y += box.right.ydir * box.speed;
        }
    }
};

const draw = () => {
    // Design
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    scoreTxt(score.sideL, score.sideR);
    ctx.fillStyle = 'green';
    ctx.fillRect(631, 0, 2, 680);
    // Gameplay Atributes
    circle.draw(circle.x, circle.y, circle.r);
    boxMethods.draw2(box);
    boxMethods.draw(box);
};

const update = () => {
    boxMethods.update(box);
    if (box.left.y < 0)
        box.left.ydir = 0;
    else if (box.left.y + box.left.h > canvas.height)
        box.left.ydir = 0;
    if (box.right.y < 0)
        box.right.ydir = 0;
    else if (box.right.y + box.right.h > canvas.height)
        box.right.ydir = 0;
    if (RectCircleColliding()) {
        sounds.bars.play();
        circle.xDelta *= -1;
    } else if (RectCircleColliding()) {
        sounds.bars.play();
        circle.xDelta *= -1;
    }
    if (circle.y - circle.r <= 0 || circle.y + circle.r >= canvas.height) {
        circle.yDelta *= -1;
        sounds.wall.play();
    }
    out();
};

const loop = () => {
    draw();
    update();
    requestAnimationFrame(loop);
};
loop();

const wUpKey = 87
    , sDownKey = 83
    , upKey = 38
    , downKey = 40
    , space = 32;

document.addEventListener('keydown', e => {
    e.preventDefault();
    const keyCode = e.keyCode;
    if (keyCode === wUpKey && box.left.y > 0)
        box.left.ydir = -1;
    else if (keyCode === sDownKey && (box.left.y + box.left.h) < canvas.height)
        box.left.ydir = 1;
    if (keyCode === upKey && box.right.y > 0)
        box.right.ydir = -1;
    else if (keyCode === downKey && (box.right.y + box.right.h) < canvas.height)
        box.right.ydir = 1;
    if (keyCode === space) {
        if (circle.speed !== 7)
            sounds.emerge.play();
        circle.speed = 7;
        box.speed = 7;
    }
});
document.addEventListener('keyup', e => {
    e.preventDefault();
    const keyCode = e.keyCode;
    if (keyCode === sDownKey || keyCode === wUpKey) {
        box.left.ydir = 0;
    }
    if (keyCode === upKey || keyCode === downKey) {
        box.right.ydir = 0;
    }
});