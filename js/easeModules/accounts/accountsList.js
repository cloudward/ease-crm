/**
 * Created by shivali.patel on 7/17/14.
 */


var urlVal, parameterObj, keysOfParameter, sortFieldObj = {}, accountFilterCriteria = [], dirtyFlagForFilter, oldSearchValue = "";
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

    $('#accountFilter').on('show.bs.modal', function () {
        resetAllAccountFilterComponent();
        setCriteria(accountFilterCriteria);
    })

    //retrieve Account list
    retrieveAccountData();

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

 function onTerritoryChange() {
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


 }
 */

function onDeleteAccount(accountId) {
    if (confirm("Are you sure, you want to delete this account ?") == true) {
        window.location.href = "/accounts/deleteAccount?id=" + accountId;
    }
}


/*function onSearchChange() {

 var search = $('#search-input').val();

 var url;
 if (location.search && location.search != "") {

 url = "_accounts_list" + location.search;// + prepareUrl("search");
 url += "&search=" + search;
 } else {

 url = "_accounts_list?search=" + search;

 }


 $.get(url, function (data, status) {
 $("#accountsTableContainer").html(data);
 })


 }*/

function sortField(fieldName, defaultSortField, sortByContext) {

    var url = "_accounts_list?";

    url = sortingCommonFun(fieldName, defaultSortField, url, sortFieldObj);

    url += "sortBy=" + fieldName + "&sortOrder=" + sortFieldObj[fieldName];

    if (sortByContext) {
        url += "&sortByContext=" + sortByContext;
    }

    var urlParam = url.replace("_accounts_list?", "");

    window.history.replaceState({}, '', "accounts?" + urlParam); // change parameter into url

    $.get(url, function (data, status) {

        $("#accountsTableContainer").html(data);

    })

}

function getCriteriaForFilter() {

    accountFilterCriteria = [];


    if ($("#industry_operator").val() && $("#industry_val").val()) {
        var industry = prepareIndustryObj();
        accountFilterCriteria.push(industry);
    }

    if ($("#source_operator").val() && $("#source_val").val()) {
        var source = prepareSourceObj();
        accountFilterCriteria.push(source);

    }

    if ($("#territory_operator").val() && $("#territory_val").val()) {
        var territory = prepareTerritoryObj();
        accountFilterCriteria.push(territory);
    }


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        accountFilterCriteria.push(assignedTo);

    }
//    $("#tags_operator").val() &&
    if ($("#tags_operationType").val() && $("#tagsinput").val()) {
        var tags = prepareTagsObj();
        accountFilterCriteria.push(tags);
    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        accountFilterCriteria.push(created_on);

    }

}

function applyFilter() {

    getCriteriaForFilter();
//    console.log(accountFilterCriteria);

    if (accountFilterCriteria.length) {
        retrieveAccountData();
        dirtyFlagForFilter = true;
    }
    else if (dirtyFlagForFilter) {
        dirtyFlagForFilter = false;
        retrieveAccountData();
    }


}

function getFilterUrl(filterCriteria, clearFiler) {

    var urlParams, questionVal;

    urlParams = getUrlParamsForFilter(filterCriteria, clearFiler);
    questionVal = (urlParams != "") ? "?" : ""
    window.history.replaceState({}, '', "accounts" + questionVal + urlParams); // change parameter into current url

    // prepare Url
    return "_accounts_list.espx?" + urlParams;
}

// prepare Parameter String for retrieving Data
function getUrlForFilter(filterCriteria, clearFiler) {

    var url = (location.search.slice(1) != "") ? location.search.slice(1) : "";

    url = removeParamFromUrl(url, 'cf');

    if (filterCriteria.length) {
        url = removeParamFromUrl(url, 'fs');
        url += "&fs=1";
    }

    if (clearFiler) {
        url = removeParamFromUrl(url, 'fs');
        url = removeParamFromUrl(url, 'index');
        url += "&cf=1";
    }


    url = (url.charAt(url.length - 1) == "&") ? url.substring(0, url.length - 1) : url;
    url = (url.charAt(0) == "&") ? url.substring(1, url.length) : url;

    var questionVal = (url != "") ? "?" : ""
    window.history.replaceState({}, '', "" + questionVal + url);
    return url;
}

function retrieveCommonFilterCriteria() {
    var filterCriteria = jQuery.extend(true, [], accountFilterCriteria);

    var search = $('#search-input').val();
    if (search != "" || oldSearchValue.length > 0) {
        var searchObj = {"key": "accountSearch",
            "value": search
        };
        filterCriteria.push(searchObj);
        oldSearchValue = search;
    } else {
        oldSearchValue = "";
    }
    return filterCriteria;
}

// retrieve account Data
function retrieveAccountData(clearFiler) {


    var filterCriteria = retrieveCommonFilterCriteria(), filterCriteriaToString, url;

    // if filter contain any criteria ,then convert into string
    filterCriteriaToString = (filterCriteria.length) ? JSON.stringify(filterCriteria) : filterCriteriaToString;

    // prepare Url
    url = getFilterUrl(filterCriteria, clearFiler);

    // If page is refresh,And filter flag is exits,then set parameter of filter into filter popup
    if (!filterCriteria.length && url.indexOf("fs") > -1 && !clearFiler) {
//        setFilterParamInPopup();

        var filterVal = $("#hiddenFilterParam").val();
        if (filterVal != "") {
            accountFilterCriteria = JSON.parse(filterVal);
        }
    }

    $("#accountsTableContainer").addClass('customLoader');
    $("#accountsTableContainer").empty();

    // Ajax call for retrieving contact Data with filter
    $.post(url, {"criteria": filterCriteriaToString}, function (data, status) {
//        console.log(data);
        $("#accountsTableContainer").html(data);
        $("#accountsTableContainer").removeClass('customLoader');

    })


}


function clearFilter() {

    accountFilterCriteria = [];

    resetAllAccountFilterComponent();

    retrieveAccountData(true);
}

function saveDynamicGroupForAccount(callback) {
    var criteriaObject = jQuery.extend(true, [], accountFilterCriteria);

//        console.log(criteriaObject);

    var dynamicGroupArray = {
        'title': $('#addDynamicGroupTitle').val(),
        'criteria': JSON.stringify(criteriaObject),
        'moduleId': moduleId['ACCOUNT']
    };

    ;

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

    if (accountFilterCriteria.length) {

        saveDynamicGroupForAccount(function () {
            $("#accountFilter").modal('hide');
            retrieveAccountData();
        })

    }

}

function saveAsGroupAndReload() {

    getCriteriaForFilter();

    if (accountFilterCriteria.length) {

        $('body').addClass('customLoader positionForBodyLoader modal-backdrop fade in ');

        $("#accountFilter").modal('hide');
        saveDynamicGroupForAccount(function (data) {
            $('body').removeClass('customLoader positionForBodyLoader modal-backdrop fade in');
            data = JSON.parse(data);
            window.location.href = "/" + urlForListViewOfEntityInDynamicGroup['ACCOUNT'] + "?id=" + data.id;
        });
    }
}