//************************************************** */:
// VARIABLES 
//************************************************** */:

//SETTINGS CONFIG:
var team_count = 2; //amount of teams 
var team_size = 5; //amount of players in each team //we're gonna replace this with an array
var role_lock = true; //if role lock is on or off
var reject_lock = true; //if players can be rejected if they dont fit the team's role needs. only allowed to be on if role lock is on.
var rank_lock = false; //if player rankings are to be considered.
var autosave = true; //save each player pool and team creation 

// IMAGES:
const tank_img = '<img width="10px" height="10px" src="./images/tank.png" />';
const dps_img = '<img width="10px" height="10px" src="./images/dps.png" />';
const support_img = '<img width="10px" height="10px" src="./images/support.png" />';
const all_img = '<img width="10px" height="10px" src="./images/all.png" />';

//************************************************** */:

//search for len(), count(), && remove() functions for arrays
class Team {
  constructor(teamid=1, maxplayers=5, rolelock=true) {
      if (maxplayers < 5){ //if not enough players for min classic role lock play, turn it off
          rolelock=false }
      this.teamid= teamid
      this.maxplayers = maxplayers
      this.filledroles= [] //lists what roles are filled in this team, if role lock is on
      this.achievedroles = [] // lists how many spots for each role we have
      this.rank = 0 // adds the players of all the ranks together
      this.players = []
      this.playercount = 0 // how many players are in
      this.support = 0
      this.tank = 0
      this.dps = 0
      this.rolelock = rolelock; // if true, then players will not be added to teams where their specified role is already fulfilled in a team. Set on by default
      this.forcedplayer=0; //a flag for if there are any forced players (but there really shoudlnt be unless the player pool is THAT bad)
      
  }

  toString() {
      return "Team" + this.teamid; // toString has to return the string representation
  }
//this  is not done yet
  addplayer(PlayerName) { //when it returns none, algo should try to add a different player- maybe with the needs of the team?
    this.playercount=this.playercount+1
    if (this.isteamfull()){ //if the team is full, ERROR
        console.log("ERROR: Max players reached!")  
        return false
    }
    var addedrole=0//keep track of roles for each player added
      //perform role queue for role locks. if someone chooses only one role, it will lock the role
      if (this.rolelock == true && PlayerName.role.length == 1){ //if role lock is on && team not filled yet, allow add players
        //console.log("first if: "+PlayerName.name+" Roles: "+PlayerName.role)
        for (let i = 0; i < PlayerName.role.
          length; i++){ //check if there is no  role space for this
          var roles=PlayerName.role[i]

          //Tank Roles:
          if (roles == "Tank"){ //add tank
            if (this.maxplayers == 6 && this.tank<2 && this.filledroles.filter(x  => x === "Tank").length == 0){ //if its a 6v6 && we dont have 2  tanks, allow an add of a tank
              this.tank=this.tank+1
              addedrole=addedrole+1
              this.achievedroles.push("Tank") //takes note we have an extra   player of this type available
              PlayerName.queuedroles.push(roles)//make this a role that they can  queue for
              if (this.tank ==2){ //role lock. //&& this.maxplayers == 6
                  this.filledroles.push("Tank")  
              }
            }
            else if (this.maxplayers <= 5 && this.tank == 0) {
              this.tank=this.tank+1
              addedrole=addedrole+1
              this.filledroles.push("Tank") //set tank role to filled! we can   only have 1 tank in a 5v5!
              this.achievedroles.push("Tank") //takes note we have an extra   player of this type available
              PlayerName.queuedroles.push(roles)//make this a role that they can  queue for
            }
          }

          //the below values are set to one because when it is 2, we want to deny players these roles
          //DPS Roles
          if (roles == "DPS" && this.dps <=1 && this.filledroles.filter(x => x === "DPS").length <= 1){ //add dps
            this.dps=this.dps+1
            addedrole=addedrole+1
            this.achievedroles.push("DPS") //takes note we have an extra player   of this type available
            PlayerName.queuedroles.push(roles)//make this a role that they can  queue for
            if (this.dps ==2){ //check if this role is filled, mark it. can only  happen with role lock
              this.filledroles.push("DPS") 
            }
          }


          //Support Roles
          if (roles == "Support" && this.support <=1 && this.filledroles.filter(x => x === "Support").length <=1 ){ //add Support
            this.support=this.support+1
            addedrole=addedrole+1
            this.achievedroles.push("Support") //takes note we have an extra player   of this type available
            PlayerName.queuedroles.push(roles)//make this a role that they can  queue for
            if (this.support ==2){ //check if this role is filled, mark it. can only  happen with role lock
              this.filledroles.push("Support") 
            }
            //console.log("add "+PlayerName.name+" to role support")
          }

        }

        if (addedrole==0){ //if it gets to the end of this for loop && no roles   have been added
          console.log("ERROR: Cannot add player! Role Filled (Role lock on)")
          return null
        }
        else {
            this.players.push(PlayerName)
            this.rank= this.rank + PlayerName.rank //add rank to team total

            // make sure every role is accounted for. 
            if (this.addplayercheck()==false) { //if false, we need to add a player. but the add was s false = player was booted, null = teamsize not max yet
              return false //false crreates a real roll and skips this player eaning we got an error
            } else  { //no issue, just need more players/continue/exit while loop
              return true //if true, player add was successful and team is full, exits  while loop
            } 
          }
      }
        else if (this.rolelock==true)
      { //only add player if they can fill a role not already filled, meaning   they didnt just queue for one role
        var deniedroles=0 //the amount of roles locked to this player
        let i = 0
        while (i < PlayerName.role.length || this.filledroles.length !=0) {//go   through the full list of roles queued by player; or not at all if there   are no filled roles
          if (i == PlayerName.role.length) {//if we start with i<len(playername).  break out of loop
            break;
          }

          if (this.filledroles.filter(x => x === PlayerName.role[i]).length>0)   { //if player has queued for a role already filled, note that this is a   locked role
              //console.log('denying '+PlayerName.name+' role '+PlayerName.role[i])
              deniedroles++;

              //console.log('we reach here')
              //console.log('length: '+PlayerName.role.length)
              if(PlayerName.role.length==2){ //if player only has one more role they can play, add that to a role lock

                //console.log('we reach here2')
                let role=PlayerName.role[0]

                switch(role) {
                  case "Tank":
                    //regardless of team size, it should check if role is filled
                    if(this.filledroles.filter(x => x === role)) { //if only role left for player is afilled role, error- go back to getting new player
                      //console.log("player "+ PlayerName.name +" cannot queue for role "+role)
                      //console.log("could not add player")
                      return null
                    } else {//we can add the player
                      this.achievedroles.push(PlayerName.role[0])
                      PlayerName.queuedroles.push(PlayerName.role[0])//make this a role   that they can queue for 
                      this.tank++;
                      if (this.tank ==2){ //check if this role is filled, mark it. can only  happen with role lock
                        this.filledroles.push("Tank") 
                      }
                    }
                    break;
                  case "Support":
                    //regardless of team size, it should check if role is filled
                    if(this.filledroles.filter(x => x === role)) { //if only role left for player is afilled role, error- go back to getting new player
                      console.log("player "+ PlayerName.name +" cannot queue for role "+role)
                      console.log("could not add player")
                      return null
                    } else {//we can add the player
                      this.achievedroles.push(PlayerName.role[0])
                      PlayerName.queuedroles.push(PlayerName.role[0])//make this a role   that they can queue for 
                      this.support++;
                      if (this.support ==2){ //check if this role is filled, mark it. can only  happen with role lock
                        this.filledroles.push("Support") 
                      }
                    }
                    break;

                  case "DPS":
                    //regardless of team size, it should check if role is filled
                    if(this.filledroles.filter(x => x === role)) { //if only role left for player is afilled role, error- go back to getting new player
                      //console.log("player "+ PlayerName.name +" cannot queue for role "+role)
                      //console.log("could not add player")
                      return null
                    } else {//we can add the player
                      this.achievedroles.push(PlayerName.role[0])
                      PlayerName.queuedroles.push(PlayerName.role[0])//make this a role   that they can queue for 
                      this.dps++;
                      if (this.support ==2){ //check if this role is filled, mark it. can only  happen with role lock
                        this.filledroles.push("DPS") 
                      }
                    }
                    break;
                  default:
                    console.log("error adding player to solo role...")
                    break;
                }

                
              }
          }
          else {
              this.achievedroles.push(PlayerName.role[i])
              PlayerName.queuedroles.push(PlayerName.role[i])//make this a role   that they can queue for 
            }
          i=i+1
          
        }

        // if(this.filledroles){//if its not 0
        //   for (let x=0;x<this.filledroles.length;x++){
        //     for(let y=0;y<PlayerName.role.length;y++)
        //     {
        //       if(PlayerName.role[y]==this.filledroles[x])//if player queued for a role already filled, note thisis locked role
        //       {
        //         console.log('denying '+PlayerName.name+' role '+PlayerName.role[i])
        //         deniedroles++;
        //       }
        //       else {
        //         this.achievedroles.push(PlayerName.role[i])
        //         PlayerName.queuedroles.push(PlayerName.role[i])//make this a role   that they can queue for 
        //       }
        //     }
        //   }

          if (deniedroles==PlayerName.role.length){
            console.log("player queued for roles already filled!")
            return null 
          }
          else { //if roles for player not already filled, then add player to t he   team!
            this.players.push(PlayerName)
            this.rank= this.rank + PlayerName.rank

           // make sure every role is accounted for. 
            if (this.addplayercheck()==false) { //if false, we need to add a player. but the add was s false = player was booted, null = teamsize not max yet
              return false //false crreates a real roll and skips this player eaning we got an error
            } else  { //no issue, just need more players/continue/exit while loop
              return true //if true, player add was successful and team is full, exits  while loop
            } 
            
          }
       // }
      }

  //if role lock is off, add player regardless
  if (this.rolelock == false){ //if role lock is off,quickplay open queue: just check that the team isnt at max capacity yet
    this.players.push(PlayerName)
    this.rank= this.rank + PlayerName.rank
    
    for (let i = 0; i< PlayerName.role.length; i++) {
      roles=PlayerName.role[i]

      if (roles == "Tank"){
        this.tank=this.tank+1
        this.achievedroles.push("Tank") //takes note we have an extra player of this type available
      }  
      if (roles == "DPS"){
        this.dps=this.dps+1
        this.achievedroles.push("DPS") //takes note we have an extra player of this type available
      }
      if (roles == "Support"){
        this.support=this.support+1 
        this.achievedroles.push("Support") //takes note we have an extra player of this type available
      }
    return true
      }
    }  
  }

  isteamfull() {
      if (this.maxplayers==this.players.length){ //we hav to add +1 because it doesnt count 0
           return true }
      return false
  }

  addplayercheck() { //true = sucessfully made team, null = need more players, false means error, find new player
      if (this.isteamfull()==true){ //if the team is full
          var result = this.checkteamroles() //and if every role is accounted for
          if (result==true){ // ...if every role is accounted for
              //console.log("Team is full,!") //call create team function? -> this hsould be below balance roles
              //this.balanceroles() //we need to reach here
              //console.log("balance roles")
              let result=this.balanceroles2() //if this is false it kicks a player, with no role or the last player
              if (result!=null && result !=true) { //meaning the algo returned a player value. also mean swe weren't able to balance roles with current team and will need to pick again
                return result //we'll need to roll again
              }
              //console.log("Team is good to go!")
              return true  //player check successful, team is good to go
            } 
          else { //if every role is not accounted for, return null
              console.log("we are missing a {result[1]}!") 
              let player=this.players.pop()
              if(!playerpool.filter(a => a === player) || !playerpool2.filter(a => a === player) ) {
                console.log("player is not in either player pull, so saving them: "+player.name)
                playerpool2.push(player) //save to pp2

              }
              else {
                console.log("player "+player.name+"already exists in playerpool. not kicking")
              }
              
              console.log("kicking last player added: "+player.name)
              //this.balanceroles2() //balance the roles and kick a player who is double queued? may not need to add this
              return false } //return statemnetS: FALSE= failed player check, kick player and add new one
      }
  return null 
  //console.log("team not full")
  }

  force_addplayer(PlayerName) {
    if(PlayerName==null) {
      console.log("Attempted to force add null player?")
      return false;
    }
    if (this.isteamfull()==false) { //if the team isn't full, allow player to be queud for every role
      this.players.push(PlayerName) //MAKE SURE THIS WORKS?
      this.filledroles.push("Tank") //set tank role to filled! we can   only have 1 tank in a 5v5!
      this.achievedroles.push("Tank") //takes note we have an extra   player of this type available
      PlayerName.queuedroles=PlayerName.role;//make all roles they queued for available to them
      
      //if player was forced through, the team should be flagged wiht this
      this.forcedplayer++;
      this.rank= this.rank + PlayerName.rank //be sure the change team rank!
      
    for(let i=0; i<PlayerName.role.length; i++) {
      let role=PlayerName.role[i];
      console.log("force added player "+ PlayerName.name +" to role "+role)
      this.achievedroles.push(PlayerName.role[i])
      
      //keep track of how many of each role we have
      switch(role) {
        case "Tank":
            this.tank++;
          break;
        case "Support":
          this.support++;
          break;
        case "DPS":
            this.dps++;
          break;
        default:
          console.log("error forcing adding player role...")
          return false;
          //break;
        }
      } 
      PlayerName.queuedroles.push("FORCED"); //push a flag letting the client know, this player was forced 
      console.log("successfully forced player "+PlayerName.name+" through")
      return true; //sucess
    }
    console.log("team is already full, no need to force add player "+PlayerName.name+"!");
    return false
  }

  checkteamroles(){ //i believe i will kep this simple, because the addplayers method already accounts for filled roles
    //Do we have all roles accounted for? 
    
    // 6v6. Returns missing role
    if (this.maxplayers==6){
      if (this.achievedroles.filter(x => x === "Tank").length<2){
        return (false, "Tank") }
      else if(this.achievedroles.filter(x => x === "DPS")<2){
        return (false, "DPS") }
      else if(this.achievedroles.filter(x => x === "Support")<2){
        return (false, "Support")}
      else if(this.achievedroles.filter(x => x === "Tank")==2){ //this doesnt work && can be deleted
        return true} //make algo to accept this value
      return true
    }
    
    //5v5, same thing
    if (this.maxplayers==5){
      if (this.achievedroles.filter(x => x === "Tank").length==0){
        return (false, "Tank") }
      else if(this.achievedroles.filter(x => x === "DPS")<2){
        return (false, "DPS") }
      else if(this.achievedroles.filter(x => x === "Support")<2){
        return (false, "Support")}
      else if(this.achievedroles.filter(x => x === "Tank")==1){ //this doesnt work && can be deleted
        return true} //make algo to accept this value
      return true
    }
    
  }

  balanceroles2() {
    //console.log("filled roles length:"+this.filledroles.length)
    //console.log("filled role:"+this.filledroles)
    
    if(this.filledroles.length==0){ //if there aren't any filled roles, there's nothing to balance
      //console.log('no filled roles, returning')
      return null
    }

    for(let i = 0; i<this.players.length;i++) { //For every player in the team...
      let player=this.players[i] //player

      if (player.queuedroles.length>1) { //if they have more than one role,
        let arr2=this.filledroles
          player.queuedroles = player.queuedroles.filter(function(val){return (arr2.indexOf(val) == -1 ? true : false)}) //find the player's queued roles that are filled (in filledroles array)

          //console.log('we reach here, new queued roles for '+ player.name+': '+player.queuedroles)

          if(player.queuedroles.length=1){ //if player only has one role left, lock that role and re-run balance roles 2 just in case
            let role=player.queuedroles[0];
            //console.log(player.queuedroles)
            if(player.queuedroles[0]==null)
            {
              //kick player! reroll!
              console.log('player: '+player.name+" has no more available queued roles. kicking!")
              //let arr = this.team.Players 
              //this.players= this.players.filter(a => a !== player);
              
              //console.log(this.players) //for some reason, it's this.players instead of this.team.players
              //save to other playerrpool,  normally done in main methhod but no way to return player here.
              
              //console.log("new team pool:"+this.players)
              //playerpool2.push(player)
              if(playerpool.filter(a => a === player) ==false || playerpool2.filter(a => a === player) ==false ) {
                console.log("player is not in either player pull, so saving them: "+player.name)
                playerpool2.push(player) //save to pp2

              }
              else {
                console.log("player "+player.name+"already exists in playerpool. not kicking")
              }
              return false; //this means we have a player who can not fit into the team. balance roles was unsucessful //return player so that way they can be kicked
            }
            switch (role) {
              case "Tank":
                
                if(this.maxplayers==6 && this.tank<2) { //if its a 6v6, allow two tanks to be filled
                  
                  this.tank++;
                  if(this.tank==2){
                    this.filledroles.push("Tank")
                  }
                } else if (this.tank==0){ //only allow one tank, so it has to already be 0
                  this.filledroles.push("Tank")
                  this.tank++;
                } else { //if we reach here, both of the above are filled olres
                  console.log("player "+player.name+"is STILL queued for role "+ role+" that is already filled")
                  break;
                }
                break;
              case "DPS":
                if (this.dps<2){ //only allow 2 solo queud dps (thats what this.dps keeps track of)
                  
                  this.dps++;
                  if(this.dps==2){
                    this.filledroles.push("DPS")
                  }
                } else { //if we reach here, both of the above are filled olres
                  console.log("player "+player.name+"is STILL queued for role "+ role+" that is already filled")
                }
                break;
              case "Support": //same methodology for above
                if (this.support<2){
                
                  this.support++;

                  if(this.support==2){
                    this.filledroles.push("Support")
                  }
                } else { //if we reach here, both of the above are filled olres
                  console.log("player "+player.name+"is STILL queued for role "+ role+" that is already filled")
                }
                this.support++;
                break;
              default:
                console.log('error balancing roles, we shouldnt reach here!')
                break;
            }

          }

          //but  if it =0, return null? 
      }
      //console.log('done balancing role')
    }
    return true //it was a success
  }

  //so here's my notes on the problem
            //when i delete a queued role for the player,t he index size goes down
            //this prematurely sets y=player.queuedroles.length
            //is there a way to allow the loop to finish its iterations
            //and simply put deniedroles=[] the role name
            //then it can match the denied roles to the queued roles separately and delete them from the array after the loop
            //we can then say, if queued roles is empty after we pop the queud roles = denied roles, then we cannot use this player, and we will return null

            //what SHOULD happen is upon returning null in balanceroles2()
            //the if statment in addplayertoteam() should take the null, and likewise pass a null from the add player method
            //this will then go to the main function call, and the main function call will try to add a player again from the pool (this functionality should already be working)
            //however, we should make sure that the loop ends when there are no more players in the pool to choose from that matches the standards

            //if player pool is 0, push the player anyway and make a note with a flag that they do not fit team reuqiremtns but you are out of players to choose from in terms of this algorithm's random iteration

  balanceroles(){//removes a player's queued roles if already filled
    if (this.filledroles){
      for(let i = 0; i < this.filledroles.length; i++){ //for all the filled roles
        //console.log("Filled Role Check: "+filledroles[i])
        let filledroletemp=this.filledroles[i] //each loop run is damage, dps, etc.
          for(let x = 0; x < this.players.length; x++) {//scroll through all the players
              let playertemp=this.players[x]
              //console.log(playertemp.role.length)
              if (playertemp.role.length>1) {//check if a player has more than one role...
                  for (let y = 0; y < playertemp.queuedroles.length; y++) {//check through all the roles the player has

                      let roles=playertemp.queuedroles[y]
                      if (roles == filledroletemp){ //if they have a role that is already filled
                          //console.log('we reach here')
                          //console.log('player: '+playertemp.name)
                          //console.log('player role: '+roles)
                          //console.log('current queued role: '+filledroletemp)

                          //console.log('delete role: '+role)
                          index=playertemp.queuedroles.indexOf(roles) //remove it from their queue-able roles
                          playertemp.queuedroles.splice(index,1)
                      }
                  }        
              }
          }
      }
    }
  }

  getplayers(){
  return this.players
  }
  removeplayer(player){
  return this.players
  }
  getteamid(){
  return this.teamid
  }

  //age() {
  //    const date = new Date();
  //    return date.getFullYear() - this.year;
  //  }
}

class Player{
  constructor(name, role=["Tank", "DPS", "Support"], rank=0) {
    //super().__init__()//how to make this a subclass?
    this.name = name
    this.role = role
    this.rank = rank //i can get this from overwatch?
    this.queuedroles = [] //these are the roles that the player can queue as for the team
  }
  
  toString() {
    return this.name;
  }
}

//**************** ABOVE IS TEAMS.PY TRANSLATION  *******************/

//********* dummy data ******** */
//1,2,3, 3=best, 1=not so best
const p1 = new Player("Ejay", ["Tank","DPS", "Support"], 2)  // i could use numbers for roles
const p2 = new Player("Jade", ["Support"], 3)  // i could use numbers for roles
const p3 = new Player("Shane", ["Support"], 3)  // i could use numbers for roles
// i could use numbers for roles
const p4 = new Player("Meredith", ["Tank"], 2)
const p5 = new Player("Squilly", ["Tank","DPS"], 1)  // i could use numbers for roles
const p6 = new Player("Luke", ["Tank","DPS","Support"], 3)  // i could use numbers for roles
const p7 = new Player("Nick", ["Tank","Support"], 3)  // i could use numbers for roles
const p8 = new Player("Baj", ["DPS","Support"], 2)  // i could use numbers for roles
const p9 = new Player("Wanda", ["Support"],1)  // i could use numbers for roles
// i could use numbers for roles
const p10 = new Player("Mike", ["DPS"], 2)
const p11 = new Player("Kyle", ["Tank","Support"], 3)  // i could use numbers for roles
const p12 = new Player("Moses", ["DPS","Support"], 3)  // i could use numbers for roles


//**************** BELOW IS SCRIPT.PY TRANSLATION  *******************/
//** global variables */
var masterplayerpool = []  // this is all players
var playerpool = []  // these are players who may be popped
var playerpool2 = []
// this is left over players, append this to player pool after a team has been created
var rejects = []  // players who could not be fit into the game with criteria
var maxteams = 0  // these are how many teams you want to split the player pool into
var masterdictionary =null
var teams = []
var team1 = ""  // fix this to be dynamic later
var team2 = ""
var index =0
var save = []
var runtime = 0 //how many time program was created
// console.log(p2)
// console.log('ok')

function add_to_playerpool(...Players) {
  for (let i=0 ; i < Players.length; i++) { //for every player
    if (Players[i] instanceof Player){ //make sure the input is of type 'Player'
      //console.log(Players[i])//["name"])
      masterplayerpool.push(Players[i])
      playerpool.push(Players[i])
    }
  }
 

  //AT END OF FOR LOOP, I SHOULD SAVE MASTER PLAYERPOOL TO A FILE
}

function remove_from_playerpool(playername) {

  for (let i = 0; i<playerpool.length;i++) {
    //console.log(playerpool[i]["name"]);

    if(playerpool[i]["name"]==playername) {
      playerpool.splice(i, 1); //TODO: Make error to where you cant add two of the same names
    }
  }
  
  displayplayerpool();
}

function clear_playerpool() {
  playerpool =[];
  displayplayerpool();
}


function choose_random_player(){  // maybe make a clause, if number has already been chosen, dont choose it again for this instance? theres w ayt od ot his
    //playerpool=playerpool.split(',');
    max = playerpool.length-1  // this gives an error sometims, invesitage
    if (max < 1) { //was: if max<1
        max=0; //max = 0
      }
    //number =  Math.floor((Math.random() * max)); //could do +1 ); for range (1,max)
    //console.log('player pool')
    //console.log(playerpool) //for some reason, the player pool array is not working.... hmm 
    //console.log(playerpool)
    //console.log(typeof playerpool)

    let player = playerpool[Math.floor(Math.random()*playerpool.length)] //find random player
    //console.log(player.name)
    //delete player out of playerpool
    //console.log("playerpool: "+playerpool)
    return player; //should pop a specific index
}

function deleteplayer_from_playerpool(player){
  playerpool = playerpool.filter(a => a !== player);
}

function attempt_add_player(player,temp_availableroles,temp_team) {

  let success=false; //has player been added?
  let roles=player.queuedroles;
  

  for (let i=0; i<roles.length;i++) { //iterate through all roles

    let role=roles[i]; 
    let team_element=[role, player.name]; //e.g. [Support, JOHNDOE]

    switch (role) { 
      case "Tank":
        //check if role is available
        if (temp_availableroles[0]==0) 
          break;

        //add player to team
        --temp_availableroles[0];
        temp_team.push(team_element);
        success==true;
        break;
    
      case "DPS":
          //check if role is available
          if (temp_availableroles[1]==0) 
            break;

          //add player to team
          --temp_availableroles[1];
          temp_team.push(team_element);
          success==true;
          break;

    
      case "Support":
            //check if role is available
            if (temp_availableroles[2]==0) 
              break;

            //add player to team
            --temp_availableroles[2];
            temp_team.push(team_element);
            success==true;
            break;

      default:
        break;
    }
  }

  return temp_availableroles,temp_team,success;
}

function create_team(teamid, size=team_size, roleblock=role_lock, maxteams=team_count,rerollamount=0){  // you have to put a team id in!
  //console.log("player pool1:"+playerpool)
  //console.log(playerpool)
    //console.log("playerpool2: "+playerpool2)
    let team = new Team(teamid, size, roleblock)



    //get 5 random players in a temp array
    //set available role array [Tank],DPs,DPS,Support or simply variables: dps = 2

    //for each player in array
      //add solo players first and remove from temp array

    //for each player in array
      //add double queued players and remove from temp array

    //for each player in array
      //add all players and remove from temp array


    //for every player in temp array, replace them with random player.
      //if player fits in a role, add player, otherwise role again

    //if available roles = 0, team is full, and remove all players from player pool.

    //add players to team


    //at the end, if there are any players left in player pool, set them to rejects.

    //+==========================================

    //get 5 random players in a temp array
    let temp_random_playerpool = [];

    for (let i = 0; i < size; i++) {
      let player=choose_random_player();
      temp_random_playerpool.push(player);
    }

    //set available role array [Tank],DPs,DPS,Support or simply variables: dps = 2
    let temp_availableroles=[2,2,2]//Tank,DPS,Support
    let temp_team=[];
    if(size == 5) {
      temp_availableroles[0]=1;
    }

    //for each player in array
    for (let i = 0; i < temp_random_playerpool.length; i++) {
        let player=temp_random_playerpool[i];

        //add solo players first and remove from temp array
        if (player.queuedroles.length==1) {
          
          temp_availableroles,temp_team,success=attempt_add_player(player,temp_availableroles,temp_team);

          //if unsucessful add, do something
          if (success==false) {

          }

          //if successful remove from player queue?
          
        }

    }

    //once its gone through the for loop, for every player in team, remove from player pool.
    //remove player from pool
    temp_random_playerpool = temp_random_playerpool.filter(a => a !== player);
      

    //for each player in array
      //add double queued players and remove from temp array

    //for each player in array
      //add all players and remove from temp array


    for (let i = 0; i < size; i++){ //allows dynamic change of team size in event of player kick
      if (playerpool.length == 0){  // if there's not enough players in player pool, stop
          //console.log("exiting for loop in create_team, ran out of players in pool:(")
          break
        }

      let player = choose_random_player() // save random player (because they are removed now)
      let outcome = team.addplayer(player)  //outcome will be true upon success or false upon error team full, null for player denied->request new one

      if(outcome==false) { //if add player returns false then there was an error: team prob full
        break;
      }

      while (outcome == null){ //keeps trying to add a player until it is successful (until outcomr isnt null)
          if (outcome != null){  // if the outcome wasnt none to begin with, break out of this loop
            break
          }

          // if there's not enough players in player pool, stop. This means some teams may not produce 5
          if (playerpool.length == 0){
              break
          }

          // if outcome was none, put player into player pool 2 so they are not removed from game
          if (outcome == null){
              // saves player back into separate player pool for use just in case
              //console.log("returned null, pushing: "+player+" to player pool2 \n") //THIS IS VERY IMPORTANT COMMENT
              playerpool2.push(player)
          }
          
          if (outcome == false && team.players.length<5){
            //pass;//outcome=null; //encountered error, had to kick a player, dont save them, reroll; continue
        }
          player = choose_random_player()  // get new player
          // otherwise, keep trying to add a player
          if(player==null){
            console.log("tried to add a null player: "+player)
            break;
          }
          outcome = team.addplayer(player)
        }    
    }

    // return the reject players back into player pool. (What if they get rejected twice?)
    // console.log("A: player pool1:")
    // console.log(""+playerpool)

    // console.log("B: player pool2:")
    // console.log(""+playerpool2)
    playerpool=playerpool.concat(playerpool2)

    //make sure team isnt null
    for(let i=0; i<team.players.length;i++){
      //console.log('we reached here')
      if(team.players[i]==null || team.players[i]==undefined || team.players[i]=="undefined"){
        //console.log('we reached here2')
        console.log("kicking null player: "+team.players[i])
        team.players= team.players.filter(a => a !== team.players[i]);
      }
    }

   //console.log("team length "+team.players.length);
    //console.log("team max size: "+size);
    //console.log("player pool length: "+playerpool.length);

    if(team.players.length=size) {
     // console.log("here are the team players (since its 5?: "+team.players)
    }

    //PROEBLM: Players are disappearing from player pool, and force add is not adding two players when needed, only one when short. also are there ghost players in a team? its saying of team size 5 when there are only 4 printing out.
    //OTHER PROBLEM: the below function fails too, because if playerpool is 0, then it wont attempt to force add...

    if(team.players.length<size && playerpool.length != 0){ //if team is not full, and we have players to choose from. we need to re-roll
      if(rerollamount>0) { //if this is already our second role push a player anyway, force push a player
        let player = choose_random_player() // save random player (because they are removed now)
        result=team.force_addplayer(player)
        console.log("force adding player "+player.name+" result: "+result)
      } else { //if reroll amount is not greater than 0 (if its 0), re-reoll and call this function again
      rerollamount++;
      create_team(teamid,size,roleblock,maxteams,rerollamount)
      }
    }

    if(teamid == (maxteams-1) ) { //if this is the last team, push whatever player is left? i think the last if statement handles that 
      //
    }

    //BALANCE TEAMS FUNCTION HERE

    // console.log("final product: " +playerpool)
    // if player.rejectionamount == self.teamid (depending on how many teams there is, if its team 3 and rejection 3, or team 2 and rejection 2)
    // or simply, if this is the last iteration of team creation and the player is still in pool...save to rejects list

    //i can move this below function to createteams function
    //if (teamid == (maxteams-1)){  // if this is the last team to be created. its maxteams-1 because arrays //start at 0
    //    checkplayerrejects()  // save rejected players to list called rejects and show to user
    //    // we want to save rejects even if its null, to stay concurrent with the teams
    //}
    teams.push(team)  //saves team
    return team
}

//BALANCE TEAMS FUNCTION HERE

function BalanceTeam() {

  //for every role in the team:
    //if the player in that role (Filter array!=>player.roles) does not have queued roles for that role //AND if player in that role is queued for all, take them out into separate all array
        //put them in temp player array
        //set role as empty
        //put role in temp unsatified role array
  
  //if temp array is <=1, return True -> team is balanced

  //for every role in the unsastified array
      //and for every player in the temp player
            //if player is queued for all and it this is the last unsatisfied role, set player to role and return True
            //else if player is queued for all, skip player

            //for every role this player is queud for
                //if player.role = unsatisfied role
                    //set player to role
                    //take player out of the unsatisfied role
                    //take unsastified role 
                //else do nothing
      
    //if temp player array <=1, 
      //add player to role and return True -> team is balanced
      //else if >1 and unsatified array 


    //Extra: CHECK REJECTS
    //if theres a player in rejects also in team, take them out
    //if there's a player in an unsatisfactory role AND a player in rejects that satisfies said role, swap them

  //if team is still not balanced, run algo again but this time for players with multiple queued roles, if their role 
  //is the role that someone else wants, see if they can swap places. 
  
  //or pop all players with two roles, assign players with one role first, then two roles, then all roles.

}



function checkplayerrejects(){ //baj appears twice in this array list?
    rejects = playerpool
    //FOR DEBUGGING PURPOSES, UN-COMMENT OUT ALL THE CONSOLE.LOGS IN THIS HERE FUNCTION (especially the deep nested for loops)
    //console.log("Rejects:"+rejects) //does the same thing

    //if rejects are in team one or two, take them out of rejects pile
    for (let i = 0; i < rejects.length; i++){
      
        //let reject=rejects[i]//console.log(rejects[i])
        //filter
        for(let x = 0; x < teams.length;x++){ //check every team for a rejects
          for(let y=0; y < teams[x].players.length;y++){
            if(teams[x].players[y] == rejects[i]) {
              //console.log("player "+ rejects[i] + " is in team "+(x+1)) //1 because we want it to say team 1 or team 2
              rejects= rejects.filter(a => a !== rejects[i]);
              //console.log("removed player from rejects")
              //delete player
            }
          }
          //the old function
          //if(teams[x].players.filter(x => x === rejects[i]).length >= 1){
          //  console.log(rejects[i] + "shows up in teams "+x)
          //  //delete player from rejects
          //}

        }
    }

    //if they show up twice, make them show up once
    const counts = {};
    rejects.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

    for(let i=0; i<rejects.length; i++){
      if(counts[rejects[i]]>1) {
        //console.log(rejects[i] + " shows up "+ counts[rejects[i]] +" times")
        let index=rejects.indexOf(rejects[i]) //get index of duplicate
        rejects.splice(index,1); //deletes duplicate reject (indexOf shows up once if duplicate, returns first instance)
        //make reject show up once
      }
    }

    console.log("Rejects:"+rejects) //does the same thing
    //return rejects  //(print this out?)
}

function printteam(team){//// make a function that returns a team based off id
  for(let i = 0; i< team.players.length; i++) {//for(let i = 0; i< team['players'].length; i++) {
    var player=team.players[i]// var player=team['players'][i]
    //print(f"{players}, {players.queuedroles}") 
    try {
    console.log(player.name + ", " + player.queuedroles)// {players.rank}
    }
    catch {
      console.log('could not print player '+i)
      team.players.splice(i,1,choose_random_player()) //adds player if they are not in the list
      playerpool.push(player) //add mystery player back to player pool (do they get deleted?)
      rejects.push(player)
    }
  //print(team.rank)  
  }
}

function createteams(teamamount=team_count, size=team_size, rolelock=role_lock){
  for (let i = 0; i < teamamount; i++) {  // create team with id until id = maxteams
     // save team into a variable such as team 1, team 2, etc. -> can you automate variablenames?
     team1 = create_team(i, size, rolelock,teamamount)
     console.log("Team "+(i+1)+":") //we want i+1 because we dont want a team 0
     printteam(team1)
     console.log('\n')
     //displayteams(team1,i);
     
  }
  checkplayerrejects()
  //rejects=playerpool //set playerpool to rejects pool
  //console.log("player pool: "+playerpool)
  //console.log(playerpool)

  //console.log("rejects:")
  //console.log(rejects)

  // checkplayerrejects()
  // the below saves the date but is deprecated
  // data["Teams"]=teams
  // data["Rejects"]=rejects //save rejects (should be same date/time or index as save team) 
  // writetojson(teamsavedict, "teams.json")
  return null
}

function createteams2(teamamount, size=5, rolelock=true){
  
  team1=create_team(1,size,rolelock)
  console.log("Team 1:")
  printteam(team1)
  console.log("player pool:")
  console.log(playerpool)
  //for (let i = 0; i < teamamount; i++) {  // create team with id until id = maxteams
  //    // save team into a variable such as team 1, team 2, etc. -> can you automate variablenames?
  //    team1 = create_team(i, size, rolelock)
  //    console.log(team1)
  //    console.log()
  //}
  //checkplayerrejects()
  //the below saves the date but is deprecated
  //data["Teams"]=teams
  //data["Rejects"]=rejects //save rejects (should be same date/time or index as save team) 
  //writetojson(teamsavedict, "teams.json")
  return null
}
//const myCar = new Car("Ford", 2014);
//document.getElementById("demo").innerHTML =
//"My car is " + myCar.age() + " years old.";

//const myCar2 = new Car("Audi", 2019);



//************ MAIN FUNCTION CALLS BELOW */
// //******

//console.log(masterplayerpool)
//printteam(create_team(1,5))//this is not wokring right so...




function addnewplayer(name,roles=["Tank","DPS", "Support"],rank=0.0) {

//split up roles, for roles in roles, make it a tuple?
if (roles=="all"){
  roles==["Tank","DPS", "Support"]
} else if (roles != ["Tank","DPS", "Support"]) {
  //split roles by ,
  //put in touple
}

if (rank == "Rank" || rank == 0.0) { //if no rank, give random value
  rank = "None";
}

  //const player = new Player("Ejay", ["Tank","DPS", "Support"], 2) 
  const player = new Player(name, roles, rank) 
  add_to_playerpool(player)
}


function validateAddPlayerform() {
  //window.alert()
  let name = document.forms["addPlayerForm"]["name"].value;
  let rank = document.forms["addPlayerForm"]["rank"].value;
  if (name == "") {
    alert("Name must be filled out");
    return false;
  }

  if (rank == "Rank" || rank == 0.0) { //if no rank, give random value
    rank = "None";
  }
  
  // if (role lock = ON ) && all checkboxes are blank, error alert: need to enter a role of turn of roles in the config section
  //same thing for rank 

  //set roles to an array, and iterate through to see which is true
  let roles=[];
  let tank = document.forms["addPlayerForm"]["cb1"].checked;
  let dps = document.forms["addPlayerForm"]["cb2"].checked;
  let support = document.forms["addPlayerForm"]["cb3"].checked;
  let all = document.forms["addPlayerForm"]["cb4"].checked;
  temproles=[tank,dps,support,all];
  //alert(temproles)

  for (let i = 0; i<temproles.length;i++) {
    if(temproles[i]) {
      switch (i) {
        case 0:
          roles.push("Tank")
          break;
        case 1:
          roles.push("DPS")
          break;
        case 2:
          roles.push("Support")
          break;
        case 3:
          roles.push("All")
          break;
      }
    }

    if(i==4 && (roles.length==3 || roles.length==0)) { // on last loop, if all roles are queued or none are, assign all role
      roles=["All"];
      console.log('we reach here???')
    }
  }

    if (roles.length==0) {
      roles=["All"];
    }

  //let words = document.getElementById("playerpool")
  //words.innerHTML="peepee" //error, this does not display peepee after page loads. ill have to read/save these valuessomewhere? run a server?
  //alert('player: '+name+' roles: '+roles+ ' rank '+rank)
  let player = new Player(name, roles, rank) 
  //add_to_playerpool(player)
  add_to_playerpool(p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12)
  displayplayerpool();
  //printdata
  clearForm()
}

function printdata() {

  displayplayerpool();
  displayteams();
  displayrejects();
  
}

function displayplayerpool() {
  let writing=""

  for (let i = 0; i<playerpool.length;i++) {
    let player=playerpool[i]["name"]
    let playervar="'"+player+"'" //var to pass remove from playerpool button 
    writing=writing+'<a style="color:red;" onclick="remove_from_playerpool('+playervar+')"> x </a><div class="popup"><span>'+player+'</span> <div class="popup-content"><p> Rank: '+playerpool[i]["rank"]+'<br></p></div></div> '+roles_to_img(playerpool[i]["role"])+'</div><br>';


    //if ranks are off, dont show ranks on scroll
  }
  //if rank is on, append rank
  //if ra

  //if roles are on, append role

  //write to doc as <td><tr> etc.
  let words = document.getElementById("playerpool")
    words.innerHTML=writing
}


function roles_to_img(roles) {  
  let images='';

  for (let i = 0; i<roles.length;i++) {

    //if there are three roles, just set it to all
    if (roles.length==3) {
      return all_img;
      
    }

    switch(roles[i]) {
      case "Tank":
        images=images+tank_img;
        break;
      case "DPS":
        images=images+dps_img;
        break;
      case "Support":
        images=images+support_img;
        break;
      case "A": //this breaks the function for some reason
        console.log('we reach here:')
        console.log(roles[i])
        images=''; //destroy whatever roles are in images
        images=images+all_img;
        break;
      default:
        images=''; //destroy whatever roles are in images
        images=images+all_img;
        break;
    }
//new problem, it keeps setting all of the player roles to 'ALL'

    //console.log(images)
    //images=images+roles[i]+","
  }
  return images;
  //alert(writing)

}

function displayrejects() {
  let writing=""

  for (let i = 0; i<rejects.length;i++) {
    let player=rejects[i]["name"]
    let playervar="'"+player+"'" //var to pass remove from playerpool button 
    writing=writing+'<div class="popup"><span>'+player+'</span> <div class="popup-content" style="color: black;" ><p> Rank: '+rejects[i]["rank"]+'<br></p></div></div> '+roles_to_img(rejects[i]["role"])+'</div><br>';


    //if ranks are off, dont show ranks on scroll
  }
  //if rank is on, append rank
  //if ra

  //if roles are on, append role

  //write to doc as <td><tr> etc.
  let words = document.getElementById("rejects")
    words.innerHTML=writing
}


//delete from playerpool

//check data stuff

function clearForm() { //
  document.getElementById("addPlayerForm").reset();
}

function clearPlayerPool() {
  playerpool=[]; //empty player pool
  document.getElementById("playerpool").innerHTML=""; //reset writing display
}

function clearRejects() {
  rejects=[]; //empty player pool
  document.getElementById("rejects").innerHTML="None"; //reset writing display
}

function HTMLcreateTeams() { //execute and display team creation. Error: not enough players?
  createteams(team_count,team_size);
  displayteams();
  displayrejects();
  saveData();
} //also disable until you reach min players?

function HTMLcreateTeams6v6() { //execute and display team creation. Error: not enough players?
  createteams(2,6);
  displayteams();
  displayrejects();
  saveData();
}

function displayteams() {
//
  for (let j = 0; j<teams.length;j++) { //iterate through teams
    var teamid=j+1;
    for (let i=0; i<teams[j].players.length;i++) { //iterate through each team players
      html_id="Team"+teamid+"p"+(i+1); //<p id="Team2p1">Player 1</p> creates the id needed. this creates variable ids!!!! or variable variables! variables that chan change and have their name altered and be created
      // var player=team['players'][i]
      //print(f"{players}, {players.queuedroles}") 
      var team = teams[j]
      try {
      //console.log(player.name + ", " + player.queuedroles)// {players.rank}
        var player=team.players[i]
        var player_name=player.name
        console.log(player_name)
        var player_roles=player.role; //team.players[i].queuedroles //player.queuedroles;
        var player_rank=player.rank;
        
        document.getElementById(html_id).innerHTML=('<div class="popup"><span>'+player_name+'</span> <div class="popup-content"><p style="color: black;"> Rank: '+player_rank+' <br> '+roles_to_img(player_roles)+'</p></div></div></div><br>'); 
        //document.getElementById(html_id).innerHTML=('<div class="popup"><span>'+player_name+'</span> <div class="popup-content"><p> Rank: '+player_rank+' '+roles_to_img(player_roles)+'<br></p></div></div> '+roles_to_img(player_roles)+'</div><br>'); 
        
      }
      catch {
        console.log('could not print player '+i)
        //alert('error creating teams: code 0x005');
        //break;
      } finally {
        console.log(html_id);
      }
      //how to target specific team?
      
  
    
    }
  }
}

function RandomizeTeams() {
  //teams=[];
  //playerpool=masterplayerpool;
  reset_variables();
  createteams(team_count,team_size);
  displayrejects();
  displayteams();
  saveData();
  readData();
}

function RandomizeTeams6v6() {
  //teams=[];
  //playerpool=masterplayerpool;
  reset_variables();
  createteams(2,6);
  displayrejects();
  displayteams();
  saveData();
  readData();
}

function reset_variables() {
  playerpool=masterplayerpool;
  //playerpool = []  // these are players who may be popped
  playerpool2 = []
  // this is left over players, append this to player pool after a team has been created
  rejects = []  // players who could not be fit into the game with criteria
  maxteams = 0  // these are how many teams you want to split the player pool into
  masterdictionary =null
  teams = []
  team1 = ""  // fix this to be dynamic later
  team2 = ""
  index =0
  save = []
  runtime = 0 //how many time program was created
}

function saveData() {
  //get time 
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  //var time= today.getHours() + ":" + today.getMinutes() + ":" + String(today.getSeconds()).padStart(2, '0');
  let time = today.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit'
    });
  today = mm + "/" + dd + "/" + yyyy+" - "+time;

  // Create an object
  const userData = {
    time: today, //"03282024",
    teams: teams,
    playerpool: masterplayerpool,
    rejects: rejects
  };

  // Store the object into storage
  localStorage.setItem(today, JSON.stringify(userData));

}

function readData() {
  for (i = 0; i < localStorage.length; i++) {
    x = localStorage.key(i);
    document.getElementById("Teamhistory").innerHTML += "<option value='"+x+"'>"+x+"</option>";
    //console.log(x);
    //console.log();
  }

}


function Check_History_Team_Size(data) { //creates 6v6 or 5v5 teams based on save
  teams=data["teams"];
  if (teams[0].players.length==6) { //if 6v6
    //window.alert('we reach here');
    document.getElementById("team1").innerHTML=team1_6v6HTML;
    document.getElementById("team2").innerHTML=team2_6v6HTML;
  } else { //if 5v5
    document.getElementById("team1").innerHTML=team1_5v5HTML;
    document.getElementById("team2").innerHTML=team2_5v5HTML;
  }
}


function showData() { //how to show 6v6 vs. 5v5 ?
  //let key="03282024-2:50:42"; //test value 
  let key=document.forms["historyForm"]["Teamhistory"].value;
  let data = JSON.parse(localStorage.getItem(key));
  //console.log(data["teams"]);
  Check_History_Team_Size(data); //change html to 5v5 or 6v6 size

  teams=data["teams"]
  playerpool=data["playerpool"]
  rejects=data["rejects"]
  printdata();
  document.getElementById("history_date-time").innerHTML=key;
}
//6v6 button?
//use action listener for the select html
//use for loop to print the local storage keys, and upon selection it will execute printdata/sow data 



function toggleContactModal() {
  document.getElementById("ContactModal").classList.toggle('is-active');
}

function toggleAboutModal() {
  document.getElementById("AboutModal").classList.toggle('is-active');
}

//displayplayerpool()
//eerytime it adds new player, print the list from add new playters into that div 

//addnewplayer('ejay')
//console.log(playerpool[0])ow 

//createteams2(2,5) //this will not work right
//add_to_playerpool(p1,p2,p3,p4,p5,p6,p7)
//createteams(2,5) //******** */
//filesave())



//NEXT TODO:
//sometimes it doesn't print the last player in a team (most likely because its missing but the team doesnt recognize that?)
//comment out line760 try -catch statement to replicate the latest and only error in the script
//the other thing i noticed is that there will be 3 players in rejects when a team is missing a player. how should i go about fixing this? in checkrejects()? force_addplayer?
//sometimes people dont have a queued role while being in a team (fix?)
//function to transfer player ranks to values
//add randomize team function? wen team is already done, hit randomize to change it up
//add config options
//make buttons disabled; i.e. create teams if not enough players, have popup rhat says you dont have enough players; either add more or hange this is n the config settings at top left
// i.e. randomize - cant randomize until you have a team (does same thing on i=0 first button press of create teams)
//i.e. save srttings - disabled if you didnt actually change any settings
//cap team size at 6 and team amount?

//make a settings button next to create teams with options:
//increase team amount and team size 5/6 (new page gets loaded)
//and ranks on or off. do circumnavigate roles, everyone can just be on all
//it will auto save each team created
//export doesn't need to be there


//css ideas:
//lock teams and players, put a little lock icon next to team 1 and to the top left hand corner of each player box. This will lock in each team so the user can keep some things static

//if someone wants to change roles of a player already in player pool,
//they'll have to simply delete player and add them again with proper roles
//p.s. hovering over rejects doesn't show their rank





//******************************************************* */
//HTML VARIABLES //
const team1_6v6HTML= '<div style="padding:5px;" class="columns is-centered is-mobile"> <div id="t1p1" style="border:1px solid black;" class="auto  column"> <div id="t1p1icon"> <img src="./images/tank.png" width="20px" height="20px"></div><p id="Team1p1">Player 1</p></div><div id="t1p2" style="border:1px solid black;" class="auto column"><div id="t1p2icon"><img src="./images/tank.png" width="20px" height="20px"></div><p id="Team1p2">Player 2</p></div><div id="t1p3" style="border:1px solid black;" class="auto column"><div id="t1p3icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team1p3">Player 3</p></div><div id="t1p4" style="border:1px solid black;" class="auto column"><div id="t1p4icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team1p4">Player 4</p></div><div id="t1p5" style="border:1px solid black;" class="auto column"><div id="t1p5icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team1p5">Player 5</p></div><div id="t1p6" style="border:1px solid black;" class="auto column"><div id="t1p6icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team1p6">Player 6</p></div>';
const team2_6v6HTML= '<div style="padding:5px;" class="columns is-centered is-mobile"> <div id="t2p1" style="border:1px solid black;" class="auto  column"> <div id="t2p1icon"> <img src="./images/tank.png" width="20px" height="20px"></div><p id="Team2p1">Player 1</p></div><div id="t2p2" style="border:1px solid black;" class="auto column"><div id="t2p2icon"><img src="./images/tank.png" width="20px" height="20px"></div><p id="Team2p2">Player 2</p></div><div id="t2p3" style="border:1px solid black;" class="auto column"><div id="t2p3icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team2p3">Player 3</p></div><div id="t2p4" style="border:1px solid black;" class="auto column"><div id="t2p4icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team2p4">Player 4</p></div><div id="t2p5" style="border:1px solid black;" class="auto column"><div id="t2p5icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team2p5">Player 5</p></div><div id="t2p6" style="border:1px solid black;" class="auto column"><div id="t2p6icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team2p6">Player 6</p></div>';
const team1_5v5HTML='<div style="padding:5px;" class="columns is-centered is-mobile"><div id="t1p1" style="border:1px solid black;" class="auto  column"><div id="t1p1icon"> <img src="./images/tank.png" width="20px" height="20px"></div><p id="Team1p1">Player 1</p></div><div id="t1p2" style="border:1px solid black;" class="auto column"><div id="t1p2icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team1p2">Player 2</p></div><div id="t1p3" style="border:1px solid black;" class="auto column"><div id="t1p3icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team1p3">Player 3</p></div><div id="t1p4" style="border:1px solid black;" class="auto column"><div id="t1p4icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team1p4">Player 4</p></div><div id="t1p5" style="border:1px solid black;" class="auto column"><div id="t1p5icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team1p5">Player 5</p></div></div>';
const team2_5v5HTML='<div style="padding:5px;" class="columns is-centered is-mobile"><div id="t2p1" style="border:1px solid black;" class="auto  column"><div id="t2p1icon"> <img src="./images/tank.png" width="20px" height="20px"></div><p id="Team2p1">Player 1</p></div><div id="t2p2" style="border:1px solid black;" class="auto column"><div id="t2p2icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team2p2">Player 2</p></div><div id="t2p3" style="border:1px solid black;" class="auto column"><div id="t2p3icon"><img src="./images/dps.png" width="20px" height="20px"></div><p id="Team2p3">Player 3</p></div><div id="t2p4" style="border:1px solid black;" class="auto column"><div id="t2p4icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team2p4">Player 4</p></div><div id="t2p5" style="border:1px solid black;" class="auto column"><div id="t2p5icon"><img src="./images/support.png" width="20px" height="20px"></div><p id="Team2p5">Player 5</p></div>';

