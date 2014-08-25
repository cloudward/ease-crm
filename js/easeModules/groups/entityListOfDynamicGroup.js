/**
 * Created by shivali.patel on 8/4/14.
 */

var urlVal , urlString, parameterObj, keysOfParameter , filterCriteria = [], oldFilterCriteria = [];

$(document).ready(function () {

    urlVal = window.location.pathname;

    urlString = urlVal.substr(urlVal.indexOf('/') + 1, urlVal.length);

    function getParameterToJSON() {
        if (location.search == "") {
            return {};
        }
        var pairs = location.search.slice(1).split('&');

        /*console.log(pairs);
         console.log(location.search);*/
        var result = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return JSON.parse(JSON.stringify(result));
    }

    parameterObj = getParameterToJSON() || {};
    keysOfParameter = Object.keys(parameterObj);

    // retrieve grid view data
    loadGridView();

})

function loadGridView() {

    if (urlString == urlForListViewOfEntityInDynamicGroup['CONTACT']) {

        $('#filterForDynamicGroupContact').on('show.bs.modal', function () {
            resetAllContactFilterComponent();
            setCriteria(filterCriteria);
        })

        onLoadRetrieveContactList();
    } else if (urlString == urlForListViewOfEntityInDynamicGroup['ACCOUNT']) {

        $('#filterForDynamicGroupAccount').on('show.bs.modal', function () {
            resetAllAccountFilterComponent();
            setCriteria(filterCriteria);
        })

        onLoadRetrieveAccountList();
    } else if (urlString == urlForListViewOfEntityInDynamicGroup["LEAD"]) {

        $('#filterForDynamicGroupLead').on('show.bs.modal', function () {
            resetAllLeadFilterComponent();
            setCriteria(filterCriteria);
        })

        onLoadRetrieveLeadList();
    }

}

function saveAsGroup() {

    if (urlString == urlForListViewOfEntityInDynamicGroup['CONTACT']) {
        saveAsGroupForContact();
    } else if (urlString == urlForListViewOfEntityInDynamicGroup['ACCOUNT']) {
        saveAsGroupForAccount();
    } else if (urlString == urlForListViewOfEntityInDynamicGroup["LEAD"]) {
        saveAsGroupForLead();
    }

}

function saveAsGroupAndReload() {

    if (urlString == urlForListViewOfEntityInDynamicGroup['CONTACT']) {
        saveAsGroupAndReloadForContact();
    } else if (urlString == urlForListViewOfEntityInDynamicGroup['ACCOUNT']) {
        saveAsGroupAndReloadForAccount();
    } else if (urlString == urlForListViewOfEntityInDynamicGroup["LEAD"]) {
        saveAsGroupAndReloadForLead();
    }

}

// Load Contact List At first time
function onLoadRetrieveContactList() {

    retrieveDynamicGroupCriteria(function () {
        gridViewOfContact();
    })

}

// Load Account List At first time
function onLoadRetrieveAccountList() {

    retrieveDynamicGroupCriteria(function () {
        gridViewOfAccount();
    })

}

// Load Lead List At first time
function onLoadRetrieveLeadList() {

    retrieveDynamicGroupCriteria(function () {
        gridViewOfLead();
    })

}

// AJAX call for retrieving Contacts With apply Filter
function gridViewOfContact() {

    var url = (location.search.slice(1) != "") ? location.search.slice(1) : "";

    $("#dynamicGroupContent").addClass('customLoader');
    $("#dynamicGroupContent").empty();

    $.post('/groups/dynamicGroups/contactDynamicGroupContactGrid.espx?' + url, {"criteria": JSON.stringify(filterCriteria)}, function (data, status) {
        $("#dynamicGroupContent").html(data);
        $("#dynamicGroupContent").removeClass('customLoader');
    })
}

// AJAX call for retrieving Accounts With apply Filter
function gridViewOfAccount() {

    var url = (location.search.slice(1) != "") ? location.search.slice(1) : "";

    $("#dynamicGroupContent").addClass('customLoader');
    $("#dynamicGroupContent").empty();

    $.post('/groups/dynamicGroups/accountDynamicGroupAccountGrid.espx?' + url, {"criteria": JSON.stringify(filterCriteria)}, function (data, status) {
        $("#dynamicGroupContent").html(data);
        $("#dynamicGroupContent").removeClass('customLoader');

    })
}

// AJAX call for retrieving Leads With apply Filter
function gridViewOfLead() {

    var url = (location.search.slice(1) != "") ? location.search.slice(1) : "";

    $("#dynamicGroupContent").addClass('customLoader');
    $("#dynamicGroupContent").empty();

    $.post('/groups/dynamicGroups/leadDynamicGroupLeadGrid.espx?' + url, {"criteria": JSON.stringify(filterCriteria)}, function (data, status) {
        $("#dynamicGroupContent").html(data);
        $("#dynamicGroupContent").removeClass('customLoader');
    })
}

// Set filter criteria into filter Popup
function setCriteriaIntoPopup(filterCriteria) {
    setCriteria(filterCriteria);
}

function manipulateCriteriaArray() {
    oldFilterCriteria = [];
    for (var i = 0; i < filterCriteria.length; i++) {
//        filterCriteria[i].value = filterCriteria[i].value.split(',');
        oldFilterCriteria.push(filterCriteria[i].key);
    }

}

// Retrieve Dynamic Group Criteria
function retrieveDynamicGroupCriteria(callback) {
    var groupObj = {
        "groupId": parameterObj['id']
    }
    $.post('/groups/dynamicGroups/retrieveDynamicGroupCriteria.espx', groupObj, function (data, status) {

        if (status == "success") {
            data = $.trim(data);
            if (data != "") {
                filterCriteria = JSON.parse(data);

                manipulateCriteriaArray();

                setCriteriaIntoPopup(filterCriteria);

                if (callback)
                    callback();
            }

        }
    })
}

// Collect Filter criteria for Contact
function getCriteriaForFilterInContact() {
    filterCriteria = [];

    if ($("#industry_operator").val() && $("#industry_val").val()) {
        var industry = prepareIndustryObj();
        filterCriteria.push(industry);
    }

    if ($("#source_operator").val() && $("#source_val").val()) {
        var source = prepareSourceObj();
        filterCriteria.push(source);

    }

    if ($("#territory_operator").val() && $("#territory_val").val()) {
        var territory = prepareTerritoryObj();
        filterCriteria.push(territory);
    }


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        filterCriteria.push(assignedTo);

    }
//    $("#tags_operator").val() &&
    if ($("#tags_operationType").val() && $("#tagsinput").val()) {
        var tags = prepareTagsObj();
        filterCriteria.push(tags);
    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        filterCriteria.push(created_on);

    }
}

// Collect Filter criteria for Account
function getCriteriaForFilterInAccount() {
    filterCriteria = [];

    if ($("#industry_operator").val() && $("#industry_val").val()) {
        var industry = prepareIndustryObj();
        filterCriteria.push(industry);
    }

    if ($("#source_operator").val() && $("#source_val").val()) {
        var source = prepareSourceObj();
        filterCriteria.push(source);

    }

    if ($("#territory_operator").val() && $("#territory_val").val()) {
        var territory = prepareTerritoryObj();
        filterCriteria.push(territory);
    }


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        filterCriteria.push(assignedTo);

    }
//    $("#tags_operator").val() &&
    if ($("#tags_operationType").val() && $("#tagsinput").val()) {
        var tags = prepareTagsObj();
        filterCriteria.push(tags);
    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        filterCriteria.push(created_on);

    }

}

// Collect Filter criteria for Lead
function getCriteriaForFilterInLead() {
    filterCriteria = [];

    if ($("#industry_operator").val() && $("#industry_val").val()) {
        var industry = prepareIndustryObj();
        filterCriteria.push(industry);
    }

    if ($("#source_operator").val() && $("#source_val").val()) {
        var source = prepareSourceObj();
        filterCriteria.push(source);

    }

    if ($("#territory_operator").val() && $("#territory_val").val()) {
        var territory = prepareTerritoryObj();
        filterCriteria.push(territory);
    }


    if ($("#assignedTo_operator").val() && $("#assignedTo_val").val()) {
        var assignedTo = prepareAssignedToObj();
        filterCriteria.push(assignedTo);

    }

    if ($("#tags_operationType").val() && $("#tagsinput").val()) {
        var tags = prepareTagsObj();
        filterCriteria.push(tags);
    }

    if ($("#created_on_operator").val() && ($("#created_on_input").val() || ($("#created_on_start_input").val() && $("#created_on_end_input").val()))) {
        var created_on = prepareCreatedOnObj();
        filterCriteria.push(created_on);

    }

    if ($("#expectedDate_operator").val() && ($("#expectedDate_input").val() || ($("#expectedDate_start_input").val() && $("#expectedDate_end_input").val()))) {

        var expectedDate = prepareExpectedDateObj();
        filterCriteria.push(expectedDate);

    }

    if ($("#amount_operator").val() && ($("#amount_input").val() || ($("#amount_start_input").val() && $("#amount_end_input").val()))) {

        var amount = prepareAmountObj();
        filterCriteria.push(amount);

    }
    if ($("#confidenceLevel_operator").val() && ($("#confidenceLevel_input").val() || ($("#confidenceLevel_start_input").val() && $("#confidenceLevel_end_input").val()))) {

        var confidenceLevel = prepareConfidenceLevelObj();
        filterCriteria.push(confidenceLevel);

    }
    if ($("#stage_operator").val() && $("#stage_val").val()) {

        var stage = prepareStageObj();
        filterCriteria.push(stage);

    }
}

// prepare Array of Entity Object For edit
function prepareEntityArrayForEdit(oldListOfEntity) {
    var entityObj = {"newCriteria": [], "deletedCriteria": [], "existCriteria": []};

    var exitsCriteriaKey = [];
    for (var i = 0; i < filterCriteria.length; i++) {
        if (oldListOfEntity.indexOf(filterCriteria[i].key) == -1) {
            entityObj.newCriteria.push(filterCriteria[i]);
        }
        else {
            entityObj.existCriteria.push(filterCriteria[i]);
        }

        exitsCriteriaKey.push(filterCriteria[i].key);
    }

    for (var i = 0; i < oldListOfEntity.length; i++) {
        if (exitsCriteriaKey.indexOf(oldListOfEntity[i]) == -1) {
            entityObj.deletedCriteria.push(oldListOfEntity[i]);
        }
    }


    return entityObj;
}

// Edit Title for Dynamic Group
function editTitleIntoDynamicGroup() {

    var dynamicGroupObj = {
        "title": $("#editDynamicGroupTitle").val(),
        "groupId": parameterObj['id']
    }

    editDynamicGroup(dynamicGroupObj, function () {
//        console.log($("#dynamicGroupTitle").val());
        $("#labelForDynamicGroupTitle").html($("#editDynamicGroupTitle").val());
    });
}

// Edit Group for contacts
function editContactsIntoDynamicGroup() {

    getCriteriaForFilterInContact();

    if (filterCriteria.length) {
        var contactList = JSON.stringify(prepareEntityArrayForEdit(oldFilterCriteria));
        var dynamicGroupObj = {
            "criteria": contactList,
            "groupId": parameterObj['id']
        }

        editDynamicGroup(dynamicGroupObj, function () {
            manipulateCriteriaArray();
            gridViewOfContact();
        });
    }
}

// Edit Group for contacts
function editAccountsIntoDynamicGroup() {

    getCriteriaForFilterInAccount();

    if (filterCriteria.length) {
        var accountList = JSON.stringify(prepareEntityArrayForEdit(oldFilterCriteria));
        var dynamicGroupObj = {
            "moduleId": moduleId["ACCOUNT"],
            "title": $("#dynamicGroupTitle").val(),
            "criteria": accountList,
            "groupId": parameterObj['id']
        }

        editDynamicGroup(dynamicGroupObj, function () {
            manipulateCriteriaArray();
            gridViewOfAccount();
        });
    }
}

// Edit Group for contacts
function editLeadsIntoDynamicGroup() {

    getCriteriaForFilterInLead();

    if (filterCriteria.length) {
        var leadList = JSON.stringify(prepareEntityArrayForEdit(oldFilterCriteria));
        var dynamicGroupObj = {
            "moduleId": moduleId["LEAD"],
            "title": $("#dynamicGroupTitle").val(),
            "criteria": leadList,
            "groupId": parameterObj['id']
        }

        editDynamicGroup(dynamicGroupObj, function () {
            manipulateCriteriaArray();
            gridViewOfLead();
        });
    }
}

// Call AJAX file , for Edit Group
function editDynamicGroup(fixedGroupObj, callback) {

    $.post("/groups/dynamicGroups/editDynamicGroup.espx", fixedGroupObj, function (data, status) {
        if (status == "success") {
            if (callback) {
                callback();
            }

        }
    })

}

function saveDynamicGroupForContact(callback) {

    var criteriaObject = jQuery.extend(true, [], filterCriteria);

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

// Save as Group in Contacts
function saveAsGroupForContact(callback) {

    getCriteriaForFilterInContact();

    if (filterCriteria.length) {
        saveDynamicGroupForContact(function () {
            $("#filterForDynamicGroupContact").modal('hide');
            gridViewOfContact();
        });

    }


}


// Save as Group & reload in Contacts
function saveAsGroupAndReloadForContact() {

    getCriteriaForFilterInContact();

    if (filterCriteria.length) {

        $('body').addClass('customLoader positionForBodyLoader modal-backdrop fade in ');

        $("#filterForDynamicGroupContact").modal('hide');

        saveDynamicGroupForContact(function (data) {
            $('body').removeClass('customLoader positionForBodyLoader modal-backdrop fade in');
            data = JSON.parse(data);
            window.location.href = "/" + urlForListViewOfEntityInDynamicGroup['CONTACT'] + "?id=" + data.id;
        });


    }


}

function saveDynamicGroupForAccount(callback) {

    var criteriaObject = jQuery.extend(true, [], filterCriteria);

    var dynamicGroupArray = {
        'title': $('#addDynamicGroupTitle').val(),
        'criteria': JSON.stringify(criteriaObject),
        'moduleId': moduleId['ACCOUNT']
    };


    $.post('/groups/dynamicGroups/saveDynamicGroup.espx', dynamicGroupArray, function (data, status) {


        if (callback) {
            callback(data);
        }


    })
}
// Save as Group in Account
function saveAsGroupForAccount(callback) {

    getCriteriaForFilterInAccount();

    if (filterCriteria.length) {
        saveDynamicGroupForAccount(function (data) {
            $("#filterForDynamicGroupAccount").modal('hide');
            gridViewOfAccount();
        });
    }

}

// Save as Group & reload in Accounts
function saveAsGroupAndReloadForAccount() {

    getCriteriaForFilterInAccount();

    if (filterCriteria.length) {
        $('body').addClass('customLoader positionForBodyLoader modal-backdrop fade in ');

        $("#filterForDynamicGroupAccount").modal('hide');

        saveDynamicGroupForAccount(function (data) {
            $('body').removeClass('customLoader positionForBodyLoader modal-backdrop fade in');
            data = JSON.parse(data);
            window.location.href = "/" + urlForListViewOfEntityInDynamicGroup['ACCOUNT'] + "?id=" + data.id;
        });

    }

}

function saveDynamicGroupForLead(callback) {


    var criteriaObject = jQuery.extend(true, [], filterCriteria);

    //        console.log(criteriaObject);

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

// Save as Group in Leads
function saveAsGroupForLead(callback) {

    getCriteriaForFilterInLead();

    if (filterCriteria.length) {
        saveDynamicGroupForLead(function () {
            $("#filterForDynamicGroupLead").modal('hide');
            gridViewOfLead();
        });
    }


}

// Save as Group & reload in Leads
function saveAsGroupAndReloadForLead() {

    getCriteriaForFilterInLead();

    if (filterCriteria.length) {

        $('body').addClass('customLoader positionForBodyLoader modal-backdrop fade in ');

        $("#filterForDynamicGroupLead").modal('hide');

        saveDynamicGroupForLead(function (data) {

            $('body').removeClass('customLoader positionForBodyLoader modal-backdrop fade in');

            data = JSON.parse(data);
            window.location.href = "/" + urlForListViewOfEntityInDynamicGroup["LEAD"] + "?id=" + data.id;
        });
    }


}

// Apply filter in contacts
function applyFilterInContact() {
    getCriteriaForFilterInContact();
    gridViewOfContact();
}

// Apply filter in Accounts
function applyFilterInAccount() {
    getCriteriaForFilterInAccount();
    gridViewOfAccount();
}

// Apply filter in Leads
function applyFilterInLead() {
    getCriteriaForFilterInLead();
    gridViewOfLead();
}
