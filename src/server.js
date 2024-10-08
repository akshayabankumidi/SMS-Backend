const express = require('express');
const bodyParser = require('body-parser');
const intilalizeDatabase = require('./dataBases/initilalizeDatabase');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const attendenceRoutes = require('./routes/attendence');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/attendence',attendenceRoutes);

const startServer = async () => {
    
    try{
        await intilalizeDatabase();
        app.listen(port, ()=>{
          console.log(`server is running on ${port}`);
        });
      
    } catch(error){
        console.error('Failed to start server:', error);
    }  
    
}


startServer();
