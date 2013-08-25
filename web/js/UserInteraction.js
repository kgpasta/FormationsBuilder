$(document).ready(function(){
    $("#CreateModal").hide();
    $("#EditModal").hide();
    $("#DeleteModal").hide();
    $("#StageModal").hide();
    $("#AnimationBox").hide();
    $("#Stop8Count").hide();
    
    $("#CreateDancerButton").click(function(){
        $('#CreateModal').modal();
        $("#DancerName").focus();
    });
    
    $("#EditDancerButton").click(function(){
        $('#EditModal').modal();
        changeSelects();
    });
    
    $("#EditDancers").change(changeSelects);
    
    $("#DeleteDancerButton").click(function(){
        $("#DeleteModal").modal();
    });
    
    $("#LoadStage").click(function(){
        $("#StageModal").modal();
        $("#StageNameControl").hide();
        $("#StageModalSave").hide();
        $("#StageModalDelete").hide();
        $("#StageModalDownload").hide();
        $("#StageListControl").show();
        $("#StageModalUpload").show();
        $("#StageModalLoad").show();
        $("#StageList").empty();
        getAllStageNames();
    });
    
    $("#SaveStage").click(function(){
        $("#StageModal").modal();
        $("#StageListControl").hide();
        $("#StageModalLoad").hide();
        $("#StageModalDelete").hide();
        $("#StageModalUpload").hide();
        $("#StageModalDownload").show();
        $("#StageNameControl").show();
        $("#StageModalSave").show();
        $("#StageName").focus();
    });
    
    $("#DeleteStage").click(function(){
        $("#StageModal").modal();
        $("#StageNameControl").hide();
        $("#StageModalSave").hide();
        $("#StageModalLoad").hide();
        $("#StageModalDownload").hide();
        $("#StageModalUpload").hide();
        $("#StageListControl").show();
        $("#StageModalDelete").show();
        $("#StageList").empty();
        getAllStageNames();
    });
    
    var frames = 0;
    $("#NewFrameButton").click(function(){
        addFrame(stageManager);
        var action = $("<a>").attr("href","#").attr("id",frames).addClass("list-group-item").text("Frame");
        action.click(function(){
            $(".list-group-item").removeClass("active");
            var id = $(this).attr("id");
            $(this).addClass("active");
            loadFrame(stageManager,id);
        });
        $("#FrameList").append(action);
        frames++;
    });  
    
    $("#Play8Count").click(function(){
        $("#Play8Count").hide();
        $("#Stop8Count").show();
        runAnimation();
        var percentArray = [100,200,300,400,500,600,700,800];
        var ii = 0;
        bars = setInterval(function(){
            var currentTime = percentArray[ii];
            if(ii > 7){
                currentTime = 0;
                ii = 0;
                clearInterval(bars);
            } else{
                currentTime = percentArray[ii];
                ii++;
                $(".bar").css("width",currentTime + "px");
            }
        },500);
    });

    $("#Stop8Count").click(function(){
        $("#Play8Count").show();
        $("#Stop8Count").hide();
        clearInterval(bars);
        stopAnimation();
        $(".bar").css("width","0px");
    });
});

function addDropDown(){
    $("#DeleteDancers").empty();
    $("#EditDancers").empty();
    var tableData = getTableData();
    for(var ii = 0; ii < tableData.length; ii++){
        var dancer = tableData[ii][0];
        $("#DeleteDancers").append("<option id=\"" + ii + "\">" + dancer + "</option>");
        $("#EditDancers").append("<option id=\"" + ii + "\">" + dancer + "</option>");
    }
}

function changeSelects(){
    var node = $("#EditDancers :selected");
    var tableData = getTableData();
    var dataArray = tableData[node.attr("id")];
    $("#EditDancerName").val(dataArray[0]);
    $("input:radio[name=EditGender]").map(function(){
        if($(this).attr("value") == dataArray[1]){
            $(this).attr("checked","checked");
        }
    });
    $("#EditGroup").val(dataArray[2]);
}