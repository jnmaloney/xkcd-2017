function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
                            "keydown", key.downHandler.bind(key), false
                            );
    window.addEventListener(
                            "keyup", key.upHandler.bind(key), false
                            );
    return key;
}
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.font = '18px "xkcd"';

var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    abutton = keyboard(0x5A),
    bbutton = keyboard(0x58),
        cbutton = keyboard(0x43),
        dbutton = keyboard(0x56),
        ebutton = keyboard(0x42),
        fbutton = keyboard(0x4E),
    gbutton = keyboard(0x4D);
left.press = function() {
    game_char_dx = -200;
};

left.release = function() {
    game_char_dx = 0;
};

right.press = function() {
    game_char_dx = 200;
}

right.release = function() {
    game_char_dx = 0;
}

var intro1 = new Image();
intro1.src = 'intro1.png';
var intro2 = new Image();
intro2.src = 'intro2.png';
var intro3 = new Image();
intro3.src = 'intro3.png';

var sprite = new Image();
sprite.src = 'run.png';

var sprite_stand = new Image();
sprite_stand.src = 'stand0x.png';

var ground = new Image();
ground.src = 'ground0.png';

var prop1 = new Image();
prop1.src = 'chair.png';

var prop2 = new Image();
prop2.src = 'pc.png';

var prop3 = new Image();
prop3.src = 'painting.png';

var door1 = new Image();
door1.src = 'door1.png';

var intro = true;
var intro_n = 0;
var intro_speech_n = 0;
var introFrame = intro1;
var intro_dx = 0;
var intro_x = 0;

var game_prop_x = 0;
var game_prop_dx = 0;
var game_char_x = 0;
var game_char_dx = 0;
var left = true;


var now,
    delta = 0.0,
    then = timestamp();
var frame = 0;
var frameTick = 0;
var interval = 1000.0 / 60.0;
function loop() {
    now = timestamp();
    delta += Math.min(1000, (now - then));
    while(delta > interval) {
        delta -= interval;
        //state.update(interval / 1000);
        if ((++frameTick)%4 == 0) ++frame;
    }
    // Draw
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //state.draw();
    //var m = (frame%10);
    //var srcX = (m%9)*400,
    //    srcY = (m==9)?240:0;
    //var width = 360, height = 240;
    //var x = 0, y = 0;
    //ctx.drawImage(sprite, srcX, srcY, width, height, x, y, width, height);

    if (intro) {

        var a = ['never have I felt so close to another soul',
                 'and yet so helplessly alone',
                 'as when I search for an error',
                 'and there\'s one result',
                 'a thread by someone with the same problem',
                 'and no answer',
                 'last posted to in 2003'];
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        for (var i = 0; i < intro_n; ++i) {
            var x0 = 0.5 * canvas.width - 8;
            var w = x0 - 36;
            ctx.fillText(a[i], x0, 50 + i * 42, w);
        }

        ctx.strokeRect(0.5*canvas.width + 8, 4,
                       0.5*canvas.width - 16, 333);

        ctx.drawImage(introFrame, 0, 0,
                                  introFrame.width, introFrame.height,
                                  0.5*canvas.width + 58, 120,
                                  introFrame.width, introFrame.height);

        ctx.drawImage(prop1, 0, 0,
                          introFrame.width, introFrame.height,
                          0.5*canvas.width + 228 + intro_x, 205,
                          introFrame.width, introFrame.height);
        intro_x += intro_dx * (interval / 1000);
        intro_dx *= (1 - 0.08);


        var b = ['who were you you',
                 'denvercoder9?',
                 '',
                 'what did you see?',
                 '',
                 ''];
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        for (var i = 0; i < intro_speech_n * 3; ++i) {
            var x0 = 0.5 * canvas.width + 138;
            var w = x0 - 36;
            ctx.fillText(b[i], x0, 175 + (i - intro_speech_n * 3) * 20, w);
        }

        if (frame == 4) {
            frame = 0;
            if (intro_n == a.length) {
                ++intro_speech_n;
                if (intro_speech_n == 3) {
                    game_prop_dx = 164;
                    intro = false;
                    setStage();
                }
            } else {
                intro_n++;
                if (intro_n == 5) { introFrame = intro2; intro_dx = 64; }
                else if (intro_n == 7) { introFrame = intro3; }
            }
        }
    } else {

        var m = 3;//(frame%14);
        var srcX = (m)*1300/14,
            srcY = 0;
        var width = 92,
            height = 144;
        var x = (canvas.width - width) * 0.5,
            y = canvas.height * 0.5;

        var drawSprite = sprite_stand;
        if (game_char_dx != 0) {
            drawSprite = sprite;
            m = (frame%14);
            srcX = (m)*1300/14
        }

        var x0 = x - ground.width * 1.5 - game_char_x;// - (frameTick%40)/40 * ground.width;
        var y0 = y + sprite.height - 7;
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0, y0, ground.width, ground.height);
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0 + ground.width, y0, ground.width, ground.height);
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0 + 2*ground.width, y0, ground.width, ground.height);
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0 + 3*ground.width, y0, ground.width, ground.height);

        drawStage();

        if (game_char_dx < 0) {
            left = true;
        } else if (game_char_dx > 0) {
            left = false;
        }
        if (left) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(drawSprite, srcX, srcY, width, height, -(x)-90, y, width, height);
            ctx.restore();
        } else {
            ctx.drawImage(drawSprite, srcX, srcY, width, height, x, y, width, height);
            //ctx.fillStyle = "white";
            //ctx.fillRect(x + game_char_x+82, y+72, 10, 72);
        }

        game_prop_x += game_prop_dx * (interval / 1000);
        game_prop_dx *= (1 - 0.08);

        game_char_x += game_char_dx * (interval / 1000);

    }

    then = now;
    requestAnimationFrame(loop);
}
loop();

var stage_items = [];
function setStage() {
    // left
    // right
    // character
    // items
    var item = {};
    item.sprite = prop2;
    item.x = 0;
    item.y = 0;
    item.z = 4;
    stage_items.push(item);

    item = {};
    item.sprite = prop1;
    item.x = 0;
    item.y = 0;
    item.z = 2;
    item.dx = game_prop_dx;
    stage_items.push(item);

    item = {};
    item.sprite = prop3;
    item.x = 200;
    item.y = 90;
    item.z = 10;
    stage_items.push(item);

    item = {};
    item.sprite = door1;
    item.x = -200;
    item.y = 0;
    item.z = 10;
    stage_items.push(item);
}

var floor = 380;
function drawStage() {
    for (var i = 0; i < stage_items.length; ++i) {
        var item = stage_items[i];

        var prop = item.sprite;
        var x0 = item.x + 0.5*canvas.width - 0.5*prop.width - game_char_x / (0.01*item.z + 1); //* Math.exp(-item.z);
        var y0 = floor - item.y - 4*item.z - prop.height;
        ctx.drawImage(prop, 0, 0, prop.width, prop.height, x0, y0, prop.width, prop.height);


        if (item.dx) {
            item.x += item.dx * (interval / 1000);
            item.dx *= (1 - 0.08);
        }
    }

}
