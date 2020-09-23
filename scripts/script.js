(function () {
    var board = document.getElementById("board");
    var ctx = board.getContext('2d');
    var isDrawing = false;
    var isErasing = false;
    var isStickyMoving = false;
    var isImageMoving = true;
    var movingStickyDiv;
    var location;
    penSize = 2;
    var stickyCounter = 0;
    penColor = '#000000';
    var redoStack = [];
    var points = [];
    var undo = document.getElementById('undoButton');
    var redo = document.getElementById('redoButton');
    var flag = 0;

    init();
    function init() {
        // var rect = board.getBoundingClientRect();
        // board.height = rect.height;
        // board.width = rect.width;

        window.addEventListener('resize', onResize, false);
        onResize();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = penSize;
    }

    var onMouseDown = function () {
        location = getLocation();
        if (mode == 'pen') {
            isDrawing = true;
            ctx.lineWidth = penSize;
            ctx.strokeStyle = penColor;
            ctx.globalCompositeOperation = 'source-over';// to make it overlap with zero transparency
            points.push({
                x: location.x,
                y: location.y,
                size: penSize,
                color: penColor,
                mode: 'begin'
            });
        }
        if (mode == 'eraser') {
            isErasing = true;
            ctx.lineWidth = 30;
            ctx.globalCompositeOperation = 'destination-out';
        }
        if (mode == 'sticky') {
            location = getLocation();
            var stickydiv = document.createElement('div');
            stickydiv.id = 'sticky' + stickyCounter;
            stickydiv.className = 'sticky';

            var dragIcon = document.createElement('img');
            dragIcon.id = 'drag' + stickyCounter;
            dragIcon.style.height = '20px';
            dragIcon.style.width = '20px';
            dragIcon.onmousedown = dragMouseDown;
            dragIcon.onmouseup = function () {
                isStickyMoving = false;
                location = getLocation();
                stickydiv.style.position = 'absolute';
                stickydiv.style.left = location.x - 20 + 'px';
                stickydiv.style.top = location.y + 57 + 'px';
            }
            dragIcon.src = './icons/move_icon_dark.png';

            var crossIcon = document.createElement('img');
            crossIcon.id = 'cross' + stickyCounter;
            crossIcon.style.height = '20px';
            crossIcon.style.width = '20px';
            crossIcon.onclick = deleteSticky;
            crossIcon.src = './icons/cross_icon_dark.png';

            var sticky = document.createElement("textarea");
            sticky.className = 'textarea';
            stickydiv.appendChild(crossIcon);
            stickydiv.appendChild(dragIcon);
            stickydiv.appendChild(sticky);
            stickydiv.style.position = 'absolute';
            stickydiv.style.left = location.x - 20 + 'px';
            stickydiv.style.top = location.y + 57 + 'px';
            document.body.appendChild(stickydiv);
            stickydiv.style.zIndex = 1;
            stickyCounter++;

        }
        ctx.imageSmoothingQuality = 'high';
        ctx.moveTo(location.x, location.y);
    };

    var onMouseMove = function () {
        if (isErasing == false || mode != 'eraser') {
            if (isDrawing == false || mode != 'pen') {
                if (isStickyMoving == false || mode != 'sticky') {
                    return;
                }
            }
        }
        if (isErasing == true && mode == 'eraser') {
            ctx.beginPath();
            ctx.moveTo(location.x, location.y);
            location = getLocation();
            ctx.lineTo(location.x, location.y)
            ctx.closePath();
            ctx.stroke();
        }
        if (isDrawing == true && mode == 'pen') {
            ctx.beginPath();
            ctx.moveTo(location.x, location.y);
            location = getLocation();

            ctx.imageSmoothingQuality = 'high';
            ctx.lineTo(location.x, location.y);
            ctx.stroke();
            points.push({
                x: location.x,
                y: location.y,
                size: penSize,
                color: penColor,
                mode: 'draw'
            });
            ctx.closePath();
        }
        if (isStickyMoving == true && mode == 'sticky') {
            location = getLocation();
            movingStickyDiv.style.left = location.x + 'px';
            movingStickyDiv.style.top = location.y + 40 + 'px';
        }
    };

    var onMouseUp = function () {
        isDrawing = false;
        isErasing = false;
        isStickyMoving = false;
        points.push({
            x: location.x,
            y: location.y,
            size: penSize,
            color: penColor,
            mode: 'end'
        });
    };

    var getLocation = function () {
        var rect = board.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    board.addEventListener("mousedown", onMouseDown);
    board.addEventListener("mousemove", onMouseMove);
    board.addEventListener("mouseup", onMouseUp);
    document.addEventListener('keydown', onKeyDown);

    function onResize() {
        board.width = window.innerWidth - 5;
        board.height = window.innerHeight - 60;
        if(flag != 0)// So that redrawAll is not called when ziteBoard is loaded in the begining whem redrawAll is not even declared
        {
            redrawAll();
        }
        flag++;
    }

    function dragMouseDown(e) {
        isStickyMoving = true;
        var imgId = e.currentTarget.id;
        console.log(e);
        imgId = imgId.slice(4);
        movingStickyDiv = document.getElementById('sticky' + imgId);
    }

    function deleteSticky(e) {
        var imgId = e.currentTarget.id;
        imgId = imgId.slice(5);
        var stickyDiv = document.getElementById('sticky' + imgId);
        document.body.removeChild(stickyDiv);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            isStickyMoving = false;
        }
    }

    var undoLast = function () {
        if (points.size == 0){
            return;
        }
        redoStack.push(points.pop());
        redrawAll();
    }

    var redoLast = function () {
        if(redoStack.size == 0)
        {
            return;
        }
        points.push(redoStack.pop());
        redrawAll();
    }

    var redrawAll = function () {
        ctx.clearRect(0, 0, board.width, board.height);

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
        
            ctx.lineWidth = point.size;
            ctx.strokeStyle = point.color;
            
            if (point.mode == "begin") {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
            }
            ctx.lineTo(point.x, point.y);
            if (point.mode == "end" || (i == points.length - 1)) {
                ctx.stroke();
            }
        }
    }

    var interval;
    undo.addEventListener('mousedown', function () {
        interval = setInterval(undoLast, 50);
    })
    undo.addEventListener('mouseup', function () {
        clearInterval(interval);
    })
    redo.addEventListener('mousedown', function () {
        interval = setInterval(redoLast, 50);
    })
    redo.addEventListener('mouseup', function () {
        clearInterval(interval);
    })

    
var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value;

slider.oninput = function() {
    var temp = points;
    var val = slider.value;
    var newVal = (1 + val / 100.0);
    ctx.scale(newVal, newVal);
    redrawAll();
    ctx.scale(1.0 / newVal,1.0 / newVal);
    points = temp;
}

})();