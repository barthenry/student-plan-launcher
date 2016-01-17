/**
 * Created by Henry on 2016-01-10.
 */
/*
console.log($(".KOLOROWA"));
var $allTables = $(".KOLOROWA");
console.log($allTables);
var $coursesTable = $allTables.eq(3);
var $groupsTable = $allTables.eq(4);
console.log($coursesTable, $groupsTable);

var $coursesLines = $coursesTable.find("> tbody > tr");
console.log($coursesLines);

$coursesLines.each(function(line){
    var tds = line.find("> td");
    tds.each(function(td){
        console.log(td.text());
    });

});*/

function doWork(){
    console.log("TEST 1322");
    $(document).ready(function() {
        alert("test");
        console.log($(".KOLOROWA"));
        var $allTables = $(".KOLOROWA");
        console.log($allTables);
        var $coursesTable = $allTables.eq(3);
        var $groupsTable = $allTables.eq(4);
        console.log($coursesTable, $groupsTable);

        var $coursesLines = $coursesTable.find("> tbody > tr:not(:first):not(:last)");
        console.log("courses lines", $coursesLines);

        var courses = [];

        $coursesLines.each(function () {
            //console.log(line2);
            var courseCode = $(this).find("> td:eq(0)").text().trim();
            var coursePage = $(this).find("> td:eq(0) > a").attr("href").trim();
            var coursePageLink = $(this).find("> td:eq(0) > a")[0];
            var courseName = $(this).find("> td:eq(1)").text().trim();
            console.log(courseCode, courseName, coursePage);
            //coursePageLink.click();
            var course = {
                courseCode: courseCode,
                coursePage: coursePage,
                coursePageLink: coursePageLink,
                courseName: courseName
            };

            courses.push(course);
        });
        console.log(courses[4].coursePageLink);
        courses[4].coursePageLink.click();
        doWork();
    });
}

doWork();