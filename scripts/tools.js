var mode = 'pen';

function handleModeChange(newMode){
    var currentElement = document.getElementById(newMode);
    currentElement.className += ' active';
    var oldElement = document.getElementById(mode);
    var newClass = oldElement.className.replace(' active', '');
    oldElement.className = newClass;
    var board = document.getElementById('board');
   
    board.style.zIndex = 1;
    var imgs = document.getElementsByClassName('img');
    for (var i = 0; i < imgs.length; i++){
        imgs[i].style.zIndex = -1;
    }
    var slider = document.getElementById('myRange')
    // console.log(slider)
    if(newMode == 'zoom')
    {
        if (newMode == mode)
        {
            return;
        }
        slider.zIndex = 1;
        mode = 'zoom'
        return;
    }
    else
    {
        slider.zIndex = -1;
    }
    if(newMode == mode){
        if (mode == 'pen') {
            var penOptions = document.getElementById('penOptions');
            penOptions.classList.toggle('show');
        }
        mode = 'pen';
    }
    else if (newMode == 'image') {
        var imageOptions = document.getElementById('imageOptions');
        imageOptions.classList.toggle('show');
        var board = document.getElementById('board');
        board.style.zIndex = -1;
        var imgs = document.getElementsByClassName('img');
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].style.zIndex = 1;
        }
        // imageOptions.classList.toggle('show');
        mode = newMode;
    }
    else if (mode == 'image' && newMode == 'pen') {
        var board = document.getElementById('board');
        board.style.zIndex = 1;
        var imgs = document.getElementsByClassName('img');
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].style.zIndex = -1;
        }
        mode = 'pen';
    }
    else{
        mode = newMode;
    }
}

function changePenSize(newSize) {

    var oldid = 'penSpan' + penSize;
    oldSize = document.getElementsByClassName(oldid)[0];
    oldSize.classList.toggle('active');

    var newid = 'penSpan' + newSize
    selectedSize = document.getElementsByClassName(newid)[0];
    selectedSize.classList.toggle('active');

    penSize = newSize;
}

function changePenColor(newColor) {
    switch (newColor) {
        case 'black':
            penColor = '#000000';
            break;

        case 'red':
            penColor = '#ff0000';
            break;

        case 'blue':
            penColor = '#0000ff';
            break;

    }
    var penSpan = document.getElementById('pen');
    penSpan.src = '../icons/pencil_icon_dark.png';
    penSpan.style.backgroundColor = penColor;
}
