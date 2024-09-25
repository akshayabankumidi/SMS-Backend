
const express = require('express');
const {createAttendence, updateAttendenceDetails, getAttendenceByClassAndSection} = require('../dataBases/models/attendence')
const router = express.Router();

router.post('/add',async (req,res) =>{
 try{
     
   const {student_id, date,attendence_status} = req.body;
   if(!student_id || !date || !attendence_status){
        return res.status(400).json({error: 'All fields are required'});
   }

   const attendence = await createAttendence(student_id, date,attendence_status);
   res.status(201).json({id: attendence.id, student_id: attendence.student_id, date: attendence.date, attendence_status: attendence.attendence_status});

 } catch (error){
      res.status(500).json({error: 'Server error'});
 }
});

router.patch('/update/:id', async (req,res) =>{
    try{
     const updates = req.body;
     console.log("updates",updates);
     const attendence = await updateAttendenceDetails(updates, req.params.id);
     res.status(201).json({id: attendence.id, student_id: attendence.student_id, date: attendence.date, attendence_status: attendence.attendence_status});
    } catch (err){
     res.status(500).json({error: 'Server error'});
    }
});

router.get('/', async (req,res) =>{
    try{
       const {class_name, section, year, month} = req.query;
       const getAttendence = await getAttendenceByClassAndSection(class_name, section, year, month);
       res.status(201).json({getAttendence});
    } catch (err){
        res.status(500).json({error: 'Server error'});
    }
});

module.exports = router;