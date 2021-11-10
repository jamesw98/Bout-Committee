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

function all_sql(sql) {
    let statement = DB.prepare(sql);
    return statement.all();
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

/**
 * creates a tournament and puts it in the Tournaments table
 * @param {*} name the name of the tournament 
 * @param {*} location the location of the tournament (venue name)
 * @param {*} address1 the address of the tournament 
 * @param {*} city the city the tournament takes place in
 * @param {*} state the state the tournament takes place in
 * @param {*} zip the zip code the tournament takes place in
 * @param {*} year the year the tournament takes place
 * @param {*} address2 (OPTIONAL) the second line of the address for the tournament (suite, room #, etc)
 * @returns a result string
 */
function create_tournament(name, location, address1, city, state, zip, year, address2="") {
    if (check_if_tournament_exists(name, year)) {
        return `Tournament ${name} already exists for this year, please change the name.`
    }

    let sql = ''
    if (address2) {
        sql = `
            INSERT INTO 
                Tournaments(TournamentName, Location, Address1, Address2, City, State, Zip, Year)
            Values
                ('${name}', '${location}', ${address1}, '${address2}', '${city}', '${state}}', '${zip}', ${year})
        `
    }
    else {
        sql = `
            INSERT INTO 
                Tournaments(TournamentName, Location, Address1, City, State, Zip, Year)
            Values
                ('${name}', '${location}', '${address1}', '${city}', '${state}}', '${zip}', ${year})
        `
    }

    let result = run_sql(sql)

    if (result.changes) {
        return `Tournament ${name} successfully added`
    }
}

/**
 * checks if a tournament already is in the Tournaments table
 * @param {*} name the name of the tournament
 * @param {*} year the year for the tournament 
 * @returns the result of the query 
 */
function check_if_tournament_exists(name, year) {
    let sql = `
        SELECT
            *
        FROM
            Tournaments
        WHERE 
            TournamentName = '${name}' and Year = ${year}
    `

    return get_sql(sql)
}

function create_event(tournament_name, weapon, gender, classification) {

}

function check_if_event_in_tournament(classification, tournament_name, gender) {
    let sql = `
        SELECT 
            pkTournament
        FROM 
            Tournaments
        WHERE 
            TournamentName = '${tournament_name}'
    `
    let result = get_sql(sql) 

    if (!result) {
        return `No tournament found by the name '${tournament_name}'`
    }

    sql = `
        SELECT 
            * 
        FROM 
            Events
        WHERE
            TournamentID = ${result.pkTournament} and
            Classification = '${classification}' and
            Gender = '${gender}'
    `

    return get_sql(sql)
}

check_if_event_in_tournament('asdf', 'May Melee', 'B')