const db = require('../../config/db');

const createStudent = async (student_name, gender, section, class_name, DOB, DOA, AadharCard_no, father_name, mother_name) => {
    const query = `INSERT INTO students (student_name, gender, section, class_name, DOB, DOA, AadharCard_no, father_name, mother_name) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING id, student_name, gender, section, class_name, DOB, DOA, AadharCard_no, father_name, mother_name`;
    const values = [student_name, gender, section, class_name, DOB, DOA, AadharCard_no, father_name, mother_name];
    console.log('inside create student function');
    const result = await db.query(query, values);
    console.log('after res');
    return result.rows[0];
};

const getStudentByAadhar = async (AadharCard_no) => {
 const query = `SELECT * FROM students WHERE AadharCard_no = $1`;
 const result = await db.query(query, [AadharCard_no]);
 return result.rows[0]; 
};

const updateStudentDetails = async (newDetails, student_id) => {
    console.log(`${newDetails} and ${student_id}`);
    const fieldsWeCanUpdate = ['student_name', 'gender', 'section', 'class_name', 'DOB', 'DOA', 'AadharCard_no', 'father_name', 'mother_name', 'status'];
    let fieldsToUpdate = [];
     
    let index = 2;  // Start from 2 because $1 will be used for studentId
    for (let field in newDetails) {
        console.log(`${field}`);
      if (fieldsWeCanUpdate.includes(field) && newDetails[field] != null) {
        fieldsToUpdate.push(`${field} = $${index}`);
        index++;
      }
    }

  
    if (fieldsToUpdate.length === 0) return null;
  
    const query = `
      UPDATE students
      SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    let queryValues = [student_id];
    for (let field of fieldsWeCanUpdate) {
      if (field in newDetails) {
        queryValues.push(newDetails[field]);
      }
    }
    const result = await db.query(query, queryValues);
    return result.rows[0];

}


const deleteStudentDetails = async (student_id) => {
 const query = `
 UPDATE students
 SET status = 'inactive'
 WHERE id = $1
 RETURNING *
 `
 const result = await db.query(query, [student_id]);
 return result.rows[0];
}

const getAllActiveStudentDetails = async () => {
    const query = `
    SELECT * FROM students WHERE status = 'active'
    `
    const result = await db.query(query,[]);
    console.log(result);
    return result.rows;
}
module.exports = {createStudent, getStudentByAadhar, updateStudentDetails, deleteStudentDetails, getAllActiveStudentDetails};