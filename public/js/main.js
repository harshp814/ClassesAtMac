var departments = null;
var courses = null;
var lastUpdated = null;
var weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat", "N/A"];
var resultToDisplay =  [];
var lecture = null;
var tutorial = null;
var lab = null;

$.ajax({
    url:'/getData',
    type:"GET"
}).done(function (data) {
    departments = data['departments'];
    courses = data['courses'];
    lastUpdated = departments.pop();
    
    $("#lastUpdated").text("Last Updated: " + lastUpdated);
    
    populateDpts();
    populateDays();
    // separateCourses();
});

//Populate the drop down menu for departments 
function populateDpts() {
    $.each(departments, function(i, dpt) {
        $('#selectDpt').append($("<option/>", {
            value: departments[i][0],
            text: departments[i][1]
        }));
    });
}

//Populate the drop down menu for days
function populateDays() {
    for (var i = 1; i < weekdays.length; i++) {
        $('#weekDays').append($('<option>', {
            value: i,
            text: weekdays[i]
        }));
    }
}

$( "#setTime" ).on( "change", function() {
  $("#selectDpt").val('Select a Department');
});

$( "#selectDpt" ).on( "change", function() {
  $("#setTime").val('');
});

function displayData() {
    var selectedDpt = $("#selectDpt").val();
    var selectedDay = $("#weekDays").val();
    var inputCourse = $("#courseCode").val();
    var checkbox = $("#checkbox").is(":checked");
    var selectedTime = $("#setTime").val();
    
    $("#courseCode").val('');
    
    $( "#frown" ).remove();
    $( "#error" ).remove();
    
    if (inputCourse.length !== 0 && selectedDpt) {
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].code.includes(inputCourse.toUpperCase()) && selectedDpt === courses[i].department) {
                resultToDisplay.push(courses[i]);
            } 
        }
        
        resultToDisplay.sort(function(a, b) {
            return a.day - b.day;
        });
        
    } else if (selectedDpt && selectedDay) {
        for (var i = 0; i < courses.length; i++) {
            if (selectedDpt === courses[i].department && courses[i].day === Number(selectedDay)) {
                if (checkbox) {
                    var month = new Date().getMonth();
                    
                    if (month >= 8 && month <= 11 && courses[i].term.includes("Fall")) {
                        resultToDisplay.push(courses[i]);  
                    } else if (month >= 0 && month <= 3 && courses[i].term.includes("Winter")) {
                        resultToDisplay.push(courses[i]);  
                    } else if (month >= 4 && month <= 7 && courses[i].term.includes("Summer"))  {
                        resultToDisplay.push(courses[i]);  
                    }
                    
                } else {
                    resultToDisplay.push(courses[i]);   
                }
            }
        }
        
        resultToDisplay.sort(function(a, b) {
            if (parseInt(a.start.split(":")[0]) - parseInt(b.start.split(":")[0]) === 0) {
                return parseInt(a.start.split(":")[1]) - parseInt(b.start.split(":")[1]);
            } else {
                return parseInt(a.start.split(":")[0]) - parseInt(b.start.split(":")[0]);
            }
        });
        
    } else if (selectedDay && selectedTime) {
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].day === Number(selectedDay) && courses[i].start === selectedTime) {
                if (checkbox) {
                    var month = new Date().getMonth();
                    
                    if (month >= 8 && month <= 11 && courses[i].term === "Fall") {
                        resultToDisplay.push(courses[i]);  
                    } else if (month >= 0 && month <= 3 && courses[i].term === "Winter") {
                        resultToDisplay.push(courses[i]);  
                    } else if (month >= 4 && month <= 7 && courses[i].term === "Summer")  {
                        resultToDisplay.push(courses[i]);  
                    }
                    
                } else {
                    resultToDisplay.push(courses[i]);   
                }
            }
        }
        
        resultToDisplay.sort(function(a, b){
            var x = a.department.toLowerCase();
            var y = b.department.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
    }
    
    displayCards(resultToDisplay)
}


function displayCards(resultToDisplay) {
    lecture = document.getElementById("lecture");
    tutorial = document.getElementById("tutorial");
    lab = document.getElementById("lab");
    lecture.innerHTML = "";
    tutorial.innerHTML = "";
    lab.innerHTML = "";
    
    if (resultToDisplay.length !== 0) {
        resultToDisplay.forEach(function(course) {
        
            if (course.section.includes("C")) {
                lecture.innerHTML += `<div id="lectureCard">
                                        <div style="margin-bottom:0.45em;" class="d-flex justify-content-between">
                                            <div>${course.code} - ${course.section}</div><div>${course.term}</div>   
                                        </div>
                                        <p style="margin-bottom:0.45em;">Name: ${course.name}</p> 
                                        
                                       <div class="row">
                                            <div class="col">
                                                <p>Day: ${weekdays[course.day]}</p>
                                                <p>Time: ${course.start} - ${course.end}</p>
                                            </div>
                                            <div class="col">
                                                <p>Room: ${course.room}</p>
                                                <p>Prof: ${course.prof}</p>
                                            </div> 
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <p>Credits: ${course.credits}</p>
                                            </div>
                                            <div class="col">
                                                <p>section_full: ${course.section_full}</p>
                                            </div> 
                                        </div>
                                    </div>`;
            } else if (course.section.includes("T")) {
                tutorial.innerHTML += `<div id="tutorialCard">
                                        <div style="margin-bottom:0.45em;" class="d-flex justify-content-between">
                                            <div>${course.code} - ${course.section}</div><div>${course.term}</div>   
                                        </div>
                                        <p style="margin-bottom:0.45em;">Name: ${course.name}</p> 
                                        
                                        <div class="row">
                                            <div class="col">
                                                <p>Day: ${weekdays[course.day]}</p>
                                                <p>Time: ${course.start} - ${course.end}</p>
                                            </div>
                                            <div class="col">
                                                <p>Room: ${course.room}</p>
                                                <p>Prof: ${course.prof}</p>
                                            </div> 
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <p>Credits: ${course.credits}</p>
                                            </div>
                                            <div class="col">
                                                <p>section_full: ${course.section_full}</p>
                                            </div> 
                                        </div>
                                    </div>`;
            } else {
                lab.innerHTML += `<div id="labCard">
                                    <div style="margin-bottom:0.45em;" class="d-flex justify-content-between">
                                        <div>${course.code} - ${course.section}</div><div>${course.term}</div>   
                                    </div>
                                    <p style="margin-bottom:0.45em;">Name: ${course.name}</p> 
                                    
                                    <div class="row">
                                        <div class="col">
                                            <p>Day: ${weekdays[course.day]}</p>
                                            <p>Time: ${course.start} - ${course.end}</p>
                                        </div>
                                        <div class="col">
                                            <p>Room: ${course.room}</p>
                                            <p>Prof: ${course.prof}</p>
                                        </div> 
                                    </div>
                                    <div class="row">
                                            <div class="col">
                                                <p>Credits: ${course.credits}</p>
                                            </div>
                                            <div class="col">
                                                <p>Section_full: ${course.section_full}</p>
                                            </div> 
                                        </div>
                                </div>`;
            }
                            
        });
    } else {
        var display = document.getElementById("display");
        $( "#frown" ).remove();
        $( "#error" ).remove();
        display.innerHTML +=    `<div id="frown">
                                    <i class="fas fa-frown"></i>
                                </div>
                                <div id="error">
                                    No results found for the given query!!
                                </div>`; 
    }
}


//Find matches for the course code input
// function findMatches(codeToMatch, courses) {
//     return courses.filter(code => {
//         const regex = new RegExp(codeToMatch, 'gi');
//         return code.code.match(regex)
//     });
// }

// //display the look ahead matches 
// function displayLookAhead() {
//     const matchArray = findMatches(this.value, courses);
//     const html = matchArray.map(code => {
//       return `
//       <li> 
//         <span> ${code.code} </span>
//         </li>
//       `; 
//     }).join('');
//     lookAhead.innerHTML = html;
// }

// const codeInput = document.querySelector('#courseCode');
// const lookAhead = document.querySelector("#lookAhead");
// codeInput.addEventListener('change', displayLookAhead);
// codeInput.addEventListener('keyup', displayLookAhead);


$("input[type=checkbox]").on('change', function () {
    $(this).parent().toggleClass("highlight");
});


$("#searchBtn").click(() => {resultToDisplay=[]; displayData();});

$(function() {
    $("form").submit(function() { return false; });
});