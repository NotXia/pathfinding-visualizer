async function bfs_d(grid) {
    await bfs(grid, adjacent_nodes_d);
}

async function bfs_s(grid) {
    await bfs(grid, adjacent_nodes_s);
}

async function bfs(grid, adjacent_nodes_function) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();

    var to_visit = [];
    var visited = [];
    var final_path = [];

    to_visit.push([start_coord, []]);
    visited[start_coord.toString()] = true;
    while (to_visit.length > 0) {
        let curr_coord = to_visit.shift();

        if (curr_coord[0].equals(end_coord)) {
            final_path = curr_coord[1];
            break;
        }
        if (!curr_coord[0].equals(start_coord)) {
            grid.draw(curr_coord[0], VISITED_TILE);
            await new Promise(r => setTimeout(r, ANIMATION_SPEED));
        }

        adjacent_nodes_function(grid, curr_coord[0]).forEach(near_node => {
            if (visited[near_node.toString()] === undefined) {
                let path = curr_coord[1].slice();
                path.push(curr_coord[0]);
                to_visit.push([near_node, path]);
                visited[near_node.toString()] = true;
            }
        });
    }

    for (var i = 0; i < final_path.length; i++) {
        let node = final_path[i];
        if (node != start_coord) {
            grid.draw(node, PATH_TILE);
        }
        await new Promise(r => setTimeout(r, ANIMATION_SPEED));
    }
}
