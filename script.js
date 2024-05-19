const canvas = document.getElementById('spiderDiagram');
const ctx = canvas.getContext('2d');

const nodes = [
    { id: 1, x: 400, y: 300, color: 'red', text: 'You' },
    { id: 2, x: 200, y: 150, color: 'blue', text: 'Software Engineering' },
    { id: 3, x: 600, y: 150, color: 'green', text: 'Financial Analyst' },
    { id: 4, x: 200, y: 450, color: 'purple', text: 'Cyber Security' },
    { id: 5, x: 600, y: 450, color: 'orange', text: 'Consulting' }
];

// Function to calculate the radius based on text width
function calculateRadius(text) {
    ctx.font = '16px Arial';
    const textWidth = ctx.measureText(text).width;
    return Math.max(20, textWidth / 2 + 10);
}

// Assign radius to each node based on text width
nodes.forEach(node => {
    node.radius = calculateRadius(node.text);
});

let dragNode = null;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

function drawNode(node) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.text, node.x, node.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines between central node and other nodes
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    nodes.forEach(node => {
        if (node.id !== 1) {
            ctx.moveTo(nodes[0].x, nodes[0].y);
            ctx.lineTo(node.x, node.y);
        }
    });
    ctx.stroke();

    // Draw nodes
    nodes.forEach(drawNode);
}

function getNodeAt(x, y) {
    return nodes.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        return dx * dx + dy * dy <= node.radius * node.radius;
    });
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = getNodeAt(x, y);
    if (node) {
        dragNode = node;
        offsetX = x - node.x;
        offsetY = y - node.y;
        isDragging = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (dragNode) {
        const rect = canvas.getBoundingClientRect();
        dragNode.x = e.clientX - rect.left - offsetX;
        dragNode.y = e.clientY - rect.top - offsetY;
        draw();
        isDragging = true;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDragging && dragNode && dragNode.id !== 1) {
        showModal(dragNode);
    }
    dragNode = null;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = getNodeAt(x, y);
    if (node && node.id !== 1 && !isDragging) {
        showModal(node);
    }
});

function showModal(node) {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = node.text;
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');

    modal.style.display = 'none';
    overlay.style.display = 'none';
});

draw();
