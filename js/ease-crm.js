function autoCompleteChanged(search, container, url, keyCode) {
    var i=0;
    if(keyCode == 27 || (search == "" && keyCode == 8)) {

        $("#" + container).css("display", "none");
    } else if(keyCode == 40) {
        ++i;
        console.log(i);
//        if($("#" + container + " .elementActive").index($("#" + container))==-1){
            $("#referenceId-"+i).mouseover();
            $("#referenceId-"+(i-1)).mouseleave();
//        }

    }

    else if(search != ""){


        $.get(url + "?search=" + search, function(data, status) {

            data = data.trim();
            if(data && data != "") {

                $("#" + container).css("display", "block");
                $("#" + container).html(data);
            } else {

                $("#" + container).css("display", "none");
            }
           
        });
    }
};


function onMouseOverElement(event) {

    $(event.target).addClass("elementActive");
}

function onMouseOutElement(event) {

    $(event.target).removeClass("elementActive");
}
