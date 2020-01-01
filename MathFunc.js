
module.exports.randomInt = (max, min)=>{
    return min + Math.floor(Math.random() * (max - min));
}
module.exports.getRandomElem = function (arr) {
    return arr[Math.floor(arr.length*Math.random())]
}