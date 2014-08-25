/**
 * Created by shivali.patel on 6/25/14.
 */


function retrieveCompletedDateDuration(date, format) {

    var pastDate = moment(date, format);

    var duration = moment(pastDate).fromNow();

    //console.log(date);
    //console.log(format);
    return duration;
}

function retrieveDueDateDuration(date, format) {

    format=format || "DD/MM/YYYY hh:mm A";

    var dueDate = moment(date, format);
  //  console.log(dueDate);
    var duration = moment(dueDate).fromNow();
//    console.log(duration);
    if (duration.indexOf("ago") > -1) {
        duration = duration.replace("ago", "");
    }

    var currentDateTime = moment(new Date());
    var diff = currentDateTime.diff(dueDate, 'seconds');

    /* console.log(dueDate);
     console.log(currentDateTime);
     console.log(diff);
     */
    if (diff < 0) {
        duration = "Due " + duration;
    }
    else {
        duration = duration + " Overdue";
    }
    return duration;
}


function properNumberFormat(num){
    num=Number(jQuery.trim(num));
    num=num.toFixed(2).replace(/./g, function(value, index, number) {
        console.log(value)
        return index && value !== "." && !((number.length - index) % 3) ? ',' + value : value;
    });

    return num;
}


function compareWithCurrentDt(date,format){

    var dateVal= moment(date, format);
    var currentDateTime = moment(new Date());
    var diff = currentDateTime.diff(dateVal, 'seconds');

    return diff;


}