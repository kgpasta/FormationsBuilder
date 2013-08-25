$(document).ready(function(){
    var width = $(".col-lg-6").width();
    var height = width * 3/4;
    var stageManager = new StageManager();
    var stage = new Kinetic.Stage({
        container: "Formations",
        width: width,
        height: Math.ceil(height)
    });
    stage.add(generateGridLayer(width,height));
    stage.add(new Kinetic.Layer({
        id: "DancerLayer"
    }));
    
    $("#CreateDancer").click(function(){
        var name = $("#DancerName").val();
        var gender = $("input:radio[name=gender]:checked").val();
        var group = $("#group").val();
        stageManager.addDancer(new Dancer(name,gender,group));
        render(stage,stageManager);
    });
    
    $("#EditDancer").click(function(){
        var node = $("#EditDancers :selected");
        var name = $("#EditDancerName").val();
        var gender = $("input:radio[name=EditGender]:checked").val();
        var group = $("#EditGroup").val();
        stageManager.editDancer(node.val(),name,gender,group);
        render(stage,stageManager);
    });
    
    $("#DeleteDancer").click(function(){
        var node = $("#DeleteDancers :selected");
        stageManager.deleteDancer(node.val());
        render(stage,stageManager);
    });
    
});

function generateGridLayer(width,height){
    var gridLayer = new Kinetic.Layer({
        id: "GridLayer"
    });
    var increment = width / 20;
    for(var ii = 0; ii <= width; ii = ii + increment){
        var sWidth = 0.2;
        if(ii == width / 2){
            sWidth = 0.5;
        }
        var YgridLine = new Kinetic.Line({
            points: [ii, 0, ii, height],
            stroke: "blue",
            strokeWidth: sWidth
        });
        gridLayer.add(YgridLine);
    }
    increment = height / 20;
    for(ii = 0; ii <= height; ii = ii + increment){
        var sHeight = 0.2; 
        if(ii == height / 2){
            sHeight = 0.5;
        }
        var XgridLine = new Kinetic.Line({
            points: [0,ii, width, ii],
            stroke: "blue",
            strokeWidth: sHeight
        });
        gridLayer.add(XgridLine);
    }
    return gridLayer;
}

function render(stage,stageManager){
    var dancerLayer = stage.get("#DancerLayer")[0];
    dancerLayer.removeChildren();
    emptyTable();
    var dancers = stageManager.getDancers();
    for(var ii = 0; ii < dancers.length; ii++){
        addTable(dancers[ii]);
        addDropDown();
        dancerLayer.add(renderDancer(stage,dancers[ii]));
    }
    stage.draw();
}

function renderDancer(stage,dancerObj){
    var dancer = null;
    var color = colorChooser(dancerObj.getGroup());
    var sides = 4;
    if(dancerObj.getGender() == "Female"){
        sides = 8;
    }
    dancer = new Kinetic.RegularPolygon({
        name: dancerObj.getName(),
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        sides: sides,
        radius: stage.getHeight() / 40,
        fill: color,
        stroke: color,
        strokeWidth: 3,
        draggable: true
    });
    dancerObj.setCurrentPosition(stage.getWidth() / 2,stage.getHeight() / 2);
    attachEventHandlers(stage,dancer,dancerObj);
    
    return dancer;
}

function attachEventHandlers(stage,dancer,dancerObj){
    dancer.on("dragstart",function(){
        selectDancer(this,stage); 
    });
        
    dancer.on("dragmove", function(){
        });
        
    dancer.on("dragend", function(){
        var x = roundPositionX(stage.getWidth(),this.getPosition().x);
        var y = roundPositionY(stage.getHeight(),this.getPosition().y);
            
        var tween = new Kinetic.Tween({
            node: this, 
            duration: 0.1,
            x: x,
            y: y
        });
        tween.play();
        
        dancerObj.setCurrentPosition(x,y);
    });
        
    dancer.on("click", function(){
        selectDancer(this,stage);
    });
        
    //Table Common Selection
    $("tr").unbind();
    $("tr").click(function(){
        var name = $($(this).children("td")[0]).text();
        selectTable(name);
        selectDancer(stage.get("." + name)[0],stage);
    });
}

function selectDancer(dancer,stage){
    var dancers = stage.getChildren()[1].getChildren();
    for(var ii = 0; ii < dancers.length; ii++){
        dancers[ii].setStroke(dancers[ii].getFill());
    }
    if(dancer != null){
        dancer.setStroke("black");
        selectTable(dancer.getName());
        stage.draw();
    }
}

function colorChooser(group){
    if(group == "1"){
        group = "#70BFFF";
    } else if(group == "2"){
        group = "#FF7575";
    } else if(group == "3"){
        group = "#CE8CFA";
    }
    return group;
}

function colorToGroup(group){
    if(group == "#70BFFF"){
        group = "1";
    } else if(group == "#FF7575"){
        group = "2";
    } else if(group == "#CE8CFA"){
        group = "3";
    }
    return group;
}

function roundPositionX(width,n){
    var increment = width / 40;
    var remainder = n % increment;
    if(remainder < increment / 2){
        n = n-remainder;
    } else{
        remainder = increment - remainder;
        n = n + remainder;
    }
    return n;
}

function roundPositionY(height,n){
    var increment = height / 40;
    var remainder = n % increment;
    if(remainder < increment / 2){
        n = n-remainder;
    } else{
        remainder = increment - remainder;
        n = n + remainder;
    }
    return n;
}