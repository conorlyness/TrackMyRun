# TrackMyRun

Project to enable you to log all of your runs, view and edit them and even upload your images to view them in the gallery.

Sql will need to be installed locally and you will need to add the databases username and password into a .env file which you can place in the root of the server folder. Inside your .env file, add two variables: 
  1. DB_USER = <your username to log into your sql db>
  2. DB_PASSWORD = <your password to log into your sql db>

Copy the contents of this text file and execute this as a new sql query in sql server management studio to create the DB along with its required tables:  
[SQL_RunTracker_DB_Creation.txt](https://github.com/conorlyness/TrackMyRun/files/9560646/SQL_RunTracker_DB_Creation.txt)



<ul>Starting the server
    <li>CD into server folder</li>  
    <li>run npm install</li>
    <li>run npm start to start the server</li>  
</ul>

<ul>Starting the client
    <li>CD into client folder</li>  
    <li>run npm install</li>
    <li>run ng serve to start the client </li>  
    <li> if you would like to run the angular app in electron, run the commmand, npm run electorn </li>
</ul>


![logRun](https://user-images.githubusercontent.com/56432950/190747476-357e18b9-afb1-43c8-9229-f2d8e8f040e4.png)


![runLog](https://user-images.githubusercontent.com/56432950/190747512-a75b8a2c-c943-445d-92c9-305b848294cb.png)



