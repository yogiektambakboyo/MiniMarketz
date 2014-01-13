============================
 **** MiniMarketz v0.1 ****
============================

Application for management businees flow in your mini market. it use frond end and back End technology with API port for acccessing public share. in frond end it use html5 and angularJS with single page application (SPA) concept.

In back end iam using NodeJS, ExpressJS and MongoDB as database. it very fast access and scalable for developing tommorow. and it's Totoally free.

====================
How to install it?
====================

Required :
------------------

 1. NodeJS (http://nodejs.org/download/)
 2. MongoDB (http://www.mongodb.org/downloads)
 3. Internet connection for download npm modules like expressJS, mongoose etc. But this optional if you have this modules in your PC just copied in folder /MiniMarketz. list of modules are required can you finded in file package.json

-----------------
Installation
-----------------

 1. Install mongoDB. follow this tutorial in this http://docs.mongodb.org/manual/installation/
 2. After instal run mongoDB via CMD with type "mongod". don't close this cmd!!!
 2. Install NodeJS setup file
 2. Download this repository and extract it.
 3. Open new Command Prompt / CMD and goto in folder which you extract repository.
 4. If you have Internet connection just type "npm  install" without "". it will be download node modules from npm. wait until finished
 5. if you dont have internet connection be sure you already copied node modules in this repository folder
 6. Start application with type "npm start" or "node app.js"
 7. Import file json in folder MiniMarketz/db/*.json to mongodb
 8. To import use this command "mongoimport -db angularapp -c dataroles your-directory-filejson/filename.json"
 9. Always add suffix "s" for collection in mongoDB. for example you have file datapegawai.json, in mongodb you must create collection datapegawais
 10. After finish import open browser and type http://localhost:3000 or your IP PC on port 3000(ex : 192.168.1.2:3000). it will display login page.
 11. Login with user name : admin and password : admin for admininstrator user or username : operator  and password operator for officer user.
 12. Goood luck and i hope this app useful for u . If you have any question please email me at yogiektambakboyo@gmail.com
