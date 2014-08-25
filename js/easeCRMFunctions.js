/**
 * Created by shivali.patel on 6/26/14.
 */

function getParameterToJSON() {
    if (location.search == "") {
        return {};
    }
    var pairs = location.search.slice(1).split('&');

    /*   console.log(pairs);
     console.log(location.search);*/
    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}


function prepareUrl(urlVal, keysOfParameter, field, parameterObj) {
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

function prepareUrlForEmpty(urlVal, keysOfParameter, field, parameterObj) {
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


function sortingCommonFun(fieldName, defaultSortField, url, sortFieldObj) {
    var urlParam = "", keys = ["sortBy", "sortOrder", "sortByContext"];

    var paramArray = getParameterToJSON();

    for (var i = 0, len = keys.length; i < len; i++) {
        if (paramArray[keys[i]]) {
            delete paramArray[keys[i]];
        }
    }
    for (var i = 0, keys = Object.keys(paramArray); i < keys.length; i++) {

        urlParam += keys[i] + "=" + paramArray[keys[i]] + "&";

    }


    if (!sortFieldObj[defaultSortField]) {
        sortFieldObj[defaultSortField] = "ascending";
    }

    if (!sortFieldObj[fieldName] || sortFieldObj[fieldName] == "descending") {
        sortFieldObj[fieldName] = "ascending";
    } else {
        sortFieldObj[fieldName] = "descending";
    }


    if (urlParam && urlParam != "") {
        url = url + urlParam;
    }

    /* $('.sortingField').removeClass("glyphicon glyphicon-chevron-up glyphicon-chevron-down customSorting");

     if(sortFieldObj[fieldName]=="ascending"){
     $('#sorting-'+fieldName).addClass("glyphicon glyphicon-chevron-up customSorting");
     }else{
     $('#sorting-'+fieldName).addClass("glyphicon glyphicon-chevron-down customSorting");
     }*/


    return url;

}

function changeOperator(id) {
    var operator = $("#" + id + "_operator").val();

    if (operator == "between") {
        $("#" + id + "_type_1").css("display", "none");
        $("#" + id + "_type_2").css("display", "block");
    }
    else {
        $("#" + id + "_type_2").css("display", "none");
        $("#" + id + "_type_1").css("display", "block");
    }
}

function prepareIndustryObj() {

    var industry = {
        "key": "industry",
        "value": $("#industry_val").val(),
        "operator": $("#industry_operator").val()
    };
    return industry;
}

function prepareSourceObj() {

    var source = {
        "key": "source",
        "value": $("#source_val").val(),
        "operator": $("#source_operator").val()
    };
    return source;
}
function prepareTerritoryObj() {

    var territory = {
        "key": "territory",
        "value": $("#territory_val").val(),
        "operator": $("#territory_operator").val()
    };
    return territory;

}
function prepareAssignedToObj() {

    var assignedTo = {
        "key": "assignedTo",
        "value": $("#assignedTo_val").val(),
        "operator": $("#assignedTo_operator").val()
    };
    return assignedTo;

}
function prepareTagsObj() {

    var TagVal = $("#tagsinput").val().split(',');
    var tags = {
        "key": "tags",
        "value": TagVal,
//        "operator": $("#tags_operator").val(),
        "operationType": $("#tags_operationType").val()
    };
    return tags;
}

function prepareStageObj() {


    var stage = {
        "key": "stage",
        "value": $("#stage_val").val(),
        "operator": $("#stage_operator").val()
    };
    return stage;
}
function prepareCreatedOnObj() {

    var created_on = {
        "key": "created_on",
        "operator": $("#created_on_operator").val()
    };

    if ($("#created_on_operator").val() != "between") {
        created_on.value = $("#created_on_input").val();
    } else {
        created_on.value = {start: $("#created_on_start_input").val(), end: $("#created_on_end_input").val()};

    }

    return created_on;

}

function prepareExpectedDateObj() {

    var expectedDate = {
        "key": "expectedDate",
        "operator": $("#expectedDate_operator").val()
    };

    if ($("#expectedDate_operator").val() != "between") {
        expectedDate.value = $("#expectedDate_input").val();
    } else {
        expectedDate.value = {start: $("#expectedDate_start_input").val(), end: $("#expectedDate_end_input").val()};
    }

    return expectedDate;

}
function prepareDueDateObj() {

    var dueDate = {
        "key": "dueDate",
        "operator": $("#dueDate_operator").val()
    };

    if ($("#dueDate_operator").val() != "between") {
        dueDate.value = $("#dueDate_input").val();
    } else {
        dueDate.value = {start: $("#dueDate_start_input").val(), end: $("#dueDate_end_input").val()};
    }

    return dueDate;

}

function prepareAmountObj() {

    var amount = {
        "key": "amount",
        "operator": $("#amount_operator").val()
    };

    if ($("#amount_operator").val() != "between") {
        amount.value = $("#amount_input").val();
    } else {
        amount.value = {start: $("#amount_start_input").val(), end: $("#amount_end_input").val()};
    }

    return amount;

}
function prepareConfidenceLevelObj() {

    var confidenceLevel = {
        "key": "confidenceLevel",
        "operator": $("#confidenceLevel_operator").val()
    };

    if ($("#confidenceLevel_operator").val() != "between") {
        confidenceLevel.value = $("#confidenceLevel_input").val();
    } else {
        confidenceLevel.value = {start: $("#confidenceLevel_start_input").val(), end: $("#confidenceLevel_end_input").val()};
    }

    return confidenceLevel;

}

function prepareTaskTypeObj() {


    var taskType = {
        "key": "taskType",
        "value": $("#taskType_val").val(),
        "operator": $("#taskType_operator").val()
    };
    return taskType;

}

function validOnDateInFilter(id) {
    $("#" + id + "_end").on("dp.change", function (e) {
        var endDate, startDate, diff;
        endDate = $('#' + id + '_end').data("DateTimePicker").getDate();
        startDate = $('#' + id + '_start').data("DateTimePicker").getDate();

        diff = startDate.diff(endDate, 'seconds');
        // console.log(diff)
        if (diff > 0) {
            $('#' + id + '_start').data("DateTimePicker").setValue(moment(endDate).subtract('d', 1).format("YYYY-MM-DD"));
        }
    })

    $("#" + id + "_start").on("dp.change", function (e) {
        var endDate, startDate, diff;
        endDate = $('#' + id + '_end').data("DateTimePicker").getDate();
        startDate = $('#' + id + '_start').data("DateTimePicker").getDate();

        diff = startDate.diff(endDate, 'seconds');
//        console.log(diff)
        if (diff > 0) {
            $('#' + id + '_end').data("DateTimePicker").setValue(moment(startDate).add('d', 1).format("YYYY-MM-DD"));
        }
    })
}


function validOnAmountInFilter(changedIn) {
    var startVal, endVal;
    startVal = Number($("#amount_start_input").val());
    endVal = Number($("#amount_end_input").val());

    if (changedIn == "start" && startVal > endVal) {
        $("#amount_end_input").val(startVal + 1);
    }
    else if (changedIn == "end" && startVal > endVal) {
        $("#amount_start_input").val(endVal - 1);
    }

}

function validOnConfidenceInFilter(changedIn) {
    var startVal, endVal;
    startVal = Number($("#confidenceLevel_start_input").val());
    endVal = Number($("#confidenceLevel_end_input").val());

    if (changedIn == "start" && startVal > endVal) {
        $("#confidenceLevel_end_input").val(startVal + 1);
    }
    else if (changedIn == "end" && startVal > endVal) {
        $("#confidenceLevel_start_input").val(endVal - 1);
    }

}

function setTagsField(criteriaObject) {

    for (var i = 0; i < criteriaObject.value.length; i++)
        $("#tagsinput").addTag(criteriaObject.value[i]);

    $("#tagsinput").val(criteriaObject.value.join(','));

    $("#tags_operationType").selectpicker('val', criteriaObject.operationType);
}

function setDatesFiled(criteriaObject) {

    $("#" + criteriaObject.key + "_operator").selectpicker('val', criteriaObject.operator);

    if (criteriaObject.operator != "between") {
        $("#" + criteriaObject.key + "_type_1").css("display", "block");
        $("#" + criteriaObject.key + "_type_2").css("display", "none");

        $('#' + criteriaObject.key).data("DateTimePicker").setDate(criteriaObject.value);

    } else {

        $("#" + criteriaObject.key + "_type_1").css("display", "none");
        $("#" + criteriaObject.key + "_type_2").css("display", "block");

        $('#' + criteriaObject.key + '_start').data("DateTimePicker").setDate(criteriaObject.value.start);
        $('#' + criteriaObject.key + '_end').data("DateTimePicker").setDate(criteriaObject.value.end);

    }
}

function setNumericField(criteriaObject) {
    $("#" + criteriaObject.key + "_operator").selectpicker('val', criteriaObject.operator);

    if (criteriaObject.operator != "between") {
        $("#" + criteriaObject.key + "_type_1").css("display", "block");
        $("#" + criteriaObject.key + "_type_2").css("display", "none");

        $('#' + criteriaObject.key + '_input').val(criteriaObject.value);
    } else {
        $("#" + criteriaObject.key + "_type_1").css("display", "none");
        $("#" + criteriaObject.key + "_type_2").css("display", "block");

        $('#' + criteriaObject.key + '_start_input').val(criteriaObject.value.start);
        $('#' + criteriaObject.key + '_end_input').val(criteriaObject.value.end);

    }
}

function setCriteria(filterVal) {
    for (var i = 0; i < filterVal.length; i++) {

        switch (filterVal[i].key) {
            case 'industry':
            case 'source':
            case 'territory':
            case 'assignedTo':
            case 'taskType':
            case 'stage':
                $('#' + filterVal[i].key + '_val').selectpicker('val', filterVal[i].value);
                $('#' + filterVal[i].key + '_operator').selectpicker('val', filterVal[i].operator);
                break;
            case'tags':

                setTagsField(filterVal[i]);
                break;

            case 'created_on':
            case 'expectedDate':
            case 'dueDate':

                setDatesFiled(filterVal[i]);
                break;

            case 'amount':
            case 'confidenceLevel':

                setNumericField(filterVal[i]);
                break;
            default :
                break;

        }

    }

}

function setFilterParamInPopup() {
    var filterVal = $("#hiddenFilterParam").val();

    if (filterVal != "") {
        filterVal = JSON.parse(filterVal);
        setCriteria(filterVal);

    }
}

function removeParamFromUrl(url, field) {
    var parameters = url.split('&');

    for (var i = 0; i < parameters.length; i++) {
        var keyValue = parameters[i].split("=");
        if (keyValue.length == 2 && keyValue[0] == field) {
            parameters.splice(i, 1);
        }
    }

    return parameters.join("&");
}

// prepare Parameter String for retrieving Data
function getUrlParamsForFilter(filterCriteria, clearFiler) {

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


    return url;
}

function resetAllContactFilterComponent(){
    $('.selectpicker').selectpicker('deselectAll');
    $('#created_on').data("DateTimePicker").setValue("");
    $('#created_on_start').data("DateTimePicker").setValue("");
    $('#created_on_end').data("DateTimePicker").setValue("");
    $('#tagsinput').val("");
    $('#tagsinput_tagsinput .tag').remove();

    $("#created_on_type_2").css("display", "none");
    $("#created_on_type_1").css("display", "block");
}

function resetAllAccountFilterComponent(){
    $('.selectpicker').selectpicker('deselectAll');

    $('#created_on').data("DateTimePicker").setValue("");
    $('#created_on_start').data("DateTimePicker").setValue("");
    $('#created_on_end').data("DateTimePicker").setValue("");
    $('#tagsinput').val("");
    $('#tagsinput_tagsinput .tag').remove();

    $("#created_on_type_2").css("display", "none");
    $("#created_on_type_1").css("display", "block");
}

function resetAllLeadFilterComponent() {
    $('.selectpicker').selectpicker('deselectAll');

    $('#tagsinput').val("");
    $('#tagsinput_tagsinput .tag').remove();

    $('#created_on').data("DateTimePicker").setValue("");
    $('#created_on_start').data("DateTimePicker").setValue("");
    $('#created_on_end').data("DateTimePicker").setValue("");


    $('#expectedDate').data("DateTimePicker").setValue("");
    $('#expectedDate_start').data("DateTimePicker").setValue("");
    $('#expectedDate_end').data("DateTimePicker").setValue("");

    $('#amount_input').val("");
    $('#amount_start_input').val("");
    $('#amount_end_input').val("");

    $('#confidenceLevel_input').val("");
    $('#confidenceLevel_start_input').val("");
    $('#confidenceLevel_end_input').val("");

    resetDisplayContext();
}
function resetDisplayContext() {

    $("#created_on_type_2").css("display", "none");
    $("#created_on_type_1").css("display", "block");

    $("#expectedDate_type_2").css("display", "none");
    $("#expectedDate_type_1").css("display", "block");

    $("#amount_type_2").css("display", "none");
    $("#amount_type_1").css("display", "block");

    $("#confidenceLevel_type_2").css("display", "none");
    $("#confidenceLevel_type_1").css("display", "block");

}