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
canvas.backgroundColor = 'white';
var ctx = canvas.getContext('2d');
ctx.font = '18px "xkcd"';

canvas.addEventListener("mousemove", function (e) {
            state.mouseevent('move', e)
        }, false);
canvas.addEventListener("mousedown", function (e) {
            state.mouseevent('down', e)
        }, false);
canvas.addEventListener("mouseup", function (e) {
            state.mouseevent('up', e)
        }, false);
canvas.addEventListener("mouseout", function (e) {
            state.mouseevent('out', e)
        }, false);

var state = {};
var wait_click = true;
function do_nothing(a, b) {
    if (a === 'down') {
        wait_click = false;
    }
}
function click_start(a, b) {
    if (a === 'down') {
        game_prop_dx = 164;
        intro = false;
        setStage();
        state.mouseevent = do_nothing;
    }
}
state.mouseevent = do_nothing;

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
var skip = 0;
up.press = function() {
    if(!triggerObjects()) {
        skip = 1;
    }
}
up.release = function() {
    skip = 0;
}
abutton.press = function() {
    say([["I've proven that I am",  "living in a simulation."], ["Now what?"]]);
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

var spriteSkip = new Image();
spriteSkip.src = 'anim1x.png';

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

var z0 = new Image();
z0.src = 'prop_sink.png';
var z1 = new Image();
z1.src = 'prop_phone0.png';
var z2 = new Image();
z2.src = 'prop_chair0.png';
var z3 = new Image();
z3.src = 'door_side.png';

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
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (wait_click) { then = timestamp(); requestAnimationFrame(loop); return; }

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

        if (frame % 6 == 0) {
            if (intro_n == a.length) {
                ++intro_speech_n;
                if (intro_speech_n == 3) {
                    state.mouseevent = click_start;
                    intro_speech_n = 2;
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
        if (skip) {
            drawSprite = spriteSkip;
            m = (frame%12);
            srcX = (m)*1300/14+22;
        }

        var x0 = x - ground.width * 1.5 - game_char_x;// - (frameTick%40)/40 * ground.width;
        var y0 = y + sprite.height - 7;
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0, y0, ground.width, ground.height);
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0 + ground.width, y0, ground.width, ground.height);
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0 + 2*ground.width, y0, ground.width, ground.height);
        ctx.drawImage(ground, 0, 0, ground.width, ground.height, x0 + 3*ground.width, y0, ground.width, ground.height);

        drawStage();

        updateSayer();
        drawSayer();

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
    item.x = 500;
    item.y = 90;
    item.z = 10;
    item.trigger = function() { say([["It's a knock off reproduction", "of dogs playing Euchre"], ["There's another painting in the", "background of dogs playing Mao"]]) };
    stage_items.push(item);

    item = {};
    item.sprite = door1;
    item.x = -280;
    item.y = 0;
    item.z = 10;
    item.trigger = function() { goKitchen() };
    stage_items.push(item);

    //
}

function goKitchen() {
    stage_items = [];

    var item = {};
    item.sprite = z0;
    item.x = -100;
    item.y = 0;
    item.z = 3;
    stage_items.push(item);

    item = {};
    item.sprite = z1;
    item.x = 50;
    item.y = 0;
    item.z = 4;
    item.trigger = function() { say([["The xkcd phone 5S.", "Heaps of storage space."], ["I'm glad they reduced", "the size of the bevel"]]) };
    stage_items.push(item);

    item = {};
    item.sprite = z2;
    item.x = 500;
    item.y = 0;
    item.z = 6;
    stage_items.push(item);

    item = {};
    item.sprite = z3;
    item.x = -330;
    item.y = -5;
    item.z = 0;
    item.trigger = function() { set() };
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


// Talking --------------------------------------------------------------
var phrases = [];
var currentPhrase = [[], []];
var currentLine = 0;
var currentChar = 0;
var currentPause = 0;
var currentPhraseSet = 0;
function say(phrase) {
    phrases.push(phrase);
    //currentPhraseSet = 0;
    currentPause = 0;
    currentPhrase = phrases[0];
    currentPhraseSet = 0;
    currentLine = 0;
    currentChar = 0;
}

function updateSayer() {

    if (currentPause) {
        currentPause--;
        if (currentPause <= 0) {
            currentPhrase = [[],[]];
            currentPhraseSet = 0;
            currentLine = 0;
            currentChar = 0;
        }
    }

    if (frameTick%2 == 1) {
        ++currentChar;
        if (currentPhrase[currentPhraseSet].length &&
            currentChar === currentPhrase[currentPhraseSet][currentLine].length) {
            if (currentLine < currentPhrase[currentPhraseSet].length-1) {
                currentChar = 0;
                ++currentLine;
            } else if (currentPhraseSet == 0) {
                ++currentPhraseSet;
                currentLine = 0;
                currentChar = 0;
            } else if (currentPhraseSet == 1) {
                currentPause = 100;
            }
        }
    }
}

function drawSayer() {
    if (currentPhrase[currentPhraseSet].length == 0) return;

    for (var j = 0; j <= currentPhraseSet; ++j) {
        for (var i = 0; i < currentPhrase[j].length; ++i) {
            var text;
            if (j == currentPhraseSet && i > currentLine) {
                continue;
            }
            if (j == currentPhraseSet && i == currentLine) {
                text = currentPhrase[j][i].substring(0, currentChar);
            } else {
                 text = currentPhrase[j][i];
            }
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            var x0 = 0.5 * canvas.width + 72;
            var w = 250;
            ctx.fillText(text, x0, 195 + (i+(j-currentPhraseSet)*3.5) * 20, w);
        }
    }

    ctx.beginPath();
    ctx.arc(370, 205, 95, 0.05*Math.PI, 0.25*Math.PI);
    ctx.stroke();
}


function triggerObjects() {
    for (var i = 0; i < stage_items.length; ++i) {
        var item = stage_items[i];

        var prop = item.sprite;

        if (Math.abs(item.x - game_char_x) <= prop.width) {
            if (item.trigger) {
                item.trigger();
                return true;
            }
        }
    }
    return false;
}
