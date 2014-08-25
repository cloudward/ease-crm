/**
 * Created by shivali.patel on 7/30/14.
 */
var urlVal , parameterObj, keysOfParameter, oldListOfEntity = [];
$(document).ready(function () {
    /*$.get('contactFixedGroup',function(data, status){
     $("#").html(data);
     })*/

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

    // set entity into list
    setEntityIntoList();

})

//retrieve Entity list from Group-Entity relation table
function setEntityIntoList() {
    var groupObj = {
        "groupId": parameterObj['id']
    }
    $.post('/groups/fixedGroups/retrieveEntitiesFromFixedGroupsEntities.espx', groupObj, function (data, status) {
        if(status=="success"){
            data= $.trim(data);
            if(data!=""){
                var entityList = JSON.parse(data);
            }
            prepareEntitiesForDisplay(entityList);
        }

    })

}

// checked Entity if its added into group
function prepareEntitiesForDisplay(entityList) {
    oldListOfEntity = [];
    $(entityList).each(function (index, entity) {
        $('input:checkbox[name=' + entity.entityid + ']').prop('checked', true);
        $('#checkboxLabel-' + entity.entityid).addClass('checked');
        oldListOfEntity.push(entity.entityid);
    });
}

// get all checked Entities
function getListOfEntities(className) {
    var contactsList = [];
    $('input:checkbox[class='+className+']:checked').each(function () {
        contactsList.push($(this).attr('name'));
    });

    return contactsList;
}

// prepare Array of Entity Object For edit
function prepareEntityArrayForEdit(totalListOfEntity, oldListOfEntity) {
    var entityObj = {"newEntities": [], "deletedEntities": []};

    for (var i = 0; i < totalListOfEntity.length; i++) {
        if (oldListOfEntity.indexOf(totalListOfEntity[i]) == -1) {
            entityObj.newEntities.push(totalListOfEntity[i]);
        }
    }

    for (var i = 0; i < oldListOfEntity.length; i++) {
        if (totalListOfEntity.indexOf(oldListOfEntity[i]) == -1) {
            entityObj.deletedEntities.push(oldListOfEntity[i]);
        }
    }

    return entityObj;
}

// Edit Group for contacts
function editContactsIntoFixedGroup(redirectUrlVal) {
    var contactList = JSON.stringify(prepareEntityArrayForEdit(getListOfEntities('contacts'), oldListOfEntity));
    var fixedGroupObj = {
        "moduleId": moduleId["CONTACT"],
        "title": $("#fixedGroupTitle").val(),
        "entities": contactList,
        "groupId": parameterObj['id']
    }
    var redirectUrl = redirectUrlVal || '/groups/fixedGroups/contacts';


    editFixedGroup(fixedGroupObj, redirectUrl);
}

// Edit Group For account
function editAccountsIntoFixedGroup(redirectUrlVal) {
    var accountList = JSON.stringify(prepareEntityArrayForEdit(getListOfEntities('accounts'), oldListOfEntity));
    var fixedGroupObj = {
        "moduleId": moduleId["ACCOUNT"],
        "title": $("#fixedGroupTitle").val(),
        "entities": accountList,
        "groupId": parameterObj['id']
    }
    var redirectUrl = redirectUrlVal || '/groups/fixedGroups/accounts';


    editFixedGroup(fixedGroupObj, redirectUrl);
}

// Edit Group For lead
function editLeadsIntoFixedGroup(redirectUrlVal) {
    var leadList = JSON.stringify(prepareEntityArrayForEdit(getListOfEntities('leads'), oldListOfEntity));
    var fixedGroupObj = {
        "moduleId": moduleId["LEAD"],
        "title": $("#fixedGroupTitle").val(),
        "entities": leadList ,
        "groupId": parameterObj['id']
    }
    var redirectUrl = redirectUrlVal || '/groups/fixedGroups/leads';


    editFixedGroup(fixedGroupObj, redirectUrl);
}

// Call AJAX file , for Edit Group
function editFixedGroup(fixedGroupObj, redirectUrl) {

    $.post("/groups/fixedGroups/editFixedGroup.espx", fixedGroupObj, function (data, status) {
        if (status == "success") {
//            console.log(data);
            window.location.href = redirectUrl;
        }
    })

}

