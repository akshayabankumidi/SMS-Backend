
const express = require('express');
const {createAttendence, updateAttendenceDetails, getAttendenceByDateAndClassAndSection} = require('../dataBases/models/attendence');
const {  getAllActiveStudentDetailsByClassAndSection } = require('../dataBases/models/students');
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

// router.patch('/update/:id', async (req,res) =>{
//     try{
//      const updates = req.body;
//      console.log("updates",updates);
//      const attendence = await updateAttendenceDetails(updates, req.params.id);
//      res.status(201).json({id: attendence.id, student_id: attendence.student_id, date: attendence.date, attendence_status: attendence.attendence_status});
//     } catch (err){
//      res.status(500).json({error: 'Server error'});
//     }
// });

router.patch('/update', async (req, res) => {
    try {
      const updatesList = req.body;  // This should be an array of updates
      console.log("updaedList",updatesList);
      const updatePromises = updatesList.map(update =>
        updateAttendenceDetails(update.attendance, update.attendance_id)
      );
      const results = await Promise.all(updatePromises);
      res.status(201).json(results);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// router.get('/', async (req,res) =>{
//     try{
//        const {class_name, section, year, month} = req.query;
//        console.log("req query :", req.query);
//        const getAttendence = await getAttendenceByClassAndSection(class_name, section, year, month);
//        res.status(201).json({getAttendence});
//     } catch (err){
//         res.status(500).json({error: 'Server error'});
//     }
// });

router.get('/', async (req,res) =>{// get attendance controller
  try{
  
     const {class_name, section, date} = req.query;
     console.log(class_name,section,date);
     const student_list = await getAllActiveStudentDetailsByClassAndSection(class_name,section);
    // console.log("student_list",student_list);
     console.log("req query :", req.query);
     const attendence_list = await getAttendenceByDateAndClassAndSection(class_name, section, date);
      // console.log("Attendce",attendence_list);
   
     let finalList=[];
      for(let i =0;i<student_list.length;i++){
        let flag =0;
        for(let j =0;j<attendence_list.length;j++){
           
          if(student_list[i].id == attendence_list[j].student_id){

            const obj = {
              id:student_list[i].id,
              attendence_id:attendence_list[j].id,
              student_name: student_list[i].student_name,
              attendence_status:attendence_list[j].attendence_status
            }
            console.log(obj);
            finalList.push(obj);
            flag =1;break;
          }
        }
 
        if(!flag){
          const attendence =await createAttendence(
            student_list[i].id,
          date,
           'absent'
          );
         
          finalList.push({
            id:student_list[i].id,
            attendence_id:attendence.id,
            student_name: student_list[i].student_name,
            attendence_status: 'absent'
          });
        }
      }


     res.status(201).json({finalList});
  } catch (err){
      res.status(500).json({error: 'Server error'});
  }
});
module.exports = router;

// get all student detials based on fileter {student_id , student_name}
// then attach date to it 
// and send it to backend 

// json looks like
//http://localhost:3000/api/attendence?class_name=1&section=A&date=15%2D09%2D2024http://localhost:3000/api/attendence?class_name=1&section=A&date=15%2D09%2D2024http://localhost:3000/api/attendence?class_name=1&section=A&date=15%2D09%2D2024
// {
//   "student_id":"12323",
//   "date": "02-10-2024",

// }

// will itereate over attendce table and checks whether there is student_id and date 
// if not then  will add one (default is absent )
// {
//   "student_id":"12323",
//   "date": "02-10-2024",
// }
//will send to front end by  combineing every thing and sort by student name

