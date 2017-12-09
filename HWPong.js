    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1264;
    canvas.height = 680;

    let box = {
        left : {
        x     : canvas.width-10,
        y     : 280,
        w     : 10,
        h     : 100,
        ydir  : 0
        },
        right : {
        x     : 0,
        y     : 280,
        w     : 10,
        h     : 100,
        ydir  : 0
        },
        speed : 7
    };

    circle = {
      draw : circle = (X, Y, R) => {
             ctx.beginPath();
             ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
             ctx.fill();
             ctx.strokeStyle = 'black';
             ctx.stroke();
             },
      x : canvas.width/2,
      y : canvas.height/2,
      r : 7,
      xDelta : [-1, 1][Math.round(Math.random())],
      yDelta : [-1, 1][Math.round(Math.random())],
      speed  : 8,
      upLeftX : circle.x - circle.r,
      upLeftY : circle.y - circle.r
    }

    const RectCircleColliding1 = (circle, box) => {
    // the vertical & horizontal (distX/distY) distances between the circle’s center and the rectangle’s center
    // 1st box
    var distX = Math.abs(circle.x - box.left.x-box.left.w/2);
    var distY = Math.abs(circle.y - box.left.y-box.left.h/2);

    if (distX > (box.left.w/2 + circle.r)) { return false; }
    if (distY > (box.left.h/2 + circle.r)) { return false; }

    if (distX <= (box.left.w/2)) { return true; } 
    if (distY <= (box.left.h/2)) { return true; }

    var dx=distX-box.left.w/2;
    var dy=distY-box.left.h/2;

    return (dx**2+dy**2<=(circle.r**2));

};

const RectCircleColliding2 = (circle, box) => {
if((circle.x - circle.r <= box.left.x + box.left.w)
 && (circle.y + circle.r >= box.left.y)
 && (circle.y - circle.r <= box.left.y)) {return true;}

else if((circle.x + circle.r >= box.right.x) 
  && (circle.y + circle.r >= box.right.y) 
  && (circle.y - circle.r <= box.right.y)) {return true;}
else return false;
};

    const background = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const boxMethods = {
        draw   : box => {
            ctx.fillRect(box.left.x, box.left.y, box.left.w, box.left.h);
        },
        draw2   : box => {
            ctx.fillRect(box.right.x, box.right.y, box.right.w, box.right.h);
        },
        update : box => {
          box.right.y += box.right.ydir * box.speed;
          box.left.y += box.left.ydir * box.speed;
          circle.x += circle.xDelta * circle.speed;
          circle.y += circle.yDelta * circle.speed;
        },
    };

    const draw = () => {
        // Design
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
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
        else if (box.left.y+box.left.h > canvas.height)
          box.left.ydir = 0;
        if (box.right.y < 0)
          box.right.ydir = 0;
        else if (box.right.y+box.right.h > canvas.height)
          box.right.ydir = 0;
        if(RectCircleColliding2(circle, box)){
            circle.xDelta *= -1;
            //circle.yDelta *= -1;
        }else if(RectCircleColliding2(circle, box)){
            circle.xDelta *= -1;
        }if(circle.y-circle.r <= 0 || circle.y+circle.r >= canvas.height)
            circle.yDelta *= -1;

        //console.log(RectCircleColliding2(circle, box));
    };

    const loop = () => {
        draw();
        update();
        requestAnimationFrame(loop);
    };
    loop();
 
    const wUpKey = 87,
        sDownKey = 83,
        upKey = 38,
        downKey = 40;

    document.addEventListener('keydown', e => {
        e.preventDefault();
        const keyCode = e.keyCode;
        if(keyCode === wUpKey && box.left.y > 0)
            box.left.ydir = -1;
        else if(keyCode === sDownKey && (box.left.y+box.left.h) < canvas.height)
            box.left.ydir = 1;
        if(keyCode === upKey && box.right.y > 0)
            box.right.ydir = -1;
        else if(keyCode === downKey && (box.right.y+box.right.h) < canvas.height)
            box.right.ydir = 1;
    });
          document.addEventListener('keyup', e => {
        e.preventDefault();
        const keyCode = e.keyCode;
        if(keyCode === sDownKey || keyCode === wUpKey) {
            box.left.ydir = 0;
        } if(keyCode === upKey || keyCode === downKey) {
            box.right.ydir = 0;
        }
        }); 