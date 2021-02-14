async function dfs_d(grid) {
    await dfs(grid, adjacent_nodes_d);
}

async function dfs_s(grid) {
    await dfs(grid, adjacent_nodes_s);
}

async function dfs(grid, adjacent_nodes_function) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();
    
    var visited = [];
    var final_path = [];
    var found = false;
    
    async function explore(node) {
        visited[node.toString()] = true;

        if (node.equals(end_coord)) {
            found = true;
            return;
        }
        if (!node.equals(start_coord)) {
            grid.draw(node, VISITED_TILE);
            await new Promise(r => setTimeout(r, ANIMATION_SPEED));
        }
        final_path.push(node);
        
        let adjacent = adjacent_nodes_function(grid, node);
        for(var i=0; i<adjacent.length && !found; i++) {
            if (visited[adjacent[i].toString()] === undefined && !found) {
                await explore(adjacent[i]);
            }
        }
    }

    await explore(start_coord);

    if (found) {
        for (var i = 0; i < final_path.length; i++) {
            let node = final_path[i];
            if (node != start_coord) {
                grid.draw(node, PATH_TILE);
            }
            await new Promise(r => setTimeout(r, ANIMATION_SPEED));
        }
    }
}
