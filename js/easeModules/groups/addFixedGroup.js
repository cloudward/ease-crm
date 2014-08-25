/**
 * Created by shivali.patel on 7/30/14.
 */
var urlVal ,  parameterObj, keysOfParameter;
$(document).ready(function(){

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

})

function getListOfEntities(className){
    var contactsList=[];
    $('input:checkbox[class='+className+']:checked').each(function(){
        contactsList.push($(this).attr('name'));
    });

    return contactsList;
}

// save Group for Contacts
function saveContactsIntoFixedGroup(){
    var contactList=JSON.stringify(getListOfEntities('contacts'));
    var fixedGroupObj={
        moduleId:moduleId["CONTACT"],
        title:$("#fixedGroupTitle").val(),
        entities:contactList
    }
    var redirectUrl="/groups/fixedGroups/contacts";
    saveFixedGroup(fixedGroupObj,redirectUrl);
}

// save Group for Account
function saveAccountsIntoFixedGroup(){
    var accountList=JSON.stringify(getListOfEntities('accounts'));
    var fixedGroupObj={
        moduleId:moduleId["ACCOUNT"],
        title:$("#fixedGroupTitle").val(),
        entities:accountList
    }
    var redirectUrl="/groups/fixedGroups/accounts";
    saveFixedGroup(fixedGroupObj,redirectUrl);
}

// save Group for Leads
function saveLeadsIntoFixedGroup(){
    var accountList=JSON.stringify(getListOfEntities('leads'));
    var fixedGroupObj={
        moduleId:moduleId["LEAD"],
        title:$("#fixedGroupTitle").val(),
        entities:accountList
    }
    var redirectUrl="/groups/fixedGroups/leads";
    saveFixedGroup(fixedGroupObj,redirectUrl);
}


// Call AJAX file, for save groups
function saveFixedGroup(fixedGroupObj,redirectUrl){

    $.post("/groups/fixedGroups/saveFixedGroup.espx",fixedGroupObj,function(data,status){
        if(status=="success"){
            window.location.href=redirectUrl;
        }
    })

}

