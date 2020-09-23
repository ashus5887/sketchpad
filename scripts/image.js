var imageCounter = 0;
var isImageMoving = false;
var movingImageDiv;

function uploadImage() {
    var image = document.getElementsByClassName('imageInput')[0];
    if (image != null) {
        console.log(image.files);
    }
    var img = document.createElement('img');
    var imgDiv = document.createElement('div');
    img.src = window.URL.createObjectURL(image.files[0]);
    // img.id = "image" + imageCounter;
    imgDiv.id = 'image' + imageCounter;
    imgDiv.appendChild(img);
    console.log(imageCounter, " 1111111111111111111111")

    var crossIcon = document.createElement('img');
    crossIcon.src = './icons/cross_icon_dark.png'; 
    crossIcon.id = 'cross' + imageCounter;
    crossIcon.onclick = deleteImage;
    var board = document.getElementById('board');
    board.style.zIndex = -1;
    crossIcon.style.zIndex = 1;
    imgDiv.appendChild(crossIcon);


    var dragIcon = document.createElement('img');
    dragIcon.src = '/icons/move_icon_dark.png';
    dragIcon.id = 'drag' + imageCounter;
    dragIcon.onmousedown = dragMouseDown;
    dragIcon.onmousemove = dragMouseMove;
    dragIcon.onmouseup = function(){
        isImageMoving = false;
    }
    dragIcon.style.zIndex = 1;
    imgDiv.appendChild(dragIcon);

    img.style.height=200+'px';
    img.style.width=300+'px';
    document.body.appendChild(imgDiv);
    imageCounter++;
    console.log(imageCounter)
}

function deleteImage(e) {
    var imgId = e.currentTarget.id;
    imgId = imgId.slice(5);
    console.log(imgId)
    var stickyDiv = document.getElementById('image' + imgId);
    document.body.removeChild(stickyDiv);
}

function dragMouseDown(e){
    isImageMoving = true;
    var imgId = e.currentTarget.id;
    imgId = imgId.slice(4);
    // console.log(imgId);
    movingImageDiv = document.getElementById('image' + imgId);
    // console.log(movingImageDiv)
}

function dragMouseMove(){
    if(isImageMoving == true)
    {
        var location = getLocation();
        movingImageDiv.style.left = location.x + 'px';
        movingImageDiv.style.top = location.y + 40 + 'px';
        console.log(movingImageDiv)
    }
}

var getLocation = function () {
    var board = document.getElementById('board');
    var rect = board.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};