var express = require("express");
var router = express();
// var bodyParser = require("body-parser");
var fetch = require('node-fetch');
var course = require("../models/course.js");
var data = null;
var courses = [];
var departments = [];
var terms = {
    2: "Fall",
    5: "Winter",
    6: "Fall",
    9: "Summer",
    12: "Fall/Winter/Summer",
    13: "Fall/Winter/Summer"
}

router.get("/", function (req, res) {
   res.render("index"); 
});

fetch('https://www.timetablegenerator.io/api/v2/school/mcmaster')
    .then(res => res.json())
    .then((body) => {
        makeCourse(body);
}).catch(err => console.error(err));

const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function makeCourse(data) {
    
    // Fill Departments array to fill the drop down menu
    for (var dpt in data.departments) {
        departments.push([dpt, data.departments[dpt]]);
    }
    departments.sort(function(a, b) {
		var x=a[1].toLowerCase(),
			y=b[1].toLowerCase();
		return x<y ? -1 : x>y ? 1 : 0;
	});
    //Add last update of the api to read it later, it is added to the end of array
    departments.push(new Date(data.timetables["2018"]["6"].last_update).toGMTString());
    
    //Make the course object for each course and put it in array 
    // i is the year 
    for (var i in data.timetables) {
        // console.log(i)
        
        //j is the inside year that is 6 or 13
        for (var j in data.timetables[i]) {
            // console.log(j);
            
            // k is inside 6 or 13 that is last update and courses
            for (var k in data.timetables[i][j]) {
                // console.log(k)
                
                // l is inside k which is the main outer course, inside courses
                for (var l in data.timetables[i][j][k]) {
                    var crs = data.timetables[i][j][k][l];
                    // console.log(crs);
                    
                    // m is inside sections that is C, T or L
                    for (var m in crs["sections"]) {
                        var sec = crs["sections"][m];
                        // console.log(sec);
                        
                        // n is inside sec, so C01 or T01 etc
                        for (var n in sec) {
                            // console.log(n);
                            var rPeriod = sec[n]["r_periods"];
                            
                            // o is everything inside rPeriod so like start, end, room etc.
                            for (var o in rPeriod) {
                                var insideRperiod = rPeriod[o];
                                // console.log(Object.keys(insideRperiod).length);
                                
                                var code =  crs["code"];
                                var name = crs["name"];
                                var dpt = crs["department"];
                                var section = n;
                                var start = insideRperiod["start"];
                                if (start == undefined) {start = "N/A"}
                                var day = insideRperiod["day"];
                                if (day == undefined) {day = 7}
                                var end = insideRperiod["end"];
                                if (end == undefined) {end = "N/A"}
                                var room = insideRperiod["room"];
                                var prof = insideRperiod["supervisors"][0];
                                var term = insideRperiod["term"];
                                term = terms[term];
                                // term = term == 5 ? term = 2 : term = Math.floor(term/2);
                                // term = term == 1 ? term = "Fall" : term == 2 ? term = "Winter" : "Summer";
                                var credits = crs["credits"];
                                console.log(credits);
                                var section_full = sec[n]["section_full"];
                                console.log(section_full)
                                var eachCrs = new course.course(code, name, dpt, section, start, day, end, room, prof, term, credits, section_full);
                                courses.push(eachCrs);
                            }
                        }
                    }
                }
            }
        }
    }
    
    data = {
        'departments': departments,
        'courses': courses
    }
    
    router.get('/getData',function(req, res) {
        res.send(data);
        res.end;
    });
}

// setTimeout(() => console.log(courses.length), 1000);

function getDepartments() {
    return departments;
}

function getCourses() {
    return courses;
}

module.exports = router;