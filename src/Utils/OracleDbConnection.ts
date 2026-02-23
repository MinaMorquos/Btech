import { RunnerProp } from "../../RunnerProp";
import oracledb = require("oracledb");

export async function updateComplaint(mobile: string) {
    try {
        // Configure OracleDB connection parameters
        const connection = await oracledb.getConnection({
            user: `${RunnerProp.ORACLE_USER}`,
            password: `${RunnerProp.ORACLE_PASSWORD}`,
            connectString: `${RunnerProp.ORACLE_CONNECT_STRING}`,
        });
        console.log("Connected to Oracle Database successfully!");

        const query = `
     query
`;

        const result = await connection.execute(query, { mobile }, { autoCommit: true });

        console.log(`Update operation completed. Rows affected: ${result.rowsAffected}`);

        // Close the connection
        await connection.close();
        console.log("Connection closed successfully.");
    } catch (error) {
        console.error("Error connecting to Oracle Database:", error);
        throw error;
    }
}