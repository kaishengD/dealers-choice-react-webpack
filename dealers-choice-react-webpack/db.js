const pg = require('pg');
const Sequelize = require('sequelize');
const { UUID, UUIDV4 } = require('sequelize');

const db = new Sequelize('postgres://localhost/pokemon_trainers');

const Trainer = db.define('trainer',{
    id:{
        type:UUID,
        defaultValue: UUIDV4,
        primaryKey:true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    }
});

Trainer.generateRandom = function(){
    return this.create({name:`Trainer ${Math.floor(Math.random()*100)}`})
}



const syncAndSeed = async()=>{
    await db.sync({force:true});
    const [satoshi,misty,brock] = await Promise.all(
        ['satoshi','misty','brock'].map(name=>{
            return Trainer.create({name})
        })
    )
    console.log('data seeded')
};

module.exports = {
    models:{
        Trainer,
    },
    db,
    syncAndSeed
}