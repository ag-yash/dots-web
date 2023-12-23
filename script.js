document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const spacing = 20; // Spacing between dots
    const dotSize = 2;
    const damping = 0.9; // Damping for smoother motion
    const returnSpeed = 0.4; // Speed at which dots return to their original position
    const attractionBase = 1.1; // Base for the exponential function
    const maxAttraction = 0.9; // Maximum attraction to avoid extreme values
    const threshold = 5; // Threshold for color change
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = -1000; // Start off canvas
    let mouseY = -1000;
    let dots = [];

    // Initialize dots array
    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            dots.push({
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                originalX: x,
                originalY: y,
                color: 'white'
            });
        }
    }

    canvas.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let dot of dots) {

            let dx = dot.x - dot.originalX;
            let dy = dot.y - dot.originalY;
            let displacement = Math.sqrt(dx * dx + dy * dy);

            if (displacement > threshold) {
                dot.color = 'black';
            }

            drawDot(dot.x, dot.y, dotSize, dot.color);
            dx = mouseX - dot.x;
            dy = mouseY - dot.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Exponential attraction calculation
            let attractionFactor = Math.min(Math.pow(attractionBase, -distance), maxAttraction);

            if (distance > 1) { // Avoid extreme values near mouse
                dot.vx += dx * attractionFactor;
                dot.vy += dy * attractionFactor;
            }

            // Apply return force and damping
            dot.vx += (dot.originalX - dot.x) * returnSpeed;
            dot.vy += (dot.originalY - dot.y) * returnSpeed;
            dot.vx *= damping;
            dot.vy *= damping;

            // Update position
            dot.x += dot.vx;
            dot.y += dot.vy;

        }
        requestAnimationFrame(draw);
    }

    function drawDot(x, y, size, color) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    draw();
});
