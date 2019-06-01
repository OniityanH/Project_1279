// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var HarvesterNumber = 0;
var UpgraderNumber = 0;
var BuilderNumber = 0;

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    // goal: have 10 harvesters and as many upgraders as possible
    var minimumNumberOfHarvesters = 10;
    var minimumNumberOfUpgraders = 5
    var minimumNumberOfBuilders = 1;
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], 'Harvester_' + HarvesterNumber,
            { role: 'harvester', working: false});
        HarvesterNumber = HarvesterNumber + 1;
    }
    else if (numberOfUpgraders < minimumNumberOfUpgraders){
        name = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], 'Upgrader_' + UpgraderNumber,
            { role: 'upgrader', working: false});
        UpgraderNumber = UpgraderNumber + 1;
    }

    else if (numberOfBuilders < minimumNumberOfBuilders){
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], 'Builder_' + BuilderNumber,
            { role: 'builder', working: false});
        BuilderNumber = BuilderNumber + 1;
    }
    else {
        // else try to spawn an upgrader
        // small change from what you saw in the video: for upgraders it makes
        //  more sense to have two move parts because they have to travel further
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], 'Builder_' + BuilderNumber,
            { role: 'builder', working: false});
        BuilderNumber = BuilderNumber + 1;
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0)) {
        console.log("Spawned new creep: " + name);
    }
};