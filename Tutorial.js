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


//Let’s create a new creep whose purpose is to build structures. 
//This process will be similar to the previous Tutorial sections. 
//But this time let’s set memory for the new creep right in the method Spawn.
//spawnCreep by passing it in the third argument.

Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',
    { memory: { role: 'builder' } } );


//As before, let’s move this role into a separate module role.builder. 
//The building is carried out by applying the method Creep.build to the construction sites searchable by Room.
//find(FIND_CONSTRUCTION_SITES). The structure requires energy which your creep can harvest on its own.

//To avoid having the creep run back and forth too often but make it deplete the cargo, 
//let’s complicate our logic by creating a new Boolean variable creep.memory.
//building which will tell the creep when to switch tasks. 
//We'll also add new creep.say call and visualizePathStyle option to the moveTo method to visualize the creep's intentions.

//Create the module role.builder with a behavior logic for a new creep.

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;

//Let’s create a call of the new role in the main module and wait for the result.
//By using the module role.builder in the new creep, build all 5 extensions.

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

/**
 * Maintaining extensions requires you to teach your harvesters to 
 * carry energy not just to a spawn but also to extensions. 
 * To do this, you can either use the Game.structures object 
 * or search within the room with the help of Room.find(FIND_STRUCTURES). 
 * In both cases, you will need to filter the list of items on the condition 
 * structure.structureType == STRUCTURE_EXTENSION (or, alternatively, 
 * structure instanceof StructureExtension) and also check them for 
 * energy load, as before.
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;

/**
 * To know the total amount of energy in the room, you can use the property Room.
 * energyAvailable. Let’s add the output of this property into the console in order 
 * to track it during the filling of extensions. Fill all the 5 extensions and the 
 * spawn with energy.
 */

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}


/**
 * In total, we have 550 energy units in our spawn and extensions. 
 * It is enough to build a creep with the body [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]. 
 * This creep will work 4 times faster than a regular worker creep. 
 * Its body is heavier, so we’ll add another MOVE to it. However, 
 * two parts are still not enough to move it at the speed of a small fast creep 
 * which would require 4xMOVEs or building a road.
 * Spawn a creep with the body [WORK,WORK,WORK,CARRY,MOVE,MOVE], the name HarvesterBig, 
 * and harvester role.
 */

Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
    'HarvesterBig',
    { memory: { role: 'harvester' } } );

//tutorial 3 finished

//tutorial 4 start

/**
 * You will have to create new creeps when old ones die from age or some other reasons. 
 * Since there are no events in the game to report death of a particular creep, 
 * the easiest way is to just count the number of required creeps, and if it becomes 
 * less than a defined value, to start spawning.
 * There are several ways to count the number of creeps of the required type. 
 * One of them is filtering Game.creeps with the help of the _.filter function and 
 * using the role in their memory. Let’s try to do that and bring the number of 
 * creeps into the console.
 */

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

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


/**
 * Let’s say we want to have at least two harvesters at any time. 
 * The easiest way to achieve this is to run StructureSpawn.spawnCreep 
 * each time we discover it’s less than this number. You may not define 
 * its name (it will be given automatically in this case), but don’t forget 
 * to define the needed role.
 * 
 * We may also add some new RoomVisual call in order to visualize what creep 
 * is being spawned.
 */

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

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

/**
 * Now let’s try to emulate a situation when one of our harvesters dies. 
 * You can now give the command suicide to the creep via the console 
 * or its properties panel on the right.
 */

Game.creeps['Harvester1'].suicide()

/**
 * An important point here is that the memory of dead creeps is not erased 
 * but kept for later reuse. If you create creeps with random names each 
 * time it may lead to memory overflow, so you should clear it in the 
 * beginning of each tick (prior to the creep creation code).
 */

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

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


//tutorial 4 finished
