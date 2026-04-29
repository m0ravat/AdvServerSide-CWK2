# AdvServerSide-CWK1

For disclaimer: I didn't keep in mind I had to put the project in a directory for package.json to be intiailised, as a result when you cd into the cwk1 folder and run npm i, you may need to run npm audit fix --force (potentially install an extra dependency manually but I should've covered all of the ones included in my require statements - apologies in advance).

## .gitignore and .env files 

My .gitignore ignores the node_modules file as asked by the module leader, and has .emv representing my environmental variables file. I made sure not to hide it so the keys used are transparent for the assessment, after my final grade is given post moderation I will remove it to not expose that database more than necessary.    

MY_SECRET_KEY - For creating a session (random string of characters)  
DB_LINK - Connection String provided by MongoDB

## Design Decisions

I used MongoDB since it's easy to configure and flexible when making database changes in development, making it more optimal.   
I decided to keep the database relationships similar to a traditional SQL database. As a result, the only active foreign key is in the Profile table to show a one to one relationship (mandatory on one side).    
Account 1..1  -->  0..1 Profile (An account may have 0/1 profiles, but a profile will always belong to one account, making profile a child table).     
  
The data follows normalisation to avoid repetition, though I did not have the time to manage bidding or enforce the monthly limit as well as the email verification setup (apologies).   

In my project, the entry route is app.js --> accountRoutes.js --> authMiddleware --> authController (--> accountModel), ... authMiddleware --> profileRoutes --> profileController (--> profileModel).

I stored essential data in the account model, leaving the profile model for the bulk of user personal data. That way, inactive users could potentially be removed easily in the future with their accounts intact should they wish to create a new profile (stopping them from needing to create a new account entirely). 

In addition, I left alot of flexibility in making a few profile related fields optional, since the specification isn't exactly clear on what specifics must be filled out I decided to give leeway to make testing inputs easier. 

[Database Image - One to one mandatory on one side](database.png)