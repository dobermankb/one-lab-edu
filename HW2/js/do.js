class Transport{
    constructor(isActive){
        this.isActive = isActive;
    }

    activate(){
        this.isActive = true;
        console.log("Active");
    }

    deactivate(){
        this.isActive = false;
        console.log("deactivate");
    }

    move(){
        console.log("Moved")
    }

    getStatus(){
        return this.isActive;
    }




}

class Car extends Transport{
    constructor(seatPlaces, moveSpeed){
        this.seatPlaces = seatPlaces;
        this.moveSpeed = moveSpeed;
    }
    seatPlaces = 5;
    moveSpeed = 60;
}

class Bus extends Transport{
    constructor(seatPlaces, moveSpeed){
        this.seatPlaces = seatPlaces;
        this.moveSpeed = moveSpeed
    }
    seatPlaces = 50;
    moveSpeed = 40;
}

class Plain extends Transport{
    constructor(seatPlaces, moveSpeed){
        this.seatPlaces = seatPlaces;
        this.moveSpeed = moveSpeed;
    }
    seatPlaces = 150;
    moveSpeed = 300;

}

class Toyota extends Car{
    constructor(model, hp){
        this.model = model;
        this.hp = hp;
    }

    model = "Toyota";
    hp = 600;

    accelerate(){
        console.log("Accelerated");
    }
}

class Setra extends Bus{
    constructor(model, hp){
        this.model = model;
        this.hp = hp;
    }

    model = "Setra";
    hp = 450;

    accelerate(){
        console.log("Accelerated");
    }
}

class Boeing extends Plain{
    constructor(model, hp){
        this.model = model;
        this.hp = hp;
    }

    model = "Boeing";
    hp = 52000;

    accelerate(){
        console.log("Accelerated");
    }
}