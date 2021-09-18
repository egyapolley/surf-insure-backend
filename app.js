const oracledb = require('oracledb');

try {
    oracledb.initOracleClient({libDir: '/Users/mac/Documents/Personal Projects/instantclient_19_8'});
} catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
}

let connection;


async function fetchDeviceInfo(msisdn) {
    try {
        connection = await oracledb.getConnection({
            user: "SELFCARE2",
            password: "chrischris",
            connectString: "172.25.34.139:1521/CRMPRDB"

        })
        console.log("Connection successful")
        let sql=`select * from  siebel.SEARCHSIM2 where msisdn=:msisdn`
        const result=await connection.execute(sql,["233255030602"])

        for (const resultElement of result.rows) {
            console.log(resultElement)

        }

    } catch (ex) {
        console.log(ex)
    } finally {
        try {
            await connection.close();
            console.log('close connection success');
        } catch (ex) {
            console.log(ex.message);
        }

    }

}

(async function (){
    await fetchDeviceInfo("233255000102")

})()


