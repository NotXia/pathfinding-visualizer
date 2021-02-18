var script = document.createElement("script");
script.src = "./js/algorithms/bfs.js";
document.head.appendChild(script);

var script = document.createElement("script");
script.src = "./js/algorithms/dfs.js";
document.head.appendChild(script);

var script = document.createElement("script");
script.src = "./js/algorithms/dijkstra.js";
document.head.appendChild(script);

var script = document.createElement("script");
script.src = "./js/algorithms/a_star.js";
document.head.appendChild(script);

var ANIMATION_SPEED = 50;

function animation_speed(speed) {
    ANIMATION_SPEED = speed;
}


async function draw_path(grid, path) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();
    grid.setCurrentMode(PATH_TILE);

    for (var i=0; i<path.length; i++) {
        let node = path[i];
        if (!node.equals(start_coord) && !node.equals(end_coord)) {
            grid.draw(node);
        }
        await new Promise(r => setTimeout(r, ANIMATION_SPEED));
    }

    grid.setCurrentMode(undefined);
}


function adjacent_nodes_s(grid, coord) {
    var near = [];
    if (coord.getX() + 1 < grid.getColumns()) {
        if (grid.getMatrix()[coord.getX() + 1][coord.getY()].type != WALL_TILE) {
            near.push(new Coord(coord.getX() + 1, coord.getY()));
        }
    }
    if (coord.getX() - 1 >= 0) {
        if (grid.getMatrix()[coord.getX() - 1][coord.getY()].type != WALL_TILE) {
            near.push(new Coord(coord.getX() - 1, coord.getY()));
        }
    }
    if (coord.getY() + 1 < grid.getRows()) {
        if (grid.getMatrix()[coord.getX()][coord.getY() + 1].type != WALL_TILE) {
            near.push(new Coord(coord.getX(), coord.getY() + 1));
        }
    }
    if (coord.getY() - 1 >= 0) {
        if (grid.getMatrix()[coord.getX()][coord.getY() - 1].type != WALL_TILE) {
            near.push(new Coord(coord.getX(), coord.getY() - 1));
        }
    }
    return near;
}

function adjacent_nodes_d(grid, coord) {
    var near = adjacent_nodes_s(grid, coord);
    if (coord.getX() + 1 < grid.getColumns() && coord.getY() + 1 < grid.getRows()) {
        if (grid.getMatrix()[coord.getX() + 1][coord.getY() + 1].type != WALL_TILE) {
            near.push(new Coord(coord.getX()+1, coord.getY()+1));
        }
    }
    if (coord.getX() - 1 >= 0 && coord.getY() - 1 >= 0) {
        if (grid.getMatrix()[coord.getX()-1][coord.getY()-1].type != WALL_TILE) {
            near.push(new Coord(coord.getX()-1, coord.getY()-1));
        }
    }
    if (coord.getX() - 1 >= 0 && coord.getY() + 1 < grid.getRows()) {
        if (grid.getMatrix()[coord.getX() - 1][coord.getY() + 1].type != WALL_TILE) {
            near.push(new Coord(coord.getX()-1, coord.getY()+1));
        }
    }
    if (coord.getX() + 1 < grid.getColumns() && coord.getY() - 1 >= 0) {
        if (grid.getMatrix()[coord.getX() + 1][coord.getY() - 1].type != WALL_TILE) {
            near.push(new Coord(coord.getX()+1, coord.getY()-1));
        }
    }
    return near;
}
