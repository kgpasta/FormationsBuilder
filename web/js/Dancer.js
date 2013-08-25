var AnimationCoordinates = function AnimationCoordinates(name){
    this.name = name;
    this.coordinates = [null,null,null,null,null,null,null,null];
}

AnimationCoordinates.prototype = {
    getName: function getName(){
        return this.name;
    },
    setName: function setName(n){
        this.name = n;
    },
    addCoordinate: function addCoordinate(start,end,x,y){
        for(var ii = start; start < end; ii++){
            this.coordinates[ii] = [x,y];
        }
    }
}

var Dancer = function Dancer(name,gender,group){
    this.name = name;
    this.gender = gender;
    this.group = group;
    this.animations = new Array();
}

Dancer.prototype = {
    getName: function getName(){
        return this.name;
    },
    setName: function setName(n){
        this.name = n;
    },
    getGender: function getGender(){
        return this.gender;
    },
    setGender: function setGender(g){
        this.gender = g;
    },
    getGroup: function getGroup(){
        return this.group;
    },
    setGroup: function setGroup(g){
        this.group = g;
    },
    setCurrentPosition: function setCurrentPosition(x,y){
        var animation = new AnimationCoordinates()
    }
}

var StageManager = function StageManager(){
    this.dancers = new Array();
    this.frames = new Array();
}

StageManager.prototype = {
    getDancers: function getDancers(){
        return this.dancers;
    },
    addDancer: function addDancer(d){
        this.dancers.push(d);
    },
    editDancer: function editDancer(oldName,newName,newGender,newGroup){
        for(var ii = 0; ii < this.dancers.length; ii++){
            if(this.dancers[ii].getName() == oldName){
                this.dancers[ii].setName(newName);
                this.dancers[ii].setGender(newGender);
                this.dancers[ii].setGroup(newGroup);
                break;
            }
        }
    },
    deleteDancer: function deleteDancer(name){
        for(var ii = 0; ii < this.dancers.length; ii++){
            if(this.dancers[ii].getName() == name){
                this.dancers.splice(ii,1);
            }
        }
    },
    getFrames: function getFrames(){
        return this.frames;
    },
    setFrames: function setFrames(f){
        this.frames = f;
    }
}
