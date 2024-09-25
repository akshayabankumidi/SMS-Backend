// create student 
// delte a studetn 
// update a student 
// get all students

const express = require('express');
const {createStudent, getStudentByAadhar, updateStudentDetails, deleteStudentDetails, getAllActiveStudentDetails} = require('../dataBases/models/students')
const router = express.Router();

router.post('/add',async (req,res) =>{
 try{
     console.log(req.body);
   const {student_name, gender, section, class_name, DOB, DOA, AadharCard_no, father_name, mother_name} = req.body;
   if(!student_name || !gender || !section || !class_name || !DOB || !DOA || !AadharCard_no || !father_name || !mother_name){
        return res.status(400).json({error: 'All fields are required'});
   }
   
  // check if aadharCard number alredy present in the student db
  const isAadharPresent = await getStudentByAadhar(AadharCard_no);
   
   if(isAadharPresent){
     console.log(isAadharPresent);
     return res.status(400).json({error: 'AadharCard number is already present'});
   }
   const student = await createStudent(student_name, gender, section, class_name, DOB, DOA, AadharCard_no, father_name, mother_name);
   res.status(201).json({id: student.id, student_name: student.student_name, gender: student.gender, section: student.section, class_name: student.class_name, DOB: student.DOB, DOA: student.DOA,AadharCard_no: student.AadharCard_no,father_name: student.father_name, mother_name: student.mother_name});

 } catch (error){
      res.status(500).json({error: 'Server error'});
 }
});

router.patch('/update/:id', async (req,res) =>{
    try{
     const updates = req.body;
     console.log("updates",updates);
     const student = await updateStudentDetails(updates, req.params.id);
     res.status(201).json({id: student.id, student_name: student.student_name, gender: student.gender, section: student.section, class_name: student.class_name, DOB: student.DOB, DOA: student.DOA,AadharCard_no: student.AadharCard_no,father_name: student.father_name, mother_name: student.mother_name});
    } catch (err){
     res.status(500).json({error: 'Server error'});
    }
});

router.delete('/delete/:id',async (req,res) =>{
    try{
       const deleteStudent = await deleteStudentDetails(req.params.id);
       res.status(201).json({ message: `Deleted student_id: ${deleteStudent.id} successfully` });

    } catch (err){
     res.status(500).json({error: 'Server error'});
    }
});

router.get('/', async (req,res) =>{
    try{
       const getAllStudents = await getAllActiveStudentDetails();
       res.status(201).json({getAllStudents});
    } catch (err){
   
    }
});

module.exports = router;