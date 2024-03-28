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
        console.log("first if: "+PlayerName.name+" Roles: "+PlayerName.role)
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
            console.log("add "+PlayerName.name+" to role support")
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
              console.log('denying '+PlayerName.name+' role '+PlayerName.role[i])
              deniedroles++;

              console.log('we reach here')
              console.log('length: '+PlayerName.role.length)
              if(PlayerName.role.length==2){ //if player only has one more role they can play, add that to a role lock

                console.log('we reach here2')
                let role=PlayerName.role[0]

                switch(role) {
                  case "Tank":
                    //regardless of team size, it should check if role is filled
                    if(this.filledroles.filter(x => x === role)) { //if only role left for player is afilled role, error- go back to getting new player
                      console.log("player "+ PlayerName.name +" cannot queue for role "+role)
                      console.log("could not add player")
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
                      console.log("player "+ PlayerName.name +" cannot queue for role "+role)
                      console.log("could not add player")
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
              console.log("Team is full,!") //call create team function? -> this hsould be below balance roles
              //this.balanceroles() //we need to reach here
              console.log("balance roles")
              let result=this.balanceroles2() //if this is false it kicks a player, with no role or the last player
              if (result!=null && result !=true) { //meaning the algo returned a player value. also mean swe weren't able to balance roles with current team and will need to pick again
                return result //we'll need to roll again
              }
              console.log("Team is good to go!")
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
    if (!this.isteamfull()) { //if the team isn't full, allow player to be queud for every role
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
    console.log("filled roles length:"+this.filledroles.length)
    console.log("filled role:"+this.filledroles)
    
    if(!this.filledroles){ //if there aren't any filled roles, there's nothing to balance
      console.log('no filled roles, returning')
      return null
    }

    for(let i = 0; i<this.players.length;i++) { //For every player in the team...
      let player=this.players[i] //player

      if (player.queuedroles.length>1) { //if they have more than one role,
        let arr2=this.filledroles
          player.queuedroles = player.queuedroles.filter(function(val){return (arr2.indexOf(val) == -1 ? true : false)}) //find the player's queued roles that are filled (in filledroles array)

          console.log('we reach here, new queued roles for '+ player.name+': '+player.queuedroles)

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
              if(!playerpool.filter(a => a === player) || !playerpool2.filter(a => a === player) ) {
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
      console.log('done balancing role')
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
        console.log("Filled Role Check: "+filledroles[i])
        let filledroletemp=this.filledroles[i] //each loop run is damage, dps, etc.
          for(let x = 0; x < this.players.length; x++) {//scroll through all the players
              let playertemp=this.players[x]
              console.log(playertemp.role.length)
              if (playertemp.role.length>1) {//check if a player has more than one role...
                  for (let y = 0; y < playertemp.queuedroles.length; y++) {//check through all the roles the player has

                      let roles=playertemp.queuedroles[y]
                      if (roles == filledroletemp){ //if they have a role that is already filled
                          console.log('we reach here')
                          console.log('player: '+playertemp.name)
                          console.log('player role: '+roles)
                          console.log('current queued role: '+filledroletemp)

                          console.log('delete role: '+role)
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
    playerpool = playerpool.filter(a => a !== player)//delete player out of playerpool
    //console.log("playerpool: "+playerpool)
    return player; //should pop a specific index
}

function create_team(teamid, size=5, roleblock=true, maxteams,rerollamount=0){  // you have to put a team id in!
  console.log("player pool1:"+playerpool)
  //console.log(playerpool)
    console.log("playerpool2: "+playerpool2)
    let team = new Team(teamid, size, roleblock)
    for (let i = 0; i < size; i++){ //allows dynamic change of team size in event of player kick
      if (playerpool.length == 0){  // if there's not enough players in player pool, stop
          console.log("exiting for loop in create_team, ran out of players in pool:(")
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
              console.log("returned null, pushing: "+player+"to player pool2")
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
      console.log('we reached here')
      if(team.players[i]==null || team.players[i]==undefined || team.players[i]=="undefined"){
        console.log('we reached here2')
        console.log("kicking null player: "+team.players[i])
        team.players= team.players.filter(a => a !== team.players[i]);
      }
    }

    console.log("team length "+team.players.length);
    console.log("team max size: "+size);
    console.log("player pool length: "+playerpool.length);

    if(team.players.length=size) {
      console.log("here are the team players (since its 5?: "+team.players)
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

function checkplayerrejects(){ //baj appears twice in this array list?
    rejects = playerpool
    console.log("Rejects:"+rejects) //does the same thing
    // for (let i = 0; i < rejects.length; i++){
    //     console.log(rejects[i])
    // }
    // return rejects  //(print this out?)
}

function printteam(team){//// make a function that returns a team based off id
  for(let i = 0; i< team.players.length; i++) {//for(let i = 0; i< team['players'].length; i++) {
    var player=team.players[i]// var player=team['players'][i]
    //print(f"{players}, {players.queuedroles}") 
    console.log(player.name + ", " + player.queuedroles)// {players.rank}
  //print(team.rank)  
  }
}

function createteams(teamamount, size=5, rolelock=true){
  for (let i = 0; i < teamamount; i++) {  // create team with id until id = maxteams
     // save team into a variable such as team 1, team 2, etc. -> can you automate variablenames?
     team1 = create_team(i, size, rolelock,teamamount)
     console.log("Team "+(i+1)+":") //we want i+1 because we dont want a team 0
     printteam(team1)
     console.log()
  }
  
  checkplayerrejects()
  //rejects=playerpool //set playerpool to rejects pool
  console.log("player pool: "+playerpool)
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
add_to_playerpool(p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12)
//console.log(masterplayerpool)
//printteam(create_team(1,5))//this is not wokring right so...



//createteams2(2,5) //this will not work right
createteams(2,5)
//filesave())