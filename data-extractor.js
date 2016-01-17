Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var $allTables = $(".KOLOROWA");
console.log($allTables);
var $coursesTable = $allTables.eq(3);
var $groupsTable = $allTables.eq(4);
console.log($coursesTable, $groupsTable);

var $selectedCourse = $coursesTable.find("> tbody > tr > td.WYBRANA");
var selectedCourseCode = $selectedCourse.eq(0).text().trim();
var selectedCourseName = $selectedCourse.eq(1).text().trim();

var course = {
    name: selectedCourseCode,
    id: selectedCourseCode,
    groups: {
        byIDs: {},
        length: 0
    },
    isGroupChosen: false,
    isFilterEnabled: false,
    isSelected: false
};

console.log(selectedCourseCode, selectedCourseName);

var $groupRows = $groupsTable.find("> tbody > tr:not(:eq(2)):not(:eq(1)):not(:eq(0)):not(:last):not(.uwagi_hide)");
console.log("rows with groups", $groupRows);

function createGroupFromRows($rows){
    var group = {};
    console.log($rows);
    group.id = $rows.eq(0).find("> td:eq(0)").text().trim();
    group.name = $rows.eq(0).find("> td").eq(2).text().trim();
    group.slots = $rows.eq(0).find("> td").eq(3).text().trim();

    group.teacher = $rows.eq(1).find("> td").eq(0).text().replace(/\s+/g, ' ').trim();

    course.form = group.form = $rows.eq(1).find("> td").eq(1).text().trim();
    course.name = group.name;

    var timeAndPlaceText = $rows.eq(2).find("> td tr > td").eq(0).text().trim();
    var timeAndPlaceArray = timeAndPlaceText.split(",");

    // dodac obsluge parzystosci i godziny zakonczenia kursow
    group.day = timeAndPlaceArray[0].split(" ")[0].split("/")[0];
    group.time = timeAndPlaceArray[0].split(" ")[1].split("-")[0].replace(/^0+/, '');

    group.place = timeAndPlaceArray[1].split(" ")[2]
        + " " + timeAndPlaceArray[2].split(" ")[2];

    group.isChosen = false;
    console.log("group", group);

    return group;
}

var groupsNumber = 0;

for(var i=0; i<$groupRows.length; i=i+3) {
    console.log("test", $groupRows.slice(i, i + 3));
    var group = createGroupFromRows($groupRows.slice(i, i + 3));
    course.groups.byIDs[group.id] = group;
    groupsNumber++;
}

course.groups.length = groupsNumber;
console.log("GROUPS NUMBER", groupsNumber);

saveCourse(course);

function saveCourse(course) {
    // Get a value saved in a form.
    if (!course) {
        message('Brak danych do pobrania!');
        return;
    }

    var courses = [];

    chrome.storage.local.get('courses_temp3', function (result) {
        console.log("sprawdzam");

        if(!result.courses_temp3){
            console.log("brak");
            courses = {
                byIDs: {}
            }
        } else {
            courses = result.courses_temp3;
        }


        courses.byIDs[course.id] = course;
        console.log(courses);
        chrome.storage.local.set({'courses_temp3': courses}, function() {
            // Notify that we saved.
            console.log('Zapisano!', "liczba kursów w pamięci: ", Object.size(courses.byIDs));
        });
    });


    /*
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'value': theValue}, function() {
        // Notify that we saved.
        message('Zapisano!');
    });*/
}
