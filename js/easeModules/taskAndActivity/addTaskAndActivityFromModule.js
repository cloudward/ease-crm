/**
 * Created by shivali.patel on 7/8/14.
 */


function setDateRangeForDueDate(event,addedAs){
    //var typeOfTaskOrActivity=$('#taskOrActivity').val();

    if(addedAs == taskAddedAs.TASK){
        $('#dueDate').data("DateTimePicker").setMaxDate("");
        $('#dueDate').data("DateTimePicker").setMinDate(new Date().toDateString());

    }else{

        $('#dueDate').data("DateTimePicker").setMinDate("");
        $('#dueDate').data("DateTimePicker").setMaxDate(new Date().toDateString());

    }
}


function setDueDateInRenderFormat(){
    $('#dueDateInput').val(moment($('#dueDateInput').val(),"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD hh:mm A"));
};


function setCompletedAndStatus(){
    var addedAdVal=$('#taskOrActivity').val();

    if(addedAdVal==taskAddedAs.TASK){

        $('#completed_at').val("");

        $("#status").val(0);
    }
    else if(addedAdVal==taskAddedAs.ACTIVITY){
        var dueDate=$("#dueDateInput").val();

        $('#completed_at').val(dueDate);

        $("#status").val(1);
    }

    //console.log("completedAt "+ $('#completed_at').val());
    //console.log("status"+ $('#status').val());

}


function setMaxAndMinOfDTPicker(){


    var addedAdVal=$('#taskOrActivity').val();

    if(addedAdVal == taskAddedAs.TASK){

    $('#dueDate').data("DateTimePicker").setMaxDate("");
    $('#dueDate').data("DateTimePicker").setMinDate(new Date().toDateString());

    }else{
    $('#dueDate').data("DateTimePicker").setMinDate("");
    $('#dueDate').data("DateTimePicker").setMaxDate(new Date().toDateString());

    }
}


function setDueDateField(){
    $('#dueDateInput').val(moment($('#dueDateInput').val(),"YYYY-MM-DD hh:mm A").format("YYYY-MM-DD HH:mm:ss"));
}

function setRemainingField(){
    setDueDateField();
    setCompletedAndStatus();
}