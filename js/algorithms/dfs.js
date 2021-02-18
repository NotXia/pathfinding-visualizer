async function dfs_d(grid) {
    await dfs(grid, adjacent_nodes_d);
}

async function dfs_s(grid) {
    await dfs(grid, adjacent_nodes_s);
}

async function dfs(grid, adjacent_nodes_function) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();
    grid.setCurrentMode(VISITED_TILE);
    
    var visited = [];
    var final_path = [];
    var found = false;
    
    async function explore(node, path) {
        visited[node.toString()] = true;

        if (node.equals(end_coord)) {
            found = true;
            final_path = path;
            final_path.push(end_coord);
            return;
        }
        if (!node.equals(start_coord)) {
            grid.draw(node);
            await new Promise(r => setTimeout(r, ANIMATION_SPEED));
        }
        path.push(node);
        
        let adjacent = adjacent_nodes_function(grid, node);
        for (var i=0; i<adjacent.length && !found; i++) {
            if (visited[adjacent[i].toString()] === undefined && !found) {
                await explore(adjacent[i], path.slice());
            }
        }
    }

    await explore(start_coord, []);

    await draw_path(grid, final_path);
}
