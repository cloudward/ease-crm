/**
 * Created by shivali.patel on 8/1/14.
 */

function onDeleteFixedGroup(groupId, redirectUrl) {

    if (confirm("Are you sure, you want to delete this Group ?") == true) {
        $.get('/groups/fixedGroups/deleteFixedGroup?id=' + groupId, function (data, status) {

            if (status == "success") {
//                console.log(data);
                window.location.href = redirectUrl;
            }

        })
    }

}


function onDeleteDynamicGroup(groupId, redirectUrl) {

    if (confirm("Are you sure, you want to delete this Group ?") == true) {
        $.get('/groups/dynamicGroups/deleteDynamicGroup?id=' + groupId, function (data, status) {

            if (status == "success") {
//                console.log(data);
                window.location.href = redirectUrl;
            }

        })
    }

}

