chrome.storage.local.get('courses_temp2', function (result) {
    console.log("sprawdzam");

    if (!result.courses_temp2) {
        console.log("brak");
        alert("Brak danych do wysłania!");
    } else {
        console.log(result.courses_temp2);
        chrome.runtime.sendMessage({
            method: 'POST',
            action: 'xhttp',
            url: 'http://localhost:5000/parse/data',
            data: result.courses_temp2
        }, function(response) {
            console.log(response);
            chrome.runtime.sendMessage({
                action: 'open-plan-tab',
                url: response.url
            });
        });
    }
});
