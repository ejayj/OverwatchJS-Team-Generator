
class Team {
    constructor(teamid=1, maxplayers=5) {

        this.teamid= teamid
        this.maxplayers = maxplayers
        this.rank = 0 // adds the players of all the ranks together
        this.players = []

        //this.playercount = players.length;

        this.support = [] //support players
        this.tank = []
        this.dps = []
        this.all = []
             
    }

    addPlayer(PlayerName) {

      if(this.players.length==this.maxplayers) {
        console.log("ERROR: Max players met");
        return false
        
      }

      let roles=PlayerName.role;

      for(let i=0; i<roles.length;i++) {

        switch (roles[i]) {
          case "Tank":
            if (this.tank.length<1) {
              this.players.push(PlayerName);
              this.tank.push(PlayerName);
              this.rank=this.rank+PlayerName.rank;
              return true;
            }

              break;
          
          case "DPS":
            if (this.dps.length<2) {
              this.players.push(PlayerName);
              this.dps.push(PlayerName);
              this.rank=this.rank+PlayerName.rank;
              return true;
            }
            
            break;
        
          case "Support":
            if (this.support<2) {
              this.players.push(PlayerName);
              this.support.push(PlayerName);
              this.rank=this.rank+PlayerName.rank;
              return true;
            }
            
            break;
          
          case "All": //save "All" players to the end
              this.players.push(PlayerName);
              this.all.push(PlayerName);
              this.rank=this.rank+PlayerName.rank;
              return true;

          default:
              this.players.push(PlayerName);
              this.all.push(PlayerName);
              this.rank=this.rank+PlayerName.rank;
            return true;
            
        }

      }
    }


    rankToValue(rank) { //changes rank to value
      
      switch (rank) {
        case "None":
          
          return 0;
        
        case "Bronze":
          return 1;
      
        default:
          break;
      }

    }

    isTeamFull() {
      if(this.players.length==this.maxplayers) {
        return true;
      }
      return false;
    }

    addAllPlayers(){
    for (let i=0; i<this.all.length;i++){
      let player=this.all[i];

      if(player.role=="All") {
        if (this.tank=0) {
          this.tank.push(player);
          this.rank=this.rank+PlayerName.rank;
        } else if (this.dps<2) {
          this.dps.push(player);
          this.rank=this.rank+PlayerName.rank;
        } else if (this.support<2) {
          this.support.push(player);
          this.rank=this.rank+PlayerName.rank;
        }
      }
      
    }
    }
 
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





//=========================================================





//var Team = ["Tank", "DPS", "DPS", "Support", "Support"];
var team1= new Team(1,5);

team1.addPlayer(p1);
team1.addPlayer(p2);
team1.addPlayer(p3);
team1.addPlayer(p4);
team1.addPlayer(p5);



for(let i=0;i<team1.players.length;i++) {
  console.log(team1.players[i]);
  console.log()
  console.log(team1.players.length)
}