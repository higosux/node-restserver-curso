//=================
//Puerto
//=============
process.env.PORT = process.env.PORT || 3000;


//================
//Entorno
//==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==================
// BASE DE DATOS
//===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe';
} else {
    urlDB = 'mongodb+srv://strer:sKj72A5992GBkoU2@cluster0.gp4at.mongodb.net/cafe';
}
process.env.URLDB = urlDB;
//mongodb://localhost:27017/Cafe
//mongodb+srv://strer:sKj72A5992GBkoU2@cluster0.gp4at.mongodb.net/cafe