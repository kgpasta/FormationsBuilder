$(document).ready(function(){
    if(localStorage.getItem("stageNames") == null){
        var stageNames = new Array();
        localStorage.setItem("stageNames",JSON.stringify(stageNames));
    }
});

function addStage(name,data){
    var names = JSON.parse(localStorage.getItem("stageNames"));
    names.push(name);
    localStorage.setItem("stageNames",JSON.stringify(names));
    localStorage.setItem(name,data);
}

function getAllStageNames(){
    var names = JSON.parse(localStorage.getItem("stageNames"));
    for(ii = 0; ii < names.length; ii++){
        $("#StageList").append("<option>" + names[ii] + "</option>");
    }
}

function selectStage(name){
    var data = localStorage.getItem(name);
    return data;
}

function deleteStage(name){
    localStorage.removeItem(name);
    var names = JSON.parse(localStorage.getItem("stageNames"));
    for(ii = 0; ii < names.length; ii++){
        if(names[ii] == name){
            names.splice(ii);
        }
    }
    localStorage.setItem("stageNames",JSON.stringify(names));
}