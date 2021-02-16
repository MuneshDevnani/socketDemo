const app = require('express')()
const mysql = require('mysql');
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyparser = require('body-parser');
var cors = require('cors')
 
app.use(cors())
app.use(bodyparser.json())
// Add the credentials to access your database
var mysqlConnection = mysql.createConnection({
  "host"        : "workerzero.cdhxjhrp203p.us-west-1.rds.amazonaws.com",
  "user"        : "admin",
  "password"    : "lTFk5bemjaFpS1cMpx18",
  "database"    : "WorkerZero_Public"
});

// connect to mysql
mysqlConnection.connect(function(err) {
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }else{
        console.log("db connection succeded");
    }
});
io.on('connection', socket => {
  socket.on('message', ({ name, message,e }) => {
    // console.log("lastinsert id",e);
    let sql = `INSERT INTO testTable(text,message)
     VALUES('${name}','${message}')`;
           mysqlConnection.query(sql, (err, rows, fields) =>{
            //  console.log(rows.insertId);
            let lastInserId = rows.insertId
             io.emit('message', { name, message, lastInserId  })
           });
    
  })


  socket.on('addLike', async function (data) {
    console.log( data );
    let count = data.count
    io.emit(`appendLike`,{
      data
    })
   
    
  })
})

app.get('/getcount', (req, res) =>{
  mysqlConnection.query('SELECT * FROM testTable', (err, rows, fields)=>{
    if(!err){
    res.send(rows);
    }
    else{
    console.log(err);
    }
})
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})
