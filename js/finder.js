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
    ANIMATION_SPEED = 200/speed;
}


async function draw_path(grid, path) {
    var start_coord = grid.getStart();
    var end_coord = grid.getEnd();
    grid.setCurrentMode(PATH_TILE);

    function direction(node, next) {
        if (node.getX() == next.getX() && node.getY() > next.getY()) {
            return NORTH;
        }
        else if (node.getX() < next.getX() && node.getY() > next.getY()) {
            return NORTH_EAST;
        }
        else if (node.getX() > next.getX() && node.getY() > next.getY()) {
            return NORTH_WEST;
        }
        else if (node.getX() == next.getX() && node.getY() < next.getY()) {
            return SOUTH;
        }
        else if (node.getX() < next.getX() && node.getY() < next.getY()) {
            return SOUTH_EAST;
        }
        else if (node.getX() > next.getX() && node.getY() < next.getY()) {
            return SOUTH_WEST;
        }
        else if (node.getX() < next.getX() && node.getY() == next.getY()) {
            return EAST;
        }
        else if (node.getX() > next.getX() && node.getY() == next.getY()) {
            return WEST;
        }
    }

    // path[0] contains the start_coord
    // path[len-1] contains the end_coord
    for (var i=0; i<path.length-1; i++) {
        if (!path[i].equals(start_coord) && !path[i].equals(end_coord)) {
            grid.draw(path[i]);
        }
        grid.setDirection(path[i], direction(path[i], path[i+1]))
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
