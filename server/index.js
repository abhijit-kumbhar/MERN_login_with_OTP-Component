const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errors } = require('mongodb-memory-server');
const connect = require('./database/conn.js')
const router = require('./router/route.js')

const app = express();

/*middleware*/
app.use(express.json());
app.use(cors({
    origin:"*",
    methods : ["POST", "GET", "PUT", "DELETE"],
    credentials:true
}));
app.use(morgan('tiny'));
app.disable('x-powered-by') //less hackers know our stack

const port = 8080;

app.get('/', (req, res) => {
    res.status(201).json("Home GET Request")
})

/*api routes*/
app.use('/api',router)

/* start server only when have valid connection*/
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`server started at port ${port}`);
        })
    } catch (error) {
        console.log("Cannot connect to the server")
    }
}).catch(error => {
    console.log("Invalid Database connections...!")
})
