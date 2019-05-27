module.exports.loop = function(){
    var creep = Game.creeps['Proj1279_Harvester1'];

    if (creep.carry.energy < creep.carryCapacity){

        var souces = creep.room.find(FIND_SOURCES);
        
        if (creep.harvest(souces[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(souces[0]);
        }

        else {
            if (creep.transfer(Game.
                spawns['Project1279_Substance1'], RESOURCE_ENERGY)==
                ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns['Project1279_Substance1']);
                }
        }
    }
}