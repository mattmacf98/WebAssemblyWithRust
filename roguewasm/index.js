import { Engine, PlayerCore } from './roguewasm';

const Game = {
    display: null,
    engine: null,
    rotengine: null,
    player: null,
    enemy: null,
    init: function () {
        this.display = new ROT.Display({width: 125, height: 40});
        document.getElementById("rougueCanvas").appendChild(this.display.getContainer())
        this.engine = new Engine(this.display);

        this.generateMap();

        const scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.enemy, true);

        this.rotengine = new ROT.Engine(scheduler);
        this.rotengine.start();
    },
    generateMap: function () {
        const digger = new ROT.Map.Digger();
        const freeCells = [];

        const digCallback = function (x, y, value) {
            if (value === 0) {
                const key = `${x},${y}`;
                freeCells.push(key);
            }

            this.engine.on_dig(x, y, value);
        }
        digger.create(digCallback.bind(this));

        this.generateBoxes(freeCells);
        this.engine.draw_map();

        const playerLoc = this.getRandomLoction(freeCells);
        this.player = Player;
        this.player.init(playerLoc[0], playerLoc[1]);
        const enemyLoc = this.getRandomLoction(freeCells);
        this.enemy = Enemy;
        this.enemy.init(enemyLoc[0], enemyLoc[1]);
    },
    generateBoxes: function (freeCells) {
        for (let i = 0; i < 10; i ++) {
            const pos = this.getRandomLoction(freeCells);
            this.engine.place_box(pos[0], pos[1]);
            if (i == 9) {
                this.engine.mark_box_as_prize(pos[0], pos[1]);
            }
        }
    },
    getRandomLoction: function (freeCells) {
        const index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        const key = freeCells.splice(index, 1)[0];
        const parts = key.split(",");
        const x = parseInt(parts[0]);
        const y = parseInt(parts[1]);
        return [x,y]
    }
}
const Player = {
    core: null,
    init: function (x, y) {
        this.core = new PlayerCore(x, y, "@",  "#ff0", Game.display);
        this.core.draw();
    },
    act: function () {
        Game.rotengine.lock();
        window.addEventListener("keydown", this.handleEvent);
    },
    handleEvent: function (e) {
        const keyMap = {};
        keyMap[38] = 0;
        keyMap[33] = 1;
        keyMap[39] = 2;
        keyMap[34] = 3;
        keyMap[40] = 4;
        keyMap[35] = 5;
        keyMap[37] = 6;
        keyMap[36] = 7;
        var code = e.keyCode;

        if (code == 13 || code == 32) {
            console.log("OPEN")
            Game.engine.open_box(Player.core, Player.core.x(), Player.core.y()); 
            return;
        }

        if (!(code in keyMap)) {
            return;
        }
    

        const dir = ROT.DIRS[8][keyMap[code]];
        const newX = Player.core.x() + dir[0];
        const newY = Player.core.y() + dir[1];
 
        if (!Game.engine.is_cell_free(newX, newY)) {
            return;
        }

        Game.engine.move_player(Player.core, newX, newY);
        window.removeEventListener("keydown", this.handleEvent); 
        Game.rotengine.unlock();
    },
    getX: function () {
        return this.core.x();
    },
    getY: function () {
        return this.core.y();
    }
}
const Enemy = {
    core: null,
    init: function (x, y) {
        this.core = new PlayerCore(x, y, "B",  "#f00", Game.display);
        this.core.draw();
    },
    act: function () {
        const x = Game.player.getX();
        const y = Game.player.getY();

        const passableCallback = function (x, y) {
            return Game.engine.is_cell_free(x, y);
        }

        const astar = new ROT.Path.AStar(x, y, passableCallback, {topology: 4});
        const path = [];
        const pathCallback = function (x, y) {
            path.push([x,y]);
        }
        astar.compute(this.core.x(), this.core.y(), pathCallback);

        path.shift();
        if (path.length <= 1) {
            Game.rotengine.lock();
            alert("Game over - you were captured by the Enemy!!");
        } else {
            const x = path[0][0];
            const y = path[0][1];
            Game.engine.move_player(this.core, x, y);
        }
    }
}

Game.init();

export function stats_updated(stats) {
    document.getElementById("hitpoints").textContent = stats.hitpoints;
    document.getElementById("max_hitpoints").textContent = stats.max_hitpoints;
    document.getElementById("moves").textContent = stats.moves;
}