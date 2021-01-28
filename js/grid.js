const WALL_TILE = 0;
const ROAD_TILE = 1;
const START_TILE = 2;
const END_TILE = 3;

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    equals(coord) {
        if (coord === undefined) {
            return false;
        }
        else {
            return this.x == coord.getX() && this.y == coord.getY();
        }
    }
}

class Square {
    constructor(color, type) {
        this.color = color;
        this.type = type;
    }

    setColor(color) {
        this.color = color;
    }

    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
}

class Grid {
    constructor(container_id, columns, rows) {
        this.container_id = container_id;
        this.columns = columns;
        this.rows = rows;
        var container = document.getElementById(container_id);

        // Generation the grid container
        var grid = document.createElement("div");
        grid.className = "grid-container";
        grid.id = container_id + "grid-container";

        // Drawing handler
        var draw = function (coord, grid) {
            switch (curr_mode) {
                case WALL_TILE:
                    grid.setWall(coord);
                    break;

                case ROAD_TILE:
                    grid.setRoad(coord);
                    break;

                case START_TILE:
                    grid.setStart(coord);
                    break;

                case END_TILE:
                    grid.setEnd(coord);
                    break;
            }
        }

        // Generation of all the squares
        this.matrix = [columns];
        for (let x = 0; x < columns; x++) {
            this.matrix[x] = [rows];

            for (let y = 0; y < rows; y++) {
                this.matrix[x][y] = new Square("white", ROAD_TILE);

                var square = document.createElement("div");
                square.className = "square";
                square.id = this.getSquareId(new Coord(x, y));

                var grid_class = this;
                square.addEventListener("mouseover", function () {
                    if (drawing) {
                        draw(new Coord(x, y), grid_class);
                    }
                }, false);
                square.addEventListener("mousedown", function (event) {
                    event.preventDefault();
                    startDrawing();
                    draw(new Coord(x, y), grid_class);
                }, false);
                square.addEventListener("mouseup", function () {
                    stopDrawing();
                }, false);

                grid.appendChild(square);
            }
        }

        container.appendChild(grid);

        all_grids.push(this);
        this.resize();
    }

    getColums() {
        return this.columns;
    }

    getRows() {
        return this.rows;
    }

    /* Gets the Coord object of the starting point */
    getStart() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j].getType() == START_TILE) {
                    return new Coord(i, j)
                }
            }
        }
        return undefined;
    }

    /* Gets the Coord object of the ending point */
    getEnd() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j].getType() == END_TILE) {
                    return new Coord(i, j)
                }
            }
        }
        return undefined;
    }

    /* Resizes the grid */
    resize() {
        var container = document.getElementById(this.container_id);
        var grid = document.getElementById(this.container_id + "grid-container");

        var square_size = Math.min(container.clientWidth / this.columns, container.clientHeight / this.rows);
        grid.style.width = (square_size * this.columns) + "px";
        grid.style.height = (square_size * this.rows) + "px";

        grid.style.gridTemplateColumns = (square_size + "px ").repeat(this.columns);
        grid.style.gridTemplateRows = (square_size + "px ").repeat(this.rows);
    }

    setAt(coord, type) {
        var square = document.getElementById(this.getSquareId(coord));
        square.classList.remove("tile0", "tile1", "tile2", "tile3");
        square.classList.add("tile" + type);
        this.matrix[coord.getX()][coord.getY()].setType(type);
    }

    getSquareId(coord) {
        return this.container_id + "-" + coord.getX() + "-" + coord.getY();
    }

    setWall(coord) {
        this.setAt(coord, WALL_TILE);
    }

    setRoad(coord) {
        this.setAt(coord, ROAD_TILE);
    }

    setStart(coord) {
        var start_coord = this.getStart();

        if (start_coord !== undefined) {
            this.setAt(start_coord, ROAD_TILE);
        }
        this.setAt(coord, START_TILE);
    }

    setEnd(coord) {
        var end_coord = this.getEnd();

        if (end_coord !== undefined) {
            this.setAt(end_coord, ROAD_TILE);
        }
        this.setAt(coord, END_TILE);
    }
}


var all_grids = []
/* Resizes all created grids */
function resize_grids() {
    all_grids.forEach(grid => {
        grid.resize();
    });
}


var drawing = false;
var curr_mode = 0;

function setCurrentMode(mode) {
    curr_mode = mode;
}

function startDrawing() {
    drawing = true;
}

function stopDrawing() {
    drawing = false;
}