import express from "express"
import bodyParser from "body-parser"
import pg from "pg"

const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "master",
  port: 5432,
});

db.connect();





// middleware

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// HOMEPAGE



app.get("/", async (req, res)=>{
    const result = await db.query("SELECT todo FROM list")
    let list = [];
    result.rows.forEach((listy)=>{
          list.push(listy.todo)
    });
   
    res.render("index.ejs", {myWishList: list})

});


app.post("/submit", async (req, res)=>{
    const item = req.body.wish
    try {
      await db.query(
        "INSERT INTO list (todo) VALUES ($1)",
        [item]
        
      );
      res.redirect("/");

    } catch (err) {
      console.log(err);
    }
});

app.post("/erase", async (req,res)=>{
          try {
            await db.query("DELETE FROM list WHERE id > 0")
          } catch (error) {
            console.log(error);
          }
  
   res.redirect("/")

});



app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
})