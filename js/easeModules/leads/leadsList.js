/**
 * Created by shivali.patel on 7/17/14.
 */
var urlVal, parameterObj, keysOfParameter, sortFieldObj = {}, leadFilterCriteria = [], dirtyFlagForFilter, oldSearchValue = "";
$(document).ready(function () {

    urlVal = window.location.pathname;

    function getParameterToJSON() {
        if (location.search == "") {
            return {};
        }
        var pairs = location.search.slice(1).split('&');

        console.log(pairs);
        console.log(location.search);
        var result = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return JSON.parse(JSON.stringify(result));
    }

    parameterObj = getParameterToJSON() || {};
    keysOfParameter = Object.keys(parameterObj);

    if (keysOfParameter.length) {
        for (var i = 0, len = keysOfParameter.length; i < len; i++) {
            $('#combo-' + keysOfParameter[i]).val(parameterObj[keysOfParameter[i]]);
        }
    }

    $('#leadFilter').on('show.bs.modal', function () {
        resetAllLeadFilterComponent();
        setCriteria(leadFilterCriteria);
    })

    //retrieve lead list
    retrieveLeadData();

})

/*function prepareUrl(field) {
 var url = urlVal, flagForQuestion = false;

 url += '?';
 if (keysOfParameter.length) {

 for (var i = 0, len = keysOfParameter.length; i < len; i++) {
 if (keysOfParameter[i] != field) {
 url += keysOfParameter[i] + '=' + parameterObj[keysOfParameter[i]] + '&';
 }

 }
 }
 return url;
 }*/
/*

 function prepareUrlForEmpty(field) {
 var url = urlVal, flagForQuestion = false;


 if (keysOfParameter.length) {
 url += '?';
 for (var i = 0, len = keysOfParameter.length; i < len; i++) {
 if (keysOfParameter[i] != field) {
 url += keysOfParameter[i] + '=' + parameterObj[keysOfParameter[i]];
 if (i < len - 1) {
 url += '&';
 }
 }
 }
 }
 if (url.substring(url.length - 1, url.length) == "&") {
 url = url.substring(0, url.length - 1);
 }
 return url;
 }
 */
/*
 function onStageChange() {
 var terr = $('#combo-stage').val();
 if (terr != "") {
 var url = prepareUrl('stage');
 window.location.href = url + "stage=" + terr;
 } else {
 var url = prepareUrlForEmpty('stage');
 window.location.href = url;
 }
 }

 function onAssignToChange() {
 var terr = $('#combo-assignTo').val();
 if (terr != "") {
 var url = prepareUrl('assignTo');
 window.location.href = url + "assignTo=" + terr;
 } else {
 var url = prepareUrlForEmpty('assignTo');
 window.location.href = url;
 }
 }

 function onIndustryChange() {
 var industry = $('#combo-industry').val();
 if (industry != "") {
 var url = prepareUrl('industry');
 window.location.href = url + "industry=" + industry;
 } else {
 var url = prepareUrlForEmpty('industry');
 window.location.href = url;
 }

 }

 function onSourceChange() {
 var source = $('#combo-source').val();
 if (source != "") {
 var url = prepareUrl('source');
 window.location.href = url + "source=" + source;
 } else {
 var url = prepareUrlForEmpty('source');
 window.location.href = url;
 }


 }*/

function onDeleteLead(leadId) {
    if (confirm("Are you sure, you want to delete this lead ?") == true) {
        window.location.href = "/leads/deleteLead?id=" + leadId;
    }
}


/*function onSearchChange() {

 var search = $('#search-input').val();

 var url;
 if (location.search && location.search != "") {

 url = "_leads_list" + location.search;// + prepareUrl("search");
 url += "&&search=" + search;
 } else {

 url = "_leads_list?search=" + search;

 }

 $.get(url, function (data, status) {

 console.log(data);

 $("#leadsTableContainer").html(data);
 })
 }*/


function sortField(fieldName, defaultSortField, sortByContext) {

    var url = "_leads_list?";

    url = sortingCommonFun(fieldName, defaultSortField, url, sortFieldObj);

    url += "sortBy=" + fieldName + "&sortOrder=" + sortFieldObj[fieldName];

    if (sortByContext) {
        url += "&sortByContext=" + sortByContext;
    }

    var urlParam = url.replace("_leads_list?", "");

    window.history.replaceState({}, '', "leads?" + urlParam); // change parameter into url

    $.get(url, function (data, status) {

        $("#leadsTableContainer").html(data);

    })

}

function getCriteriaForFilter() {

    leadFilterCriteria = [];

    if ($("#industry_operator").val() && $("#industry_val").val()) {
        var industry = prepareIndustryObj();
        leadFilterCriteria.push(industry);
    }

    if ($("#source_operator").val() && $("#source_val").val()) {
        var source = prepareSourceObj();
        leadFilterCriteria.push(source);

    }

    if ($("#territory_operator").val() && $("#territory_val").val()) {
        var territory = prepareTerritoryObj();
        leadFilterCriteria.push(territory);
    }


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        leadFilterCriteria.push(assignedTo);

    }

    if ($("#tags_operationType").val() && $("#tagsinput").val()) {
        var tags = prepareTagsObj();
        leadFilterCriteria.push(tags);
    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        leadFilterCriteria.push(created_on);

    }

    if ($("#expectedDate_operator").val() && ($("#expectedDate_input").val() || ($("#expectedDate_start_input").val() && $("#expectedDate_end_input").val()))) {

        var expectedDate = prepareExpectedDateObj();
        leadFilterCriteria.push(expectedDate);

    }

    if ($("#amount_operator").val() && ($("#amount_input").val() || ($("#amount_start_input").val() && $("#amount_end_input").val()))) {

        var amount = prepareAmountObj();
        leadFilterCriteria.push(amount);

    }
    if ($("#confidenceLevel_operator").val() && ($("#confidenceLevel_input").val() || ($("#confidenceLevel_start_input").val() && $("#confidenceLevel_end_input").val()))) {

        var confidenceLevel = prepareConfidenceLevelObj();
        leadFilterCriteria.push(confidenceLevel);

    }
    if ($("#stage_operator").val() && $("#stage_val").val()) {

        var stage = prepareStageObj();
        leadFilterCriteria.push(stage);

    }

}


function applyFilter() {

    getCriteriaForFilter();
//    console.log(leadFilterCriteria);

    if (leadFilterCriteria.length) {
        dirtyFlagForFilter = true;
        retrieveLeadData();
    } else if (dirtyFlagForFilter) {
        dirtyFlagForFilter = false;
        retrieveLeadData();
    }


}

function getFilterUrl(filterCriteria, clearFiler) {

    var urlParams, questionVal;

    urlParams = getUrlParamsForFilter(filterCriteria, clearFiler);
    questionVal = (urlParams != "") ? "?" : ""
    window.history.replaceState({}, '', "leads" + questionVal + urlParams); // change parameter into current url

    // prepare Url
    return "_leads_list.espx?" + urlParams;
}

// Prepare Filter Criteria
function retrieveCommonFilterCriteria() {
    var filterCriteria = jQuery.extend(true, [], leadFilterCriteria), filterCriteriaToString;

    var search = $('#search-input').val();
    if (search != "" || oldSearchValue.length > 0) {
        var searchObj = {"key": "leadSearch",
            "value": search

        };
        filterCriteria.push(searchObj);
        oldSearchValue = search;
    } else {
        oldSearchValue = "";
    }
    return filterCriteria;
}


// retrieve Lead Data
function retrieveLeadData(clearFiler) {

    var filterCriteria = retrieveCommonFilterCriteria(), filterCriteriaToString, url;

    // if filter contain any criteria ,then convert into string
    filterCriteriaToString = (filterCriteria.length) ? JSON.stringify(filterCriteria) : filterCriteriaToString;


    url = getFilterUrl(filterCriteria, clearFiler);

    // If page is refresh,And filter flag is exits,then set parameter of filter into filter popup
    if (!filterCriteria.length && url.indexOf("fs") > -1 && !clearFiler) {
//        setFilterParamInPopup();

        var filterVal = $("#hiddenFilterParam").val();
        if (filterVal != "") {
            leadFilterCriteria = JSON.parse(filterVal);
        }
    }

    $("#leadsTableContainer").addClass('customLoader');
    $("#leadsTableContainer").empty();

    // Ajax call for retrieving lead Data with filter
    $.post(url, {"criteria": filterCriteriaToString}, function (data, status) {

        $("#leadsTableContainer").html(data);
        $("#leadsTableContainer").removeClass('customLoader');

    })
}

function clearFilter() {

    leadFilterCriteria = [];

    resetAllLeadFilterComponent();

    retrieveLeadData(true);
}


function saveDynamicGroupForLead(callback) {

    var criteriaObject = jQuery.extend(true, [], leadFilterCriteria);

    var dynamicGroupArray = {
        'title': $('#addDynamicGroupTitle').val(),
        'criteria': JSON.stringify(criteriaObject),
        'moduleId': moduleId['LEAD']
    };


    $.post('/groups/dynamicGroups/saveDynamicGroup.espx', dynamicGroupArray, function (data, status) {

        if (status == "success") {
            if (callback) {
                callback(data);
            }
        }

    })
}

function saveAsGroup(callback) {

    getCriteriaForFilter();

    if (leadFilterCriteria.length) {
        saveDynamicGroupForLead(function () {
            $("#leadFilter").modal('hide');
            retrieveLeadData();
        });

    }


}

function saveAsGroupAndReload() {
    getCriteriaForFilter();

    if (leadFilterCriteria.length) {
        $('body').addClass('customLoader positionForBodyLoader modal-backdrop fade in ');
        $("#leadFilter").modal('hide');
        saveDynamicGroupForLead(function (data) {
            $('body').removeClass('customLoader positionForBodyLoader modal-backdrop fade in ');
            data = JSON.parse(data);
            window.location.href = "/" + urlForListViewOfEntityInDynamicGroup["LEAD"] + "?id=" + data.id;
        });
    }
}