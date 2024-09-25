const db = require('../config/db.js');
const createUsersTable = require('./tables/createUsersTable.js');
const { createEnumGender, createEnumStudentStatus, createStudentsTable } = require('./tables/createStudentsTable.js');
const createAttendenceTable = require('./tables/createAttendenceTable.js');

// Function to check if ENUM type exists
const checkEnumTypeExists = async (client, enumType) => {
  const result = await client.query(
    `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = $1)`,
    [enumType]
  );
  return result.rows[0].exists;
};

// Function to create ENUM if it doesn't exist
const createEnumIfNotExists = async (client, enumName, query) => {
  const exists = await checkEnumTypeExists(client, enumName);
  if (!exists) {
    try {
      await client.query(query);
      console.log(`Enum ${enumName} created successfully.`);
    } catch (e) {
      console.error(`Error creating enum ${enumName}:`, e);
      throw e;
    }
  } else {
    console.log(`Enum ${enumName} already exists, skipping creation.`);
  }
};

// Main database initialization function
const intilalizeDatabase = async () => {
  const client = await db.pool.connect();
  try {
    // Separate ENUM creation from the transaction to prevent issues if they already exist
    await createEnumIfNotExists(client, 'gender_type', createEnumGender);
    await createEnumIfNotExists(client, 'student_status', createEnumStudentStatus);

    // Begin the transaction after ENUM creation
    await client.query('BEGIN');
    
    // Now execute the rest of the table creation queries
    await client.query(createUsersTable);
    await client.query(createStudentsTable);
    await client.query(createAttendenceTable);
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Successfully created tables');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Creation of tables failed:', e);
    throw e;
  } finally {
    client.release();
  }
};

module.exports = intilalizeDatabase;
