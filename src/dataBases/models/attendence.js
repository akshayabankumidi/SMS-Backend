const db = require('../../config/db');

const createAttendence = async (student_id, date, attendence_status) => {
    const query = `INSERT INTO attendence (student_id, date, attendence_status) 
    VALUES ($1, $2, $3) 
    RETURNING id, student_id, date, attendence_status`;
    const values = [student_id, date, attendence_status];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getAttendenceByClassAndSection = async (class_name, section, year, month) => {
  const query = `SELECT student_name, attendence_status, date
  FROM attendence 
  JOIN students ON attendence.student_id = students.id
  WHERE students.class_name = $1 
    AND students.section = $2
    AND EXTRACT(YEAR FROM date) = $3
    AND EXTRACT(MONTH FROM date) = $4`;
  
 console.log(query);
 console.log('class_name',class_name);
 console.log('values',[class_name, section, year, month]);
 const result = await db.query(query, [class_name, section, year, month]);
 return result.rows; 
};

const updateAttendenceDetails = async (newDetails, attendence_id) => {
    console.log(`${newDetails} and ${attendence_id}`);
    const fieldsWeCanUpdate = ['student_id', 'date', 'attendence_status'];
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
      UPDATE attendence
      SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    let queryValues = [attendence_id];
    for (let field of fieldsWeCanUpdate) {
      if (field in newDetails) {
        queryValues.push(newDetails[field]);
      }
    }
    const result = await db.query(query, queryValues);
    return result.rows[0];

}

module.exports = {createAttendence, updateAttendenceDetails, getAttendenceByClassAndSection};