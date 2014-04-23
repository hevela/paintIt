$(document).ready(initCanvas);

var canvas;
var context;
var lastColor = 'black';
var startDrawing = false;
var enableDraw = false;

function initCanvas() {
    canvas = $('#paintCanvas').get(0);
    context = canvas.getContext('2d');

    // Automatically adjust canvas size to fit window
    canvas.width  = window.innerWidth - 75;
    canvas.height = window.innerHeight - 75;

    canvas.addEventListener('mousemove', moveBrush);
    canvas.addEventListener('mousedown', function(e) { enableDraw = true; });
    canvas.addEventListener('mouseup', function(e) { enableDraw = false; startDrawing = false; });

    // Add event listeners for toolbar buttons
    $('#black').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#red').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#blue').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#orange').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#green').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#yellow').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#pink').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#cyan').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#lime').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#purple').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#white').get(0).addEventListener('click', function(e) { changeColor(e.target.id); });
    $('#fill').get(0).addEventListener('click', function(e) { fillCanvas(); });
    $('#save').get(0).addEventListener('click', function(e) { saveDrawing(); });
}


function moveBrush(event) {
    var x;
    var y;

    // Get the position of the brush
    if (event.layerX >= 0) {
        x = event.layerX - 50;
        y = event.layerY - 5;
    }

    if(enableDraw) {
        if (!startDrawing) {
            startDrawing = true;

            context.lineWidth = 10;
            context.beginPath();
            context.moveTo(x, y);
        }
        else {
            context.lineTo(x, y);
            context.stroke();
        }
    }
}

function changeColor(color) {

    // Select new color
    context.strokeStyle = color;

    var borderColor = 'white';
    if (color == 'white') {
        borderColor = 'black';
    }

    // Make selected color stand out by increasing the size of its border
    $('#' + lastColor).css("border", "0px dashed white");
    $('#' + color).css("border", "1px dashed " + borderColor);
    $('#white').css("border", "1px dashed black");

    // Store color in memory to be de-selected after new color is selected
    lastColor = color;
}

function fillCanvas() {
    context.fillStyle = context.strokeStyle;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function saveDrawing() {
    var image = canvas.toDataURL();
    document.write('<img src="' + image + '"/>');
}