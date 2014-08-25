/**
 * Created by shivali.patel on 6/26/14.
 */

var taskAndActivityModuleId = {
    CONTACT: 1,
    ACCOUNT: 2,
    LEAD: 3,
    OTHER: -1

};

var taskAddedAs = {
    TASK: 1,
    ACTIVITY: 2
};

var taskAndActivityStatus = {
    PENDING_TASK: 0,
    COMPLETED_TASK: 1

};

var userRole = {
    SUPER_ADMIN: 0,
    ADMIN: 1,
    USER: 2
}

var moduleId = {
    CONTACT: 1,
    ACCOUNT: 2,
    LEAD: 3,
    TASK_AND_ACTIVITY: 4
}

var urlForListViewOfEntityInDynamicGroup = {
    CONTACT: "groups/dynamicGroups/contacts/details",
    ACCOUNT: "groups/dynamicGroups/accounts/details",
    LEAD: "groups/dynamicGroups/leads/details"
}