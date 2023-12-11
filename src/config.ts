import "dotenv/config";
const {
 PORT,
 pgConnection
} = process.env;



const objeto =  {
 port: PORT,
 urlConnection: pgConnection
}

export = objeto;