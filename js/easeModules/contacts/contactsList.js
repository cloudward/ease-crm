/**
 * Created by shivali.patel on 7/16/14.
 */

var urlVal, parameterObj, keysOfParameter, sortFieldObj = {}, contactFilterCriteria = [], dirtyFlagForFilter, oldSearchValue = "";
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

    $('#contactFilter').on('show.bs.modal', function () {
        resetAllContactFilterComponent();
        setCriteria(contactFilterCriteria);
    })

    //retrieve Contacts list
    retrieveContactData();
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
 }

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
 }*/

/*function onTerritoryChange() {
 var terr = $('#combo-terr').val();
 if (terr != "") {
 var url = prepareUrl('terr');
 window.location.href = url + "terr=" + terr;
 } else {
 var url = prepareUrlForEmpty('terr');
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

function onDeleteContact(contactId) {
    if (confirm("Are you sure, you want to delete this contact ?") == true) {
        window.location.href = "/contacts/deleteContact?id=" + contactId;
    }
}


/*function onSearchChange() {

 var search = $('#search-input').val();

 var url;
 if (location.search && location.search != "") {

 url = "_contacts_list" + location.search;// + prepareUrl("search");
 url += "&&search=" + search;
 } else {

 url = "_contacts_list?search=" + search;

 }


 $.get(url, function (data, status) {

 //        console.log(data);

 $("#contactsTableContainer").html(data);
 })
 }*/

function sortField(fieldName, defaultSortField, sortByContext) {


    var url = "_contacts_list?";

    url = sortingCommonFun(fieldName, defaultSortField, url, sortFieldObj);

    url += "sortBy=" + fieldName + "&sortOrder=" + sortFieldObj[fieldName];

    if (sortByContext) {
        url += "&sortByContext=" + sortByContext;
    }

    var urlParam = url.replace("_contacts_list?", "");

    window.history.replaceState({}, '', "contacts?" + urlParam); // change parameter into url

    $.get(url, function (data, status) {

        $("#contactsTableContainer").html(data);

    })
}

function getCriteriaForFilter() {
    contactFilterCriteria = [];

    if ($("#industry_operator").val() && $("#industry_val").val()) {
        var industry = prepareIndustryObj();
        contactFilterCriteria.push(industry);
    }

    if ($("#source_operator").val() && $("#source_val").val()) {
        var source = prepareSourceObj();
        contactFilterCriteria.push(source);

    }

    if ($("#territory_operator").val() && $("#territory_val").val()) {
        var territory = prepareTerritoryObj();
        contactFilterCriteria.push(territory);
    }


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        contactFilterCriteria.push(assignedTo);

    }
//    $("#tags_operator").val() &&
    if ($("#tags_operationType").val() && $("#tagsinput").val()) {
        var tags = prepareTagsObj();
        contactFilterCriteria.push(tags);
    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        contactFilterCriteria.push(created_on);

    }
}

function applyFilter() {
    getCriteriaForFilter();

//    console.log(contactFilterCriteria);

    if (contactFilterCriteria.length) {
        dirtyFlagForFilter = true;
        retrieveContactData();
    } else if (dirtyFlagForFilter) {
        dirtyFlagForFilter = false;
        retrieveContactData();
    }

}

function getFilterUrl(filterCriteria, clearFiler) {

    var urlParams, questionVal;

    urlParams = getUrlParamsForFilter(filterCriteria, clearFiler);
    questionVal = (urlParams != "") ? "?" : ""
    window.history.replaceState({}, '', "contacts" + questionVal + urlParams); // change parameter into current url

    // prepare Url
    return "_contacts_list.espx?" + urlParams;
}

// Prepare Filter Criteria
function retrieveCommonFilterCriteria() {

    var filterCriteria = jQuery.extend(true, [], contactFilterCriteria);

    var search = $('#search-input').val();

    if (search != "" || oldSearchValue.length > 0) {
        var searchObj = {"key": "contactSearch",
            "value": search
        };
        filterCriteria.push(searchObj);
        oldSearchValue = search;
    } else {
        oldSearchValue = "";
    }
    return filterCriteria;
}

// retrieve Contact Data
function retrieveContactData(clearFiler) {


    var filterCriteria = retrieveCommonFilterCriteria(), filterCriteriaToString, url;

    // if filter contain any criteria ,then convert into string
    filterCriteriaToString = (filterCriteria.length) ? JSON.stringify(filterCriteria) : filterCriteriaToString;

    url = getFilterUrl(filterCriteria, clearFiler);

    // If page is refresh,And filter flag is exits,then set parameter of filter into filter popup
    if (!filterCriteria.length && url.indexOf("fs") > -1 && !clearFiler) {
//        setFilterParamInPopup();

        var filterVal = $("#hiddenFilterParam").val();
        if (filterVal != "") {
            contactFilterCriteria = JSON.parse(filterVal);
        }
    }


    $("#contactsTableContainer").addClass('customLoader');
    $("#contactsTableContainer").empty();

    // Ajax call for retrieving contact Data with filter
    $.post(url, {"criteria": filterCriteriaToString}, function (data, status) {

        $("#contactsTableContainer").html(data);
        $("#contactsTableContainer").removeClass('customLoader');

    })
}


function changeCreatedOnDisplay(id) {
    var createdOn_operator = $("#" + id).val();

    if (createdOn_operator == "between") {
        $("#created_on_type_1").css("display", "none");
        $("#created_on_type_2").css("display", "block");
    }
    else {
        $("#created_on_type_2").css("display", "none");
        $("#created_on_type_1").css("display", "block");
    }
}


function clearFilter() {

    contactFilterCriteria = [];

    resetAllContactFilterComponent();
//    localStorage.removeItem('filterConditions');

    retrieveContactData(true);
}

function saveDynamicGroupForContact(callback) {
    var criteriaObject = jQuery.extend(true, [], contactFilterCriteria);

//        console.log(criteriaObject);

    var dynamicGroupArray = {
        'title': $('#addDynamicGroupTitle').val(),
        'criteria': JSON.stringify(criteriaObject),
        'moduleId': moduleId['CONTACT']
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

    if (contactFilterCriteria.length) {
        saveDynamicGroupForContact(function () {
            $("#contactFilter").modal('hide');
            retrieveContactData();

        })


    }


}

function saveAsGroupAndReload() {

    getCriteriaForFilter();

    if (contactFilterCriteria.length) {
        $('body').addClass('customLoader positionForBodyLoader modal-backdrop fade in ');
        $("#contactFilter").modal('hide');


        saveDynamicGroupForContact(function (data) {
            data = JSON.parse(data);
            $('body').removeClass('customLoader positionForBodyLoader modal-backdrop fade in');
            window.location.href = "/" + urlForListViewOfEntityInDynamicGroup["CONTACT"] + "?id=" + data.id;
        });
    }
}

