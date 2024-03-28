# OverwatchScript
A script that randomizes teams for you that are well-balanced!

How To Use:
1. Input a list of players with their name, roles they play, their ranks (can also be custom ranks set by the user)
2. Set how many teams you want, and how many players for each team (e.g. 2 teams of 5  [set by default if null])
3. Queue roles or chose open queue, just like regular overwatch!
Once teams have been created, it will show possible roles each player can play. It will even randomize who loads into what role, just as if you were to load in an overwatch game.

Objectives:
1. Save Player Inputs via User (each user can reuse their player pools and edit them)
2. Save team creations automatically via date of creation, group by day, sort by time, and allow for favorites/custom list creation
3. Save player pool inputs and team creation outputs in a couple, so user can see their workflow (small box on right side with player pool, and team created in middle? with symbol roles under player names?)
4. Convert Current Code to Javascript
5. Create Login/User db functionality
6. Create db for player inputs (use mongodb or sql?)
7. Style the website
8. Learn what is necessary to secure data, make website safe, and then publish website


Todo:
1. Convert current python scripts into javascript! (or figure out ajax requests from javascript to run python script)
2. Choose database method for project (use sql or mongodb for json files? maybe just sql for this one)
3. Finishing objectives 1-5, 
4. Create small, basic front end css so the website's functions can be displayed (?)
5. host to github for development (?)(not full publish, just running the code. paste link here)

Ideas:
1. Maybe i can keep the python, and chat between python and javascript using json. I can input the user data and team paramaters from javascript to python via json ajax, and trigger the script. The script creates a json file anyway, so I can keep that component and create the rest in javascript if possible.