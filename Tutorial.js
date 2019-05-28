建立挖矿机:
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );

采集资源：
module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
}

采集并上缴资源：
module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];

    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else {
        if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
            creep.moveTo(Game.spawns['Spawn1']);
        }
    }
}

建立第二个挖矿机：
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester2' );

两个挖矿机关联执行同样任务：
module.exports.loop = function () {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}


分开module：
Main:

    var roleHarvester = require('role.Harvester');

    module.exports.loop = function () {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            roleHarvester.run(creep);
        }
    }

role.harvester:

    var roleHarvester = {
        /** @param {Creep} creep **/

        run: function(creep) {
            var creep = Game.creeps['Harvester1'];
            if(creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
            else {
                if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
        }
    };
    module.exports = roleHarvester;
//tutorial 1 finished


// tutorial 2 start
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Upgrader1' );

// Write a property role='harvester' into the memory of the harvester creep 
// and role='upgrader' — to the upgrader creep with the help of the console.
Game.creeps['Harvester1'].memory.role = 'harvester';
Game.creeps['Upgrader1'].memory.role = 'upgrader';

//Create a new module role.upgrader with the behavior logic of your new creep.
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy == 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;

//In our main module, all creeps run the same role. We need to divide their behavior depending 
//on the previously defined property Creep.memory.role by connecting the new module.
//Apply the logic from the module role.upgrader to the creep with the 
//role upgrader and check how it performed.
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}

//tutorial 2 finished

//tutorial 3 start

//The Controller upgrade gives access to some new structures: walls, ramparts, and extensions. 
//We’ll discuss walls and ramparts in the next Tutorial section, for now let’s talk about extensions.

//Extensions are required to build larger creeps. A creep with only one body part of one type works poorly. 
//Giving it several WORKs will make him work proportionally faster.

//However, such a creep will be costly and a lone spawn can only contain 300 energy units. 
//To build creeps costing over 300 energy units you need spawn extensions.

//The second Controller level has 5 extensions available for you to build. 
//This number increases with each new level.

//You can place extensions at any spot in your room, and a spawn can use them regardless of the distance. 
//In this Tutorial we have already placed corresponding construction sites for your convenience.

Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',
    { memory: { role: 'builder' } } );
