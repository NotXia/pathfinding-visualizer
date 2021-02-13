async function dijkstra_d(grid) {
    await dijkstra(grid, adjacent_nodes_d);
}

async function dijkstra_s(grid) {
    await dijkstra(grid, adjacent_nodes_s);
}

async function dijkstra(grid, adjacent_nodes_function) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();

    var cost_to = {};
    var best_node_to = {};
    var to_visit = [];

    for(let x=0; x<grid.getColumns(); x++) {
        for (let y=0; y<grid.getRows(); y++) {
            best_node_to[new Coord(x, y).toString()] = undefined;
            cost_to[new Coord(x, y).toString()] = Infinity;
        }
    }
    
    cost_to[start_coord.toString()] = 0;
    best_node_to[start_coord.toString()] = start_coord;
    to_visit.push(start_coord);

    while(to_visit.length > 0) {
        let curr_coord = to_visit.shift();

        if (curr_coord.equals(end_coord)) {
            break;
        }
        if (!curr_coord.equals(start_coord)) {
            grid.draw(curr_coord, VISITED_TILE);
        }
        
        await new Promise(r => setTimeout(r, ANIMATION_SPEED));

        adjacent_nodes_function(grid, curr_coord).forEach(near_node => {
            if (cost_to[curr_coord.toString()] + (1) < cost_to[near_node.toString()]) {
                cost_to[near_node.toString()] = cost_to[curr_coord.toString()] + (1);
                best_node_to[near_node.toString()] = curr_coord;
                to_visit.push(near_node);
            }
        });
    }

    var path = end_coord;
    if (best_node_to[path.toString()] !== undefined) {
        while (path.toString() != start_coord.toString()) {
            path = best_node_to[path.toString()];
            if (!path.equals(start_coord)) {
                grid.draw(path, PATH_TILE);
            }
            await new Promise(r => setTimeout(r, ANIMATION_SPEED));
        }
    }
}
