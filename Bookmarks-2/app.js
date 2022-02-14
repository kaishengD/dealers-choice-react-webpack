//db
const pg = require('pg');
const Sequelize = require('sequelize');


const user = 'postgres';
const host = 'localhost';
const database = 'acme_bookmarks_db';
const password = '123456';
const port = 5432;
const db = new Sequelize(database,user,password,{
    host,
    port,
    dialect: 'postgres',
    logging: true
});
const Bookmark = db.define('bookmark',{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty: false, 
        }
    },
    categoryId:{
        type: Sequelize.INTEGER
        // allowNull:false
    }
})

const Category = db.define('category',{
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty: false, 
        }
    }
})
Bookmark.belongsTo(Category);

// Category.hasMany(Bookmark);
const syncAndSeed = async() => {
    const job = await Category.create({type: 'Job'});
    const search = await Category.create({type: 'Search'});
    const coding = await Category.create({type: 'Coding'});
    const linkedin = await Bookmark.create({name: 'www.linkedin.com'});
    const indeed = await Bookmark.create({name: 'www.Indeed.com'});
    const google = await Bookmark.create({name: 'www.Google.com'});
    const bing = await Bookmark.create({name: 'www.Bing.com'});
    const leetcode =await Bookmark.create({name: 'www.Leetcode.com'});
    linkedin.categoryId = job.id;
    indeed.categoryId = job.id;
    google.categoryId = search.id;
    bing.categoryId = search.id;
    leetcode.categoryId = coding.id;
    await Promise.all([linkedin.save(),indeed.save(),google.save(),bing.save(),leetcode.save()]);
}

//initiation 

const express = require('express');
const contentDisposition = require('content-disposition');
const { redirect } = require('express/lib/response');
const { includes } = require('lodash');
const { captureRejections } = require('pg/lib/query');
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(require('method-override')('_method'));
const init = async() =>{
    try{
        await db.authenticate();
        console.log("connected")
        await db.sync({force:true});
        syncAndSeed();
        console.log('seedede');
        const port = 3000;
        app.listen(port,()=>{
            console.log(`listening on port :${port}`)
        })

    }catch(err){
        console.log(err)
    }
}

init()
app.post('/bookmarks',async(req,res,next)=>{
    try{
        console.log(req.body);
        const web = await Bookmark.create(req.body);
        console.log(web);
        res.redirect(`/category/${web.categoryId}`);
    }catch(err){
        next(err)
    }
})

app.delete('/bookmarks/:id',async(req,res, next)=>{
    try{
        const web = await Bookmark.findByPk(req.params.id);
        console.log(web)
        await web.destroy();
        console.log('deleted')
        res.redirect(`/category/${web.categoryId}`)
    }catch(err){
        next(err)
    }
})

app.get('/',async(req,res,next)=>{
    try{
        res.redirect('/bookmarks')
    }catch(err){
        next(err)
    }
})
app.get('/bookmarks',async(req,res,next)=>{
    try{
        const bookmarks = await Bookmark.findAll({
            include:[Category]
        });
        const categories = await Category.findAll();
        const html = bookmarks.map((bookmark)=>{
        return `
        <div>
             ${bookmark.name} 
             <a href = '/category/${bookmark.category.id}'>${bookmark.category.type}</a>
        </div>
        `
        }).join('')

        res.send(
  
        `
        <html>
        <body>
            <h5>ACME_USER_DB_v2</h5>
            <form method = 'POST'>
                <input name = 'name' placeholder = 'website'/>
                <select name = 'categoryId'>
                    ${
                        categories.map((category)=>{
                            return `<option value = '${category.id}'>${category.type}</option>`
                        }).join()
                    }
                </select>
                <button>create</button>
            </form>
            ${html}
        </body>
        </html>
        `    
        )
    }catch(err){
        next(err)
    }
})

app.get('/category/:id',async(req,res,next)=>{
    try{
        const bookmarks = await Bookmark.findAll({
            where:{categoryId: req.params.id}
        });
        const category = await Category.findByPk(req.params.id);
        const html = bookmarks.map((bookmark)=>{
        return `
        <div>
            ${bookmark.name} <form method = 'POST' action = '/bookmarks/${bookmark.id}?_method=delete'><button>x</button></form>
        </div>
        `
        }).join('')

        res.send(
        `
        <html>
        <body>
            <h5>ACME_USER_DB_v2</h5>
            <h6>${category.type}</h6>
            <a href = '/'> Back </a>
            ${html}
        </body>
        </html>
        `    
        )
    }catch(err){
        next(err)
    }
})
