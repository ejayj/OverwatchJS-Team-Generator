console.log('FINALLU')
var Answers = [ "A", "B", "C", "D", "E","C" ];
//console.log(Answers.filter(x => x === "true").length)
let array2 = [1,2,'deleted',4,5,'deleted',6,7]
let array=["A", "C", "E", "F", "B", "D"];
Answers = Answers.filter(function(val){return (array.indexOf(val) == -1 ? true : false)})
console.log(Answers)
//let newarr = array.filter(a => a !== 'deleted')
//array intersection
//const filteredArray = array1.filter(value => array2.includes(value));