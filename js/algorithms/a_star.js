async function a_star_d(grid) {
    await a_star(grid, adjacent_nodes_d, chebyshev_distance);
}

async function a_star_s(grid) {
    await a_star(grid, adjacent_nodes_s, manhattan_distance);
}

function manhattan_distance(node_coord, end_coord) {
    dist_x = Math.abs(node_coord.getX() - end_coord.getX());
    dist_y = Math.abs(node_coord.getY() - end_coord.getY());
    return (dist_x + dist_y);
}

function chebyshev_distance(node_coord, end_coord) {
    dist_x = Math.abs(node_coord.getX() - end_coord.getX());
    dist_y = Math.abs(node_coord.getY() - end_coord.getY());
    return Math.max(dist_x, dist_y);
}

async function a_star(grid, adjacent_nodes_function, heuristic) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();
    grid.setCurrentMode(VISITED_TILE);

    var cost_to = {};
    var best_node_to = {};
    var to_visit = [];

    for (let x = 0; x < grid.getColumns(); x++) {
        for (let y = 0; y < grid.getRows(); y++) {
            best_node_to[new Coord(x, y).toString()] = undefined;
            cost_to[new Coord(x, y).toString()] = Infinity;
        }
    }

    cost_to[start_coord.toString()] = 0;
    best_node_to[start_coord.toString()] = start_coord;
    to_visit.push([start_coord, Number(heuristic(start_coord, end_coord))]);

    while (to_visit.length > 0) {
        let curr_coord = to_visit.shift()[0];

        if (curr_coord.equals(end_coord)) {
            break;
        }
        if (!curr_coord.equals(start_coord) && !curr_coord.equals(end_coord)) {
            grid.draw(curr_coord);
        }

        await new Promise(r => setTimeout(r, ANIMATION_SPEED));

        adjacent_nodes_function(grid, curr_coord).forEach(near_node => {
            if (Number(cost_to[curr_coord.toString()]) + Number(grid.getCostAt(near_node)) < cost_to[near_node.toString()]) {
                cost_to[near_node.toString()] = Number(cost_to[curr_coord.toString()]) + Number(grid.getCostAt(near_node));
                best_node_to[near_node.toString()] = curr_coord;

                to_visit.push([near_node, Number(cost_to[near_node.toString()] + heuristic(near_node, end_coord)) ]);
                to_visit.sort(function (a, b) {
                    return a[1] - b[1];
                });
            }
        });
    }

    var final_path = [];
    var node = end_coord;
    if (best_node_to[node.toString()] !== undefined) {
        final_path.push(end_coord);
        while (!node.equals(start_coord)) {
            node = best_node_to[node.toString()];
            final_path.push(node);
        }
    }

    await draw_path(grid, final_path.reverse());
}
