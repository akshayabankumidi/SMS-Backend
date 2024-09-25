
const createEnumStudentStatus = `
CREATE TYPE student_status AS ENUM ('active', 'inactive');
`;
const createEnumGender = `
CREATE TYPE gender_type AS ENUM ('F', 'M');
`;

const createStudentsTable = `
CREATE TABLE IF NOT EXISTS students(
   id SERIAL PRIMARY KEY,
   student_name VARCHAR(50)  NOT NULL,
   gender gender_type NOT NULL,
   section VARCHAR(50) NOT NULL,
   class_name VARCHAR(50) NOT NULL,
   DOB DATE NOT NULL,
   DOA DATE NOT NULL,
   AadharCard_no VARCHAR(12) UNIQUE NOT NULL,
   father_name VARCHAR(50),
   mother_name VARCHAR(50),
   status student_status DEFAULT 'active',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 

)
`;
module.exports = {createEnumGender, createEnumStudentStatus, createStudentsTable};