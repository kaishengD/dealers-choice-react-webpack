const router = require('express').Router()
const res = require('express/lib/response');
const {db , models:{Trainer}} = require('./db')
router.post('/trainers',async(req,res,next)=>{
    try{
        const trainer = await Trainer.generateRandom();
        res.send(trainer)
    }catch(err){
        next(err)
    }
})

router.delete('/trainers/:id',async(req,res,next)=>{
    try{
        const trainer = await Trainer.findByPk(req.params.id);
        await trainer.destroy();
        res.sendStatus(204)
    }catch(err){
        next(err)
    }
})

router.get('/trainers',async(req,res,next)=>{
    try{
        const trainers = await Trainer.findAll()
        res.send(trainers)
    }catch(error){
        next(error)
    }

})

module.exports = router;