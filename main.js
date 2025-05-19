
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let cellSize;
let moveCount = 0;
let startTime;
let aiPath = [];
let aiIndex = 0;
let ghostInterval;

function setupGame(difficulty = 10) {
    maze.rows = difficulty;
    maze.cols = difficulty;
    cellSize = canvas.width / maze.cols;
    player.x = 0;
    player.y = 0;
    moveCount = 0;
    startTime = Date.now();
    aiIndex = 0;
    clearInterval(ghostInterval);

    maze.generate();
    maze.draw(ctx, cellSize);
    player.draw(ctx, cellSize);

    aiPath = aiAgent.solve(maze);
    animateAIGhost();  // Start ghost race

    document.getElementById('infoPanel').innerText = "Race the AI to finish the maze!";
}

function animateAIGhost() {
    ghostInterval = setInterval(() => {
        if (aiIndex >= aiPath.length) {
            clearInterval(ghostInterval);
            return;
        }
        maze.draw(ctx, cellSize);
        player.draw(ctx, cellSize);
        const ghost = aiPath[aiIndex];
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ghost.x * cellSize + cellSize / 2, ghost.y * cellSize + cellSize / 2, cellSize / 4, 0, 2 * Math.PI);
        ctx.fill();
        aiIndex++;
    }, 200);
}

document.addEventListener('keydown', (e) => {
    console.log("Key pressed:", e.key);
    const oldX = player.x;
    const oldY = player.y;

    player.move(e.key);
    if (oldX !== player.x || oldY !== player.y) {
        moveCount++;
        maze.draw(ctx, cellSize);
        player.draw(ctx, cellSize);
        // Draw AI ghost
        const ghost = aiPath[Math.min(aiIndex, aiPath.length - 1)];
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ghost.x * cellSize + cellSize / 2, ghost.y * cellSize + cellSize / 2, cellSize / 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (player.x === maze.cols - 1 && player.y === maze.rows - 1) {
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        const aiMoves = aiPath.length;
        const efficiency = Math.min(100, Math.round((aiMoves / moveCount) * 100));
        document.getElementById('infoPanel').innerText =
            `🎉 You won in ${moveCount} moves and ${timeTaken}s!\n` +
            `AI took ${aiMoves} moves.\n` +
            `Efficiency: ${efficiency}%`;
        clearInterval(ghostInterval);
    }
});

function giveHint() {
    let currentIndex = aiPath.findIndex(p => p.x === player.x && p.y === player.y);
    if (currentIndex !== -1 && currentIndex + 1 < aiPath.length) {
        const hint = aiPath[currentIndex + 1];
        alert(`Hint: Try moving to (${hint.x}, ${hint.y})`);
    } else {
        alert("You're off the optimal path!");
    }
}

function setDifficulty(level) {
    const sizes = { easy: 5, medium: 10, hard: 15 };
    setupGame(sizes[level]);
}

// Initialize game on first load
setupGame();
