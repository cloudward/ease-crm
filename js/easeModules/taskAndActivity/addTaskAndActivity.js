/**
 * Created by shivali.patel on 7/8/14.
 */
function onReferenceAutoComplete(event) {


    var search = $('#reference-id-auto-complete').val();

    var moduleId=$('input:radio[name=moduleId]:checked').val();


    if(moduleId==taskAndActivityModuleId.CONTACT){

        autoCompleteChanged(search, "reference-id-auto-complete-div", "/contacts/_contact_auto_complete_data", event.keyCode);

    }
    else if(moduleId==taskAndActivityModuleId.ACCOUNT){

        autoCompleteChanged(search, "reference-id-auto-complete-div", "/accounts/_account_auto_complete_data", event.keyCode);
    }
    else if(moduleId==taskAndActivityModuleId.LEAD){

        autoCompleteChanged(search, "reference-id-auto-complete-div", "/leads/_lead_auto_complete_data", event.keyCode);
    }
}

function addReferenceVal(event,name,id){

    $("#reference-id-auto-input").val(id);
    $("#reference-id-auto-complete").val(name);
    $("#reference-id-auto-complete-div").css("display", "none");

}

function onContactClick(event, name, id) {
    addReferenceVal(event, name, id);
}
function onLeadClick(event, name, id) {
    addReferenceVal(event, name, id);
}
function onAccountClick(event, name, id) {
    addReferenceVal(event, name, id);
}

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

function disableReference(flag){
//    if("<#[url.id]#>"==""){
        if(flag){
            $('#reference-id-auto-complete').prop('disabled', true);
            $('#reference-id-auto-complete').removeAttr('required');
            $('#reference-id-auto-input').removeAttr('required');

        }
        else{
            $('#reference-id-auto-complete').prop('disabled', false);
            $('#reference-id-auto-complete').prop('required', true);
            $('#reference-id-auto-input').prop('required', true);

        }
        $("#reference-id-auto-input").val("");
        $("#reference-id-auto-complete").val("");
//    }

}

function setCompletedAndStatus(){

    var addedAdVal=$('#taskOrActivity').val();

    if(addedAdVal==taskAddedAs.TASK){

        $('#completed_at').val("");

        $("#status").val(taskAndActivityStatus.PENDING_TASK);
    }
    else if(addedAdVal==taskAddedAs.ACTIVITY){
        var dueDate=$("#dueDateInput").val();

        $('#completed_at').val(dueDate);

        $("#status").val(taskAndActivityStatus.COMPLETED_TASK);
    }

    //console.log("completedAt "+ $('#completed_at').val());
    //console.log("status"+ $('#status').val());

}

function setModuleId(){
    var moduleId=$('input:radio[name=moduleId]:checked').val();
    $("#module-id-input").val(moduleId);
}

function setDueDateField(){
    $('#dueDateInput').val(moment($('#dueDateInput').val(),"YYYY-MM-DD hh:mm A").format("YYYY-MM-DD HH:mm:ss"));
}

function setRemainingField(){
    setDueDateField();
    setCompletedAndStatus();
    setModuleId();
}

function setRemainingFieldAtUpdate(){
    setDueDateField();
    setModuleId();
}


function prepareModuleField(){
    var radioId="moduleId-"+$("#module-id-input").val();
    //console.log(radioId);
    $('#'+radioId).prop('checked', true);
//    $("input:radio[name=moduleId]").prop("disabled",true);
//    $("input:radio[name=moduleId]").off("click");

}

function prepareReferenceField(){

    var moduleId=$('#module-id-input').val();
    var referenceId=$('#reference-id-auto-input').val();

    if(moduleId==taskAndActivityModuleId.CONTACT){

        $.get("/contacts/_get_contact_by_id?id=" + referenceId, function(data, status) {

            data = data.trim();
            $('#reference-id-auto-complete').val(data);

        });
    }else if(moduleId==taskAndActivityModuleId.ACCOUNT){

        $.get("/accounts/_get_account_by_id?id=" + referenceId, function(data, status) {
            data = data.trim();
            $('#reference-id-auto-complete').val(data);

        });
    }else if(moduleId==taskAndActivityModuleId.LEAD){

        $.get("/leads/_get_lead_by_id?id=" + referenceId, function(data, status) {
            data = data.trim();
            $('#reference-id-auto-complete').val(data);
        });
    }
    else if(moduleId==taskAndActivityModuleId.OTHER){

        $('#reference-id-auto-complete').prop('disabled', true);
        $('#reference-id-auto-input').removeAttr('required');
        $('#reference-id-auto-complete').removeAttr('required');

    }
}

function setDueDateInRenderFormat(){
    $('#dueDateInput').val(moment($('#dueDateInput').val(),"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD hh:mm A"));
};
