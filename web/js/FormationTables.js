$(document).ready(function() {
    DancerTable = $('.table').dataTable( {
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": false
    } );
    $(".dataTables_filter").hide();
} );

function addTable(name,sex,group){
    DancerTable.fnAddData([name,sex,group]);
}

function editTable(row,name,gender,group){
    DancerTable.fnUpdate(name,row,0);
    DancerTable.fnUpdate(gender,row,1);
    DancerTable.fnUpdate(group,row,2);
}

function getTableData(row){
    var table = null;
    if(row == null){
        table = DancerTable.fnGetData();
    } else{
        table = DancerTable.fnGetData(row);
    }
    return table;
}

function selectTable(name){
    var tableNodes = DancerTable.fnGetNodes();
    for(ii = 0; ii < tableNodes.length; ii++){
        $(tableNodes[ii]).css("backgroundColor","#ffffff");
    }
    DancerTable.fnFilter(name);
    DancerTable.$("tr", {
        "filter": "applied"
    }).css("backgroundColor", "#f5f5f5");
    DancerTable.fnFilter('');
}

function deleteTable(id){
    DancerTable.fnDeleteRow(id);
}

function emptyTable(){
    DancerTable.fnClearTable();
}