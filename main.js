    module.exports.loop = function(){
        var creep = Game.creeps.Harvester1;

        if (creep.memory.working == true && creep.carry.energy == 0){
            creep.memory.working = false;
        }
        else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity){
            creep.memory.working = true;
        }

        if (creep.memory.working == true){
            if (creep.transfer(Game.spawns.Spswn1, 
                RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.Spswn1);
                }
        }
        else{
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
        }
    }