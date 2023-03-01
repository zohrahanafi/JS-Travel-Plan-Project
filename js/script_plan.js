"use strict";
var httpRequest = false;
var list = [];

var zip = document.getElementById("zip");
if (zip.addEventListener) {
    zip.addEventListener("keyup", checkInput, false);
} else if (zip.attachEvent) {
    zip.attachEvent("onkeyup", checkInput);
}

function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    }
    catch (requestError) {
        // display city & state fields and labels for manual input
        document.getElementById("csset").style.visibility = "visible";
        // remove event listeners so additional input is ignored
        var zip = document.getElementById("zip").value;
        if (zip.addEventListener) {
            zip.removeEventListener("keyup", checkInput, false);
        } else if (zip.attachEvent) {
            zip.detachEvent("onkeyup", checkInput);
        }
        return false;
    }
    return httpRequest;
}

function checkInput() {
    var zip = document.getElementById("zip").value;
    if (zip.length === 5) {
        getLocation();
    } else {
        document.getElementById("city").value = "";
        document.getElementById("state").value = "";
    }
}

function getLocation() {
    var zip = document.getElementById("zip").value;
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", "http://api.zippopotam.us/us/" +
        zip, true);
    httpRequest.send();
    httpRequest.onreadystatechange = displayData;
}

function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var resultData = JSON.parse(httpRequest.responseText);
        var city = document.getElementById("city");
        var state = document.getElementById("state");
        city.value = resultData.places[0]["place name"];
        state.value = resultData.places[0]
        ["state abbreviation"];
        document.getElementById("zip").blur();
        document.getElementById("csset").style.visibility ="visible";
    }
}


// to add items to list
function generateList() {
    var olElement = document.querySelector("ol");
    var listItems = olElement.getElementsByTagName("li");
    for (var i = listItems.length - 1; i >= 0; i--) {
        olElement.removeChild(listItems[i]);
    }
    for (var i = 0; i < list.length; i++) {
        var newItem = "<span class='first'>first</span>" + "<span class='last'>last</span>" + list[i];
        var newListItem = document.createElement("li");
        newListItem.innerHTML = newItem;
        document.getElementsByTagName("ol")[0].
            appendChild(newListItem);
        var firstButtons = document.querySelectorAll(".first");
        var lastFirstButton = firstButtons[firstButtons.length - 1];
        var lastButtons = document.querySelectorAll(".last");
        var lastLastButton = lastButtons[lastButtons.length - 1];
        if (lastFirstButton.addEventListener) {
            lastFirstButton.addEventListener("click", moveToTop, false);
            lastLastButton.addEventListener("click", moveToBottom, false);
        } else if (lastFirstButton.attachEvent) {
            lastFirstButton.attachEvent("onclick", moveToTop);
            lastLastButton.attachEvent("onclick", moveToBottom);
        }
    }
    // display the content
    document.getElementById("div_result").style.visibility = "visible";
    document.getElementById("h_cities").style.visibility = "visible";

    //if we have more than 4 items we can register:
    if (list.length >= 4) {
        document.getElementById("registration").style.visibility = "visible";
    }
}

function addItem() {
    var city = document.getElementById("city");
    var state = document.getElementById("state");
    list.push(city.value.concat(", ", state.value));
    city.focus(); state.focus();
    city.value = ""; state.value = "";
    generateList();
}

function moveToTop(evt) {
    if (evt === undefined) { // get caller element in IE8
        evt = window.event;
    }
    var callerElement = evt.target || evt.srcElement;
    var listItems = document.getElementsByTagName("li");
    var parentItem = callerElement.parentNode;
    for (var i = 0; i < list.length; i++) {
        if (parentItem.innerHTML.search(list[i]) !== -1) {
            var itemToMove = list.splice(i, 1);
            list.unshift(itemToMove);
        }
    }
    generateList();
}

function moveToBottom(evt) {
    if (evt === undefined) { // get caller element in IE8
        evt = window.event;
    }
    var callerElement = evt.target || evt.srcElement;
    var listItems = document.getElementsByTagName("li");
    var parentItem = callerElement.parentNode;
    for (var i = 0; i < list.length; i++) {
        if (parentItem.innerHTML.search(list[i]) !== -1) {
            var itemToMove = list.splice(i, 1);
            list.push(itemToMove);
        }
    }
    generateList();
}

function createEventListener() {
    var addButton = document.getElementById("button");
    if (addButton.addEventListener) {
        addButton.addEventListener("click", addItem, false);
    } else if (addButton.attachEvent) {
        addButton.attachEvent("onclick", addItem);
    }
}
if (window.addEventListener) {
    window.addEventListener("load", createEventListener, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", createEventListener);
}
