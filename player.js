const player = {
    x: 0,
    y: 0,
    move: function (dir) {
        if (dir === 'ArrowUp' && this.y > 0) this.y--;
        if (dir === 'ArrowDown' && this.y < maze.rows - 1) this.y++;
        if (dir === 'ArrowLeft' && this.x > 0) this.x--;
        if (dir === 'ArrowRight' && this.x < maze.cols - 1) this.x++;
    },
    draw: function (ctx, cellSize) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x * cellSize + 2, this.y * cellSize + 2, cellSize - 4, cellSize - 4);
    }
};
