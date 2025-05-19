const aiAgent = {
    solve: function (maze) {
        // Placeholder pathfinding (you can add BFS/A* here)
        return [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]; // dummy path
    },
    drawPath: function (ctx, path, cellSize) {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            let p = path[i];
            ctx.lineTo(p.x * cellSize + cellSize / 2, p.y * cellSize + cellSize / 2);
        }
        ctx.stroke();
    }
};



function aStar(start, end, maze) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    const rows = maze.rows;
    const cols = maze.cols;

    function hash(pos) {
        return pos.x + "," + pos.y;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            gScore[hash({x: c, y: r})] = Infinity;
            fScore[hash({x: c, y: r})] = Infinity;
        }
    }

    gScore[hash(start)] = 0;
    fScore[hash(start)] = heuristic(start, end);

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[hash(a)] - fScore[hash(b)]);
        const current = openSet.shift();

        if (current.x === end.x && current.y === end.y) {
            return reconstructPath(cameFrom, current);
        }

        for (let dir of [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]) {
            const neighbor = {x: current.x + dir.x, y: current.y + dir.y};

            if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= cols || neighbor.y >= rows) continue;

            const tentative_gScore = gScore[hash(current)] + 1;

            if (tentative_gScore < gScore[hash(neighbor)]) {
                cameFrom[hash(neighbor)] = current;
                gScore[hash(neighbor)] = tentative_gScore;
                fScore[hash(neighbor)] = tentative_gScore + heuristic(neighbor, end);
                if (!openSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current.x + "," + current.y]) {
        current = cameFrom[current.x + "," + current.y];
        path.unshift(current);
    }
    return path;
}



aiAgent.solve = function (maze) {
    const start = {x: 0, y: 0};
    const end = {x: maze.cols - 1, y: maze.rows - 1};
    return aStar(start, end, maze);
};

aiAgent.drawPath = function (ctx, path, cellSize) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
        let p = path[i];
        if (i === 0) ctx.moveTo(p.x * cellSize + cellSize / 2, p.y * cellSize + cellSize / 2);
        else ctx.lineTo(p.x * cellSize + cellSize / 2, p.y * cellSize + cellSize / 2);
    }
    ctx.stroke();
};
