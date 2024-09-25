const createAttendenceTable = `
CREATE TABLE IF NOT EXISTS attendence (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
  date DATE NOT NULL,
  attendence_status VARCHAR(10) CHECK (attendence_status IN ('present', 'absent', 'holiday')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
)
`;
module.exports = createAttendenceTable;