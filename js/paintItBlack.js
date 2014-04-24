(function() {

    var clearBtn = document.querySelector('#clear');
    clearBtn.addEventListener('click', function(e){
        e.preventDefault();
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, false);

    var brushMode = 'pencil';
    var modeBtn = document.querySelectorAll('.bmode');
    for (var i = 0; i < modeBtn.length; ++i) {
        var btn = modeBtn[i];
        btn.addEventListener('click', function(e){
            e.preventDefault();
            brushMode = this.id;
            console.log(brushMode);
        }, false);
    }

    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');

    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));


    // Creating a tmp canvas
    var tmp_canvas = document.createElement('canvas');
    var tmp_ctx = tmp_canvas.getContext('2d');
    tmp_canvas.id = 'tmp_canvas';
    tmp_canvas.width = canvas.width;
    tmp_canvas.height = canvas.height;

    sketch.appendChild(tmp_canvas);

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};
    var start_mouse = {x: 0, y: 0};

    // Pencil Points
    var ppts = [];

    /* Mouse Capturing Work */
    tmp_canvas.addEventListener('mousemove', function(e) {
        mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    }, false);


    /* Drawing on Paint App */
    tmp_ctx.lineWidth = 5;
    tmp_ctx.lineJoin = 'round';
    tmp_ctx.lineCap = 'round';

    var colorMode = 'blue';
    var colorBtn = document.querySelectorAll('.colormode');
    for (i = 0; i < colorBtn.length; ++i) {
        var bt = colorBtn[i];
        bt.addEventListener('click', function(e){
            e.preventDefault();
            colorMode = this.id;
            console.log(colorMode);
            tmp_ctx.strokeStyle = colorMode;
            tmp_ctx.fillStyle = colorMode;
        }, false);
    }

    var thickness = 5;
    var thickBtn = document.querySelectorAll('.thickness');
    for (i = 0; i < thickBtn.length; ++i) {
        var tb = thickBtn[i];
        tb.addEventListener('click', function(e){
            e.preventDefault();
            var thickMode = this.id;
            console.log(thickMode);

            switch (thickMode){
                case 'thin':
                    thickness = 1;
                    break;
                case 'normal':
                    thickness = 5;
                    break;
                case 'thick':
                    thickness = 15;
                    break;
                case 'thicker':
                    thickness = 25;
                    break;
            }
            tmp_ctx.lineWidth = thickness;
        }, false);
    }

    tmp_canvas.addEventListener('mousedown', function(e) {
        tmp_canvas.addEventListener('mousemove', onPaint, false);

        mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;


        switch (brushMode){
            case 'pencil':
                ppts.push({x: mouse.x, y: mouse.y});
                break;
            default :
                start_mouse.x = mouse.x;
                start_mouse.y = mouse.y;
                break;
        }

        onPaint();
    }, false);

    tmp_canvas.addEventListener('mouseup', function() {
        tmp_canvas.removeEventListener('mousemove', onPaint, false);

        // Writing down to real canvas now
        ctx.drawImage(tmp_canvas, 0, 0);
        // Clearing tmp canvas
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        // Emptying up Pencil Points
        ppts = [];
    }, false);

    var onPaint = function() {
        switch (brushMode){
            case 'pencil':
                paintPencil();
                break;
            case 'line':
                paintLine();
                break;
            case 'rectangle':
                paintRectangle();
                break;
            case 'circle':
                paintCircle();
                break;
            case 'ellipse':
                paintEllipse();
                break;
            default:
                //Eraser
                tmp_ctx.strokeStyle = 'white';
                tmp_ctx.fillStyle = 'white';
                paintPencil();
                break;
        }

    };

    var paintEllipse = function(){
        //tmp canvas must be cleared before drawing
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        var x = Math.min(mouse.x, start_mouse.x);
        var y = Math.min(mouse.y, start_mouse.y);

        var w = Math.abs(mouse.x - start_mouse.x);
        var h = Math.abs(mouse.y - start_mouse.y);

        var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        tmp_ctx.beginPath();
        tmp_ctx.moveTo(x, ym);
        tmp_ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        tmp_ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        tmp_ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        tmp_ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        tmp_ctx.closePath();
        tmp_ctx.stroke();
    };

    var paintCircle = function(){
        //tmp canvas must be cleared before drawing
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        var x = (mouse.x + start_mouse.x) / 2;
        var y = (mouse.y + start_mouse.y) / 2;

        var radius = Math.max(
            Math.abs(mouse.x - start_mouse.x),
            Math.abs(mouse.y - start_mouse.y)
        ) / 2;

        tmp_ctx.beginPath();
        tmp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
        tmp_ctx.stroke();
        tmp_ctx.closePath();

    };

    var paintRectangle = function(){
        //tmp canvas must be cleared before drawing
        tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);

        var x = Math.min(mouse.x, start_mouse.x);
        var y = Math.min(mouse.y, start_mouse.y);
        var width = Math.abs(mouse.x - start_mouse.x);
        var heigth = Math.abs(mouse.y - start_mouse.y);

        tmp_ctx.strokeRect(x, y, width, heigth);
    };

    var paintPencil = function(){
        // Saving all the points in an array
        ppts.push({x: mouse.x, y: mouse.y});

        if (ppts.length < 3) {
            var b = ppts[0];
            tmp_ctx.beginPath();
            //ctx.moveTo(b.x, b.y);
            //ctx.lineTo(b.x+50, b.y+50);
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();

            return;
        }

        // Tmp canvas is always cleared up before drawing.
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        tmp_ctx.beginPath();
        tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

        for (var i = 1; i < ppts.length - 2; i++) {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
        }

        // For the last 2 points
        tmp_ctx.quadraticCurveTo(
            ppts[i].x,
            ppts[i].y,
            ppts[i + 1].x,
            ppts[i + 1].y
        );
        tmp_ctx.stroke();
    };

    var paintLine = function(){
        //tmp canvas must be cleared before drawing
        tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);

        tmp_ctx.beginPath();
        tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
        tmp_ctx.lineTo(mouse.x, mouse.y);
        tmp_ctx.stroke();
        tmp_ctx.closePath();
    };

}());