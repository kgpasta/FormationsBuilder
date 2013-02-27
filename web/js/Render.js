$(document).ready(function(){
    stage = new Kinetic.Stage({
        container: "Formations",
        width: 800,
        height: 600
    });
    var gridLayer = generateGridLayer();
    stage.add(gridLayer);
    var dancerLayer = new Kinetic.Layer();
    stage.add(dancerLayer);
    var animationLayer = new Kinetic.Layer();
    stage.add(animationLayer);

    $("#CreateDancer").click(function(){
        var name = $("#DancerName").val();
        if(name == ""){
            $(".help-inline").show();
            $("#nameControl").addClass("error");
            return false;
        }
        var gender = $("input:radio[name=gender]:checked").val();
        var group = $("#group").val();
        var starting = startingPosition($("#starting").val());
        addDancerToLayer([name,gender,group,starting],dancerLayer);
        return true;
    });
    
    $("#EditDancer").click(function(){
        var node = $("#EditDancers :selected");
        var name = $("#EditDancerName").val();
        var gender = $("input:radio[name=EditGender]:checked").val();
        var group = $("#EditGroup").val();
        var color = colorChooser(group);
        editTable(node.attr("id"),name,gender,group);
        addDropDown();
        var dancer = stage.get("." + node.val());
        dancer[0].attrs.name = name;
        if(gender == "Male"){
            dancer[0].attrs.sides = 4;
        } else{
            dancer[0].attrs.sides = 8;
        }
        dancer[0].attrs.fill = color;
        dancer[0].attrs.stroke = color;
        dancerLayer.draw();
    });
    
    $("#DeleteDancer").click(function(){
        var node = $("#DeleteDancers :selected");
        for(ii=0; ii < node.length; ii++){
            deleteTable($(node[ii]).attr("id"));
            var dancer = stage.get("." + $(node[ii]).val());
            dancerLayer.remove(dancer[0]);
            dancerLayer.draw();
            $(node[ii]).remove();
        }
    });
    
    $("#NewStage").click(function(){
        dancerLayer.clear();
        emptyTable();
        addDropDown();
    });
    
    $("#StageModalLoad").click(function(){
        var name = $("#StageList").val();
        var data = selectStage(name);
        var layers = loadScene(stage,data);
        gridLayer = layers[0];
        dancerLayer = layers[1];
    });
    
    $("#StageModalSave").click(function(){
        var name = $("#StageName").val();
        addStage(name,stage.toJSON());
    });
    
    $("#StageModalDelete").click(function(){
        var name = $("#StageList").val();
        deleteStage(name);
    });
});

function loadScene(stage,data){
    stage.removeChildren();
    stage.load(data);
    var layerPointers = [stage.getChildren()[0],stage.getChildren()[1]];
    var dancers = stage.getChildren()[1].getChildren();
    dancers = attachEventHandlers(dancers);
    emptyTable();
    for(ii = 0; ii < dancers.length; ii++){
        var gender = "Female";
        if(dancers[ii].getSides == 4){
            gender = "Male";
        }
        var group = colorToGroup(dancers[ii].getFill());
        addTable(dancers[ii].getName(),gender,group);
    }
    addDropDown();
    return layerPointers;
}

function renderDancer(dancerName,gender,color,starting){
    var dancer = null;
    if(gender == "Female"){
        dancer = new Kinetic.RegularPolygon({
            name: dancerName,
            x: starting[0],
            y: starting[1],
            sides: 8,
            radius: 20,
            fill: color,
            stroke: color,
            strokeWidth: 3,
            draggable: true
        });
    }
    else{
        dancer = new Kinetic.RegularPolygon({
            name: dancerName,
            x: starting[0],
            y: starting[1],
            sides: 4,
            radius: 20,
            fill: color,
            stroke: color,
            strokeWidth: 3,
            draggable:true
        });
    }
    attachEventHandlers([dancer]);
    
    return dancer;
}

var gridArray = new Array();
function attachEventHandlers(dancers){
    for(ii = 0; ii < dancers.length; ii++){
        dancers[ii].on("dragstart",function(){
            selectDancer(this,stage); 
            if(isAnimation()){
                gridArray = new Array();
                gridArray.push(roundPosition(this.getPosition().x));
                gridArray.push(roundPosition(this.getPosition().y));
            }
        });
        
        dancers[ii].on("dragmove", function(){
            });
        
        dancers[ii].on("dragend", function(){
            if(isAnimation()){
                gridArray.push(roundPosition(this.getPosition().x));
                gridArray.push(roundPosition(this.getPosition().y));
                addAnimationLine(gridArray,this);
            }
            var x = roundPosition(this.getPosition().x);
            var y = roundPosition(this.getPosition().y);
            this.transitionTo({
                x: x,
                y: y,
                duration: 0.1
            });
        });
        dancers[ii].on("click", function(){
            selectDancer(this,stage);
        });
        $("tr").click(function(){
            var name = getTableData(this)[0];
            var dancer = stage.get("." + name)[0];
            selectDancer(dancer,stage);
            stage.draw();
        });
    }
    return dancers;
}

function selectDancer(dancer,stage){
    var dancers = stage.getChildren()[1].getChildren();
    for(ii = 0; ii < dancers.length; ii++){
        dancers[ii].setStroke(dancers[ii].getFill());
    }
    dancer.setStroke("black");
    selectTable(dancer.getName());
}

//Needed?
function isSelected(dancer){
    if(dancer.getStroke() == "black"){
        return true;
    }
    return false;
}

function addDancerToLayer(data,layer){
    addTable(data[0],data[1],data[2]);
    addDropDown();
    var color = colorChooser(data[2]);
    layer.add(renderDancer(data[0],data[1],color,data[3]));
    layer.draw();
    return layer;
}

function generateGridLayer(){
    var gridLayer = new Kinetic.Layer();
    for(ii = 0; ii < 800; ii = ii + 40){
        var sWidth = 0.2;
        if(ii == 400){
            sWidth = 0.5;
        }
        var YgridLine = new Kinetic.Line({
            points: [ii, 0, ii, 600],
            stroke: "blue",
            strokeWidth: sWidth
        });
        gridLayer.add(YgridLine);
    }
    for(ii = 0; ii < 600; ii = ii + 40){
        var sWidth = 0.2; 
        if(ii == 280){
            sWidth = 0.5;
        }
        var XgridLine = new Kinetic.Line({
            points: [0,ii, 800, ii],
            stroke: "blue",
            strokeWidth: sWidth
        });
        gridLayer.add(XgridLine);
    }
    return gridLayer;
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

function startingPosition(start){
    var coords = new Array();
    if(start == "Left"){
        coords = [100,280];
    }else if(start == "Right"){
        coords = [700,280];
    } else{
        coords = [400,280];
    }
    return coords;
}

function roundPosition(n){
    var remainder = n % 20;
    if(remainder < 10){
        n = n-remainder;
    } else{
        remainder = 20 - remainder;
        n = n + remainder;
    }
    return n;
}

function isAnimation(){
    if($("#Play8Count").is(":visible")){
        return true;
    }
    else return false;
}

function createPath(gridArray,color,name){
    var line = new Kinetic.Line({
        name: name,
        points: gridArray,
        stroke: color,
        strokeWidth: 2,
        lineCap: "round",
        lineJoin: "round",
        dashArray: [33, 10]
    });
    return line;
}

function addAnimationLine(gridArray,dancer){
    var line = createPath(gridArray,dancer.getFill(),dancer.getName());
    stage.getChildren()[2].add(line);
    stage.draw();
}

function runAnimation(){
    var dancers = stage.getChildren()[1].getChildren();
    var lineLayer = stage.getChildren()[2];
    for(ii = 0; ii < dancers.length; ii++){
        var lines = lineLayer.get("." + dancers[ii].getName());
        dancers[ii].setX(lines[0].getPoints()[0].x);
        dancers[ii].setY(lines[0].getPoints()[0].y);
        var len = 4.5 / lines.length;
        moveDancer(len,lines,0,dancers[ii]);
    }
}

function moveDancer(len,lines,ii,dancer){
    var transition = dancer.transitionTo({
        x: lines[ii].getPoints()[1].x,
        y: lines[ii].getPoints()[1].y,
        duration: len,
        callback: function() {
            if((ii + 1) < lines.length){
                moveDancer(len,lines,ii + 1,dancer);
            }
        }
    });
    return transition;
}

function stopAnimation(){
    var dancers = stage.getChildren()[1].getChildren();
    var lineLayer = stage.getChildren()[2];
    for(ii = 0; ii < dancers.length; ii++){
        var lines = lineLayer.get("." + dancers[ii].getName());
        var len = lines.length;
        
        dancers[ii].setX(lines[len - 1].getPoints()[1].x);
        dancers[ii].setY(lines[len - 1].getPoints()[1].y);
        stage.draw();
    }
}