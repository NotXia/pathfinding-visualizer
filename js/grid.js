const WALL_TILE = 0;
const ROAD_TILE = 1;
const START_TILE = 2;
const END_TILE = 3;
const VISITED_TILE = 4;
const PATH_TILE = 5;
const COST_TILE = 6;

const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;
const NORTH_EAST = 4;
const NORTH_WEST = 5;
const SOUTH_EAST = 6;
const SOUTH_WEST = 7;


const DEFAULT_COST = 1;

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

    toString() {
        return "(" + this.x + ";" + this.y + ")";
    }
}

class Grid {
    constructor(container_id, columns, rows, cost_input_id) {
        this.container_id = container_id;
        this.columns = columns;
        this.rows = rows;
        this.cost_input = cost_input_id
        this.show_cost = true;
        this.drawing = false;
        this.curr_mode = WALL_TILE;

        // Initializes all the tiles
        this.matrix = [];
        for (let x = 0; x < columns; x++) {
            this.matrix[x] = [];
            for (let y = 0; y < rows; y++) {
                this.matrix[x][y] = { type: ROAD_TILE, cost: DEFAULT_COST };
            }
        }

        this.render();
    }


    getColumns() {
        return this.columns;
    }

    getRows() {
        return this.rows;
    }

    getMatrix() {
        return this.matrix;
    }

    /* Gets the Coord object of the starting point */
    getStart() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j].type == START_TILE) {
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
                if (this.matrix[i][j].type == END_TILE) {
                    return new Coord(i, j)
                }
            }
        }
        return undefined;
    }

    /* Returns an identifier for the tile at the given coordinate */
    getSquareId(coord) {
        return this.container_id + "-" + coord.getX() + "-" + coord.getY();
    }

    getCostAt(coord) {
        return this.matrix[coord.getX()][coord.getY()].cost;
    }


    /* Displays the grid */
    render() {
        // Generation the grid container
        var grid = document.createElement("div");
        grid.className = "grid-container";
        grid.id = this.container_id + "grid-container";

        // Generation of all the squares
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                var square = document.createElement("div");
                square.className = "square tile" + this.matrix[x][y].type;
                square.id = this.getSquareId(new Coord(x, y));

                var grid_class = this;
                let coord = new Coord(x, y)
                square.addEventListener("mouseover", function () {
                    if (grid_class.drawing) {
                        grid_class.draw(coord);
                    }
                }, false);
                square.addEventListener("mousedown", function (event) {
                    event.preventDefault();
                    grid_class.drawing = true;
                    grid_class.draw(coord);
                }, false);
                square.addEventListener("mouseup", function () {
                    grid_class.drawing = false;
                }, false);

                grid.appendChild(square);
            }
        }

        document.getElementById(this.container_id).innerHTML = "";
        document.getElementById(this.container_id).appendChild(grid);
        this.scale();

        /* Showing cost for each tile (if needed) */
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.showCostAt(new Coord(x, y));
            }
        }
    }

    /* Scales the grid */
    scale() {
        var container = document.getElementById(this.container_id);
        var grid = document.getElementById(this.container_id + "grid-container");

        var square_size = Math.min(container.clientWidth / this.columns, container.clientHeight / this.rows);
        grid.style.width = (square_size * this.columns) + "px";
        grid.style.height = (square_size * this.rows) + "px";

        grid.style.gridTemplateColumns = (square_size + "px ").repeat(this.columns);
        grid.style.gridTemplateRows = (square_size + "px ").repeat(this.rows);
    }

    /* Resizes the grid and renders it */
    resize(new_columns, new_rows) {
        if (new_columns > this.columns) {
            for (let i = 0; i < (new_columns - this.columns); i++) {
                var new_row = [];
                for (let j = 0; j < new_rows; j++) {
                    new_row.push({ type: ROAD_TILE, cost: 1 });
                }
                this.matrix.push(new_row);
            }
        }
        else if (new_columns < this.columns) {
            for (let i = 0; i < (this.columns - new_columns); i++) {
                this.matrix.pop();
            }
        }
        this.columns = new_columns;

        if (new_rows > this.rows) {
            for (let i = 0; i < this.columns; i++) {
                for (let j = 0; j < (new_rows - this.rows); j++) {
                    this.matrix[i][this.rows + j] = { type: ROAD_TILE, cost: 1 };
                }
            }
        }
        else if (new_rows < this.rows) {
            for (let i = 0; i < this.columns; i++) {
                for (let j = 0; j < (this.rows - new_rows); j++) {
                    this.matrix[i].pop();
                }
            }
        }
        this.rows = new_rows;

        this.render();
    }

    /* Removes from the matrix all the visited node and the final path of the previous search */
    reset() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j].type == VISITED_TILE || this.matrix[i][j].type == PATH_TILE) {
                    this.matrix[i][j].type = ROAD_TILE;
                }
            }
        }
        this.render();
    }

    /* Shows the weight of each node */
    showCost() {
        this.show_cost = true;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.showCostAt(new Coord(x, y));
            }
        }
    }

    /* Hides the weight of each node */
    hideCost() {
        this.show_cost = false;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                var square = document.getElementById(this.getSquareId(new Coord(x, y)));
                square.innerHTML = "";
            }
        }
    }

    /* Displays the weight of the square at the given coordinate */
    showCostAt(coord) {
        var square = document.getElementById(this.getSquareId(coord));

        if (this.show_cost) {
            if (([WALL_TILE, START_TILE, END_TILE]).includes(this.matrix[coord.getX()][coord.getY()].type)) {
                square.innerHTML = "";
            }
            else {
                square.innerHTML = this.getCostAt(coord);
            }
        }
        else {
            square.innerHTML = "";
        }
    }
    

    setCurrentMode(mode) {
        this.curr_mode = mode;
    }

    /* Handles the type change of the given coordinate */
    draw(coord) {
        switch (this.curr_mode) {
            case WALL_TILE:
                this.setWall(coord);
                break;

            case ROAD_TILE:
                this.setRoad(coord);
                break;

            case START_TILE:
                this.setStart(coord);
                break;

            case END_TILE:
                this.setEnd(coord);
                break;

            case VISITED_TILE:
                this.setVisited(coord);
                break;

            case PATH_TILE:
                this.setPath(coord);
                break;

            case COST_TILE:
                this.setCost(coord, document.getElementById(this.cost_input).value);
                break;
        }
    }

    /* Changes the type of the tile at the given coordinate */
    setAt(coord, type) {
        var square = document.getElementById(this.getSquareId(coord));
        square.classList.remove(
            "tile0", "tile1", "tile2", "tile3", "tile4", "tile5", 
            "direction0", "direction1", "direction2", "direction3", "direction4", "direction5", "direction6", "direction7"
        );
        square.classList.add("tile" + type);
        
        this.matrix[coord.getX()][coord.getY()].type = type;

        this.showCostAt(coord);
    }

    setWall(coord) {
        this.setCost(coord, DEFAULT_COST);
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
        this.setCost(coord, DEFAULT_COST);
        this.setAt(coord, START_TILE);
    }

    setEnd(coord) {
        var end_coord = this.getEnd();

        if (end_coord !== undefined) {
            this.setAt(end_coord, ROAD_TILE);
        }
        this.setCost(coord, DEFAULT_COST);
        this.setAt(coord, END_TILE);
    }

    setVisited(coord) {
        this.setAt(coord, VISITED_TILE);
    }

    setPath(coord) {
        this.setAt(coord, PATH_TILE);
    }

    setCost(coord, cost) {
        if (!([WALL_TILE, START_TILE, END_TILE]).includes(this.matrix[coord.getX()][coord.getY()].type)) {
            if (cost >= 0) {
                this.matrix[coord.getX()][coord.getY()].cost = cost;
            }
            else {
                this.matrix[coord.getX()][coord.getY()].cost = DEFAULT_COST;
            }
            
            this.showCostAt(coord);
        }
    }

    setDirection(coord, direction) {
        var square = document.getElementById(this.getSquareId(coord));
        square.classList.add("direction" + direction);
    }


    /* Locks the grid, preventing any action */
    lock() {
        document.getElementById(this.container_id).classList.add("lock");
    }

    /* Unloocks the grid */
    unlock() {
        document.getElementById(this.container_id).classList.remove("lock");
    }

    /* Checks if the start and the end nodes are set */
    isValid() {
        return (this.getStart() !== undefined) && (this.getEnd() !== undefined);
    }
}

