chrome.storage.local.get('courses_temp4', function (result) {
    console.log("sprawdzam");

    if (!result.courses_temp4) {
        console.log("brak");
        alert("Brak danych do wysłania!");
    } else {
        console.log(result.courses_temp4);
        chrome.runtime.sendMessage({
            method: 'POST',
            action: 'xhttp',
            url: 'http://localhost:5000/parse/data',
            data: result.courses_temp4
        }, function(response) {
            var responseObj = JSON.parse(response);

            chrome.runtime.sendMessage({
                action: 'open-plan-tab',
                url: responseObj.url
            });
        });
    }
});
