const sqlite3 = require("sqlite3").verbose();

let DB = new sqlite3.Database("../db/bout_committee.db", (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Connected to db");
    }
});

function run_sql(sql) {
    DB.run(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            return err;
        }
        return rows;
    });
}

function create_fencer_minimal(first_name, last_name, division) {
    let sql = `
        INSERT INTO Fencers (FirstName, LastName, Division)
            VALUES ('${first_name}', '${last_name}', '${division}')
    `;

    run_sql(sql);
}

function update_fencer_value(fencer_id, key, value) {
    let sql = `
        UPDATE Fencers f
        SET
            ${key} = ${value}
        WHERE
            pkFencer = ${fencer_id}
    `;

    run_sql(sql);
}

create_fencer_minimal("Test", "Fencer", "GA");