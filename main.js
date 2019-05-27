module.exports.loop = function(){
    var creep_list = [];
    var creep = Game.creeps['Proj1279_Harvester1', 'Proj1279_Harvester2'];

    for (var i = 0; i < creep.length; i++){
        if (creep[i].carry.energy < creep[i].carryCapacity){

            var souces = creep.room.find(FIND_SOURCES);
            
            if (creep[i].harvest(souces[0]) == ERR_NOT_IN_RANGE){
                creep[i].moveTo(souces[0]);
            }
            else {
                if (creep[i].transfer(Game.
                    spawns['Project1279_Substance1'], RESOURCE_ENERGY)==
                    ERR_NOT_IN_RANGE){
                        creep[i].moveTo(Game.spawns['Project1279_Substance1']);
                    }
            }
        }
    }
}