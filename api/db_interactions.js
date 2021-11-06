const DB = require("better-sqlite3")("../db/bout_committee.db");

/**
 * runs an sql query with the .run() 
 * @param {*} sql the sql query
 * @returns the result of the .run() call
 */
function run_sql(sql) {
    let statement = DB.prepare(sql);
    return statement.run();
}

/**
 * runs an sql query with the .get() function
 * @param {*} sql the sql query 
 * @returns the result of the .get() call
 */
function get_sql(sql) {
    let statement = DB.prepare(sql);
    return statement.get();    
}

/**
 * add a fencer to the Fencers table with minimal information known about the fencer
 * @param {*} first_name the first name of the fencer
 * @param {*} last_name  the last name of the fencer
 * @param {*} division   the division the fencer fences in
 * @returns a string result
 */
function create_fencer_minimal(first_name, last_name, division) {
    // check if there is a fencer with this name and division 
    let sql = `
        SELECT * 
        FROM 
            Fencers
        WHERE
            FirstName = '${first_name}' and 
            LastName = '${last_name}' and
            Division = '${division}'
    `

    let exists = get_sql(sql);
    
    // if a fencer already exists with this name and division, do not accept
    if (exists) {
        return "Fencer already exists with that name in that division! Please include a USFA membership number."
    }

    // create a new fencer in the Fencers table
    sql = `
        INSERT INTO Fencers (FirstName, LastName, Division)
            VALUES ('${first_name}', '${last_name}', '${division}')
    `;

    let result = run_sql(sql)

    if (result.changes) {
        return `Fencer, ${first_name} ${last_name} created successfully`
    }
    return `An error occurred, please contact an administrator`
}

/**
 * update a value for a fencer in the Fencers table
 * @param {*} fencer_id the ID for the fencer
 * @param {*} key the column to be updated
 * @param {*} value the value to be set
 * @returns a string result
 */
function update_fencer_value(fencer_id, key, value) {
    let sql = `
        UPDATE Fencers
        SET
            ${key} = '${value}'
        WHERE
            pkFencer = ${fencer_id}
    `;

    let result = run_sql(sql);

    if (result.changes) {
        return `Successfully updated ${key} to ${value}`
    }
}