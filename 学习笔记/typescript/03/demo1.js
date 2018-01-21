function creatPerson(per) {
    console.log(per.age);
}
var perNew = { name: "dingsheng", age: 20 };
creatPerson(perNew);
function creatAnimal(ani) {
    var aniTemp = {
        color: "yellow",
        size: 100
    };
    if (ani.color) {
        aniTemp.color = ani.color;
    }
    if (ani.size) {
        aniTemp.size = ani.size;
    }
    return aniTemp;
}
creatAnimal({ color: "red" });
