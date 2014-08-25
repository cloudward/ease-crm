/**
 * Created by shivali.patel on 7/17/14.
 */
var urlVal, parameterObj, keysOfParameter, sortFieldObj = {}, taskAndActivityFilterCriteria = [], dirtyFlagForFilter, oldSearchValue = "";
$(document).ready(function () {
    urlVal = window.location.pathname;

    parameterObj = getParameterToJSON() || {};
    keysOfParameter = Object.keys(parameterObj);


    if (keysOfParameter.length) {
        for (var i = 0, len = keysOfParameter.length; i < len; i++) {
            $('#combo-' + keysOfParameter[i]).val(parameterObj[keysOfParameter[i]]);
        }
    }

    $('#taskAndActivityFilter').on('show.bs.modal',function(){
        resetAllTaskAndActivityFilterComponent();
        setCriteria(taskAndActivityFilterCriteria);
    })


    // retrieve taskAndActivity Data
    retrieveTaskAndActivityData();
})

function onDeleteTaskAndActivity(taskId) {
    if (confirm("Are you sure, you want to delete this Task Or Activity?") == true) {
        window.location.href = "/taskAndActivities/deleteTaskAndActivity?id=" + taskId + "&redirectUrl=1";
    }
}


/*function onSearchChange() {

 var search = $('#search-input').val();

 var url = prepareUrl("_taskAndActivity_list", keysOfParameter, "search", parameterObj);
 //     console.log(url);

 url += "search=" + search;

 $.get(url, function (data, status) {
 $("#taskAndActivityTableContainer").html(data);
 })


 }*/


function changeStatus(id, status) {

    status = (status == 1) ? 0 : 1;
    var currentTime = "";
    if (status == 1) {
        currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        ;

    }
    var currentUrl = prepareUrl(urlVal, keysOfParameter, "", parameterObj);
    var url = "/taskAndActivities/updateStatusOfTaskAndActivity.espx?id=" + id + "&status=" + status;
    url += "&valueForRedirect=" + currentUrl + "&currentTime=" + currentTime;
    //console.log(url);
    window.location.href = url;

}


/*
 function onComboStatusChange() {
 var status = $('#combo-status').val();
 if (status != "") {
 var url = prepareUrl(urlVal, keysOfParameter, 'status', parameterObj);
 window.location.href = url + "status=" + status;
 } else {
 var url = prepareUrlForEmpty(urlVal, keysOfParameter, 'status', parameterObj);
 window.location.href = url;
 }

 }
 */


function setBgColorForDueDate(dueDate, elemId) {
    var diff = compareWithCurrentDt(dueDate, "YYYY-MM-DD HH:mm:ss");
    if (diff > 0) {
        $("#" + elemId).addClass("overDueDate");
    } else {
        $("#" + elemId).addClass("dueDateIn");
    }

}


function sortField(fieldName, defaultSortField, sortByContext) {

    var url = "_taskAndActivity_list?";

    url = sortingCommonFun(fieldName, defaultSortField, url, sortFieldObj);

    url += "sortBy=" + fieldName + "&sortOrder=" + sortFieldObj[fieldName];

    if (sortByContext) {
        url += "&sortByContext=" + sortByContext;
    }

    var urlParam = url.replace("_taskAndActivity_list?", "");

    window.history.replaceState({}, '', "taskAndActivities?" + urlParam); // change parameter into url

    $.get(url, function (data, status) {
        $("#taskAndActivityTableContainer").html(data);

    })

}
function applyFilter() {
    taskAndActivityFilterCriteria = [];


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        taskAndActivityFilterCriteria.push(assignedTo);

    }

    if ($("#taskType_operator").val() && $("#taskType_val").val()) {

        var taskType = prepareTaskTypeObj();
        taskAndActivityFilterCriteria.push(taskType);

    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        taskAndActivityFilterCriteria.push(created_on);

    }


    if ($("#dueDate_operator").val() && ($("#dueDate_input").val() || ($("#dueDate_start_input").val() && $("#dueDate_end_input").val()))) {
        var dueDate = prepareDueDateObj();
        taskAndActivityFilterCriteria.push(dueDate);

    }

    console.log(taskAndActivityFilterCriteria);

    if (taskAndActivityFilterCriteria.length) {
        retrieveTaskAndActivityData();
        dirtyFlagForFilter = true;
    } else if (dirtyFlagForFilter) {
        dirtyFlagForFilter = false;
        retrieveTaskAndActivityData();
    }


}

function getFilterUrl(filterCriteria, clearFiler) {
    var urlParams, questionVal;

    urlParams = getUrlParamsForFilter(filterCriteria, clearFiler);
    questionVal = (urlParams != "") ? "?" : "";
    window.history.replaceState({}, '', "taskAndActivities" + questionVal + urlParams); // change parameter into current url


    // prepare Url
    return "_taskAndActivity_list.espx?" + urlParams;
}

function retrieveCommonFilterCriteria() {

    var filterCriteria = jQuery.extend(true, [], taskAndActivityFilterCriteria);

    var search = $('#search-input').val();
    if (search != "" || oldSearchValue.length > 0) {
        var searchObj = {"key": "taskAndActivitySearch",
            "value": search
        };
        filterCriteria.push(searchObj);
        oldSearchValue = search;
    } else {
        oldSearchValue = "";
    }

    return filterCriteria;
}
function setStatusVal() {
    var status = $("#combo-status").val(), questionVal;
    var url = (location.search.slice(1) != "") ? location.search.slice(1) : "";

    url = removeParamFromUrl(url, "status");
    url += ((url != "") ? "&" : "") + "status=" + status;
    questionVal = (url != "") ? "?" : "";

    window.history.replaceState({}, '', "taskAndActivities" + questionVal + url); // change parameter into current url
}

// retrieve taskAndActivity Data
function retrieveTaskAndActivityData(clearFiler) {


    var filterCriteria = retrieveCommonFilterCriteria(), filterCriteriaToString, url;

    // if filter contain any criteria ,then convert into string
    filterCriteriaToString = (filterCriteria.length) ? JSON.stringify(filterCriteria) : filterCriteriaToString;

    setStatusVal();
    url = getFilterUrl(filterCriteria, clearFiler);


    // If page is refresh,And filter flag is exits,then set parameter of filter into filter popup
    if (!filterCriteria.length && url.indexOf("fs") > -1 && !clearFiler) {
//        setFilterParamInPopup();

        var filterVal = $("#hiddenFilterParam").val();
        if (filterVal != "") {
            taskAndActivityFilterCriteria = JSON.parse(filterVal);
        }

    }


    $("#taskAndActivityTableContainer").addClass('customLoader');
    $("#taskAndActivityTableContainer").empty();

    // Ajax call for retrieving contact Data with filter
    $.post(url, {"criteria": filterCriteriaToString}, function (data, status) {

        $("#taskAndActivityTableContainer").html(data);
        $("#taskAndActivityTableContainer").removeClass('customLoader');

    })
}

function resetAllTaskAndActivityFilterComponent(){

    $('.selectpicker').selectpicker('deselectAll');

    $('#created_on').data("DateTimePicker").setValue("");
    $('#created_on_start').data("DateTimePicker").setValue("");
    $('#created_on_end').data("DateTimePicker").setValue("");

    $('#dueDate').data("DateTimePicker").setValue("");
    $('#dueDate').data("DateTimePicker").setValue("");
    $('#dueDate').data("DateTimePicker").setValue("");

    resetDisplayContext();
}

function clearFilter() {

    taskAndActivityFilterCriteria = [];

    resetAllTaskAndActivityFilterComponent();

    retrieveTaskAndActivityData(true);
}

function resetDisplayContext() {

    $("#created_on_type_2").css("display", "none");
    $("#created_on_type_1").css("display", "block");

    $("#dueDate_type_2").css("display", "none");
    $("#dueDate_type_1").css("display", "block");

}