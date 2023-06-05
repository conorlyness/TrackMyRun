# TrackMyRun

Project to enable you to log all of your runs, view and edit them and even upload your images to view them in the gallery.

There are two options for the database, you can either use PostgreSQL or SQL Server. (Note: current configuration is using PostgreSQL so if you wish to use SQL server then the queries will need to be tweaked to use the SQL server syntax. Find these queries inside: server -> sqlQueries -> analytics.js & core.js)
The database can be installed locally or you can use an online hosted service. You will need to add the databases username, password and host into a .env file which you can place in the root of the server folder. Once you have created a .env file, add the following three variables:

1. DB_USER = <your username to log into your sql db>
2. DB_PASSWORD = <your password to log into your sql db>
3. DB_HOST = <The host for the db, eg. localhost or the address if its hosted online>

Copy the contents of this text file and execute this as a new sql query, ensure you use the query corresponding to your database choice. This will create the DB and all the required tables:  
[SQL_TrackMyRun_DB_Creation.txt](https://github.com/conorlyness/TrackMyRun/files/10513324/SQL_TrackMyRun_DB_Creation.txt)

<ul>
<h1> Starting the server </h1>
    <li>CD into server folder</li>  
    <li>run npm install</li>
    <li>run npm start to start the server</li>  
</ul>

<h1>Running the server as a Docker container</h1>
<p>If you prefer to run your server inside a container, say you want Docker to always run the server without having to manually start it.
Go ahead and:</p>
<ul>
    <li> CD into the server folder</li>
    <li>run: docker build -t <NAME GOES HERE> .</li>
    <li>run: docker build -t <NAME GOES HERE> .</li>
    <li>run: docker run --restart always -p 3001:3001 -d <NAME OF IMAGE></li>
</ul>

<ul>
<h1>Starting the client </h1>
    <li>CD into client folder</li>  
    <li>run npm install</li>
    <li>run npm run build</li>
    <li>run ng serve to start the client </li>  
    <li>if you would like to run the angular app in electron, run the commmand, npm run electorn </li>
</ul>

<h3>Troubleshooting</h3>
 NOTE: If you run into an error in the build step regarding ngx-electron. Goto the node modules file electron.service.d.ts at: 
    node_modules/ngx-electron/lib/electron.service.d.ts and comment out the 'readonly remote: Electron.Remote;' and then try to rebuild
    
*****************************************
