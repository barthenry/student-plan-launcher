'use strict';

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

(function() {
    function ScriptExecution(tabId) {
        this.tabId = tabId;
    }

    ScriptExecution.prototype.executeScripts = function(fileArray) {
        fileArray = Array.prototype.slice.call(arguments); // ES6: Array.from(arguments)
        return Promise.all(fileArray.map(file => exeScript(this.tabId, file))).then(() => this); // 'this' will be use at next chain
    };

    ScriptExecution.prototype.executeCodes = function(fileArray) {
        fileArray = Array.prototype.slice.call(arguments);
        return Promise.all(fileArray.map(code => exeCodes(this.tabId, code))).then(() => this);
    };

    ScriptExecution.prototype.injectCss = function(fileArray) {
        fileArray = Array.prototype.slice.call(arguments);
        return Promise.all(fileArray.map(file => exeCss(this.tabId, file))).then(() => this);
    };

    function promiseTo(fn, tabId, info) {
        return new Promise(resolve => {
            fn.call(chrome.tabs, tabId, info, x => resolve());
        });
    }

    function exeScript(tabId, path) {
        let info = { file : path, runAt: 'document_end' };
        return promiseTo(chrome.tabs.executeScript, tabId, info);
    }

    function exeCodes(tabId, code) {
        let info = { code : code, runAt: 'document_end' };
        return promiseTo(chrome.tabs.executeScript, tabId, info);
    }

    function exeCss(tabId, path) {
        let info = { file : path, runAt: 'document_end' };
        return promiseTo(chrome.tabs.insertCSS, tabId, info);
    }

    window.ScriptExecution = ScriptExecution;
})();



chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    new ScriptExecution(tab.id)
        .executeScripts("jquery-1.11.3.js", "data-extractor.js")
        .then(console.log("poszlo!"));
});

function sendData(){
    chrome.storage.local.get('courses_temp2', function (result) {
        console.log("sprawdzam");

        if(!result.courses_temp4){
            alert("Brak danych do przesłania!");
        } else {
            var howMuch = Object.size(result.courses_temp2.byIDs);
            alert("prześlę kursy: "+howMuch)
        }
    });
}

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    title: "Utwórz plan",
    contexts: ["browser_action"],
    onclick:
    /*function(){
        chrome.storage.local.get('courses_temp2', function (result) {
            console.log("sprawdzam");

            if (!result.courses_temp2) {
                console.log("brak");
                alert("Brak danych do wysłania!");
            } else {
                console.log("WYSYLAM DO SERWERA");
                chrome.runtime.sendMessage({
                    method: 'POST',
                    action: 'xhttp',
                    url: 'http://localhost:5000/parse/data',
                    data: result.courses_temp2
                }, function(responseText, a) {
                    console.log(responseText, a);
                    /!*Callback function to deal with the response*!/
                });
            }
        });*/


    function(tab){
        new ScriptExecution(tab.id)
            .executeScripts("jquery-1.11.3.js", "data-sender.js")
            .then(console.log("wysyłam!"));
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            //xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhttp.setRequestHeader('Content-Type', 'application/json');
        }
        console.log("TUZ PRZED WYSLANIEM:", request.data);
        var data = JSON.stringify(request.data);
        xhttp.send(data);
        return true; // prevents the callback from being called too early on return
    }

    if(request.action == "open-plan-tab"){
        console.log("request ", request);
        console.log("otwieram stronę ",request.url);
        chrome.tabs.create({ url: request.url });

        chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
        
        return true;
    }

    if(request.action = "show-notification"){
        chrome.notifications.create("1", {
            title: request.title,
            message: request.message,
            type: request.type,
            iconUrl: request.iconUrl
        }, function(notId){
            console.log("Wyświetliło się!");
        });
    }
});
/*

function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}*/
