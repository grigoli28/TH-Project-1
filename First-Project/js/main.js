'use strict';




let studentNames = ['Grigol Tchkoidze 1', 'Grigol Tchkoidze 2', 'Grigol Tchkoidze 3', 'Grigol Tchkoidze 4', 'Grigol Tchkoidze 5', 'Grigol Tchkoidze 6', 'Grigol Tchkoidze 7', 'Grigol Tchkoidze 8', 'Grigol Tchkoidze 9', 'Grigol Tchkoidze 10'];

let studCount = 10;
let students = [];

for (let i = 0; i < studCount; i++) {
    students.push(new Student(studentNames[i], i));
}

function updateStudGradeAvg() {
    document.querySelector(`#stud-${this.dataset.id}`).textContent = Math.round(students[Number(this.dataset.id)].getGradeAvg() * 10) / 10;
}



// #region
// function validateGrade(grade) { !!! review
//     if (isNaN(Number(grade)) || grade == '') { // if user enters characters or empty string
//         alert("Error Please Try Again!");
//         return getPrompt.call(this); // call getPrompt function again for the current object
//     }
//     if (grade == null) {
//         alert("You Canceled!");
//         return 0;
//     }
//     grade = Math.round(Number(grade));
//     if (grade < 0) grade = 0;
//     if (grade > 5) grade = 5;
//     return grade;
// }
// #endregion


function updateTotalGradeAvg() {
    let allGradesTotal = 0;
    for (let student of students) {
        allGradesTotal += student.getGradeAvg();
    }
    document.querySelector('#avg-grade').textContent = Math.round(allGradesTotal / students.length * 10) / 10;
}




/* Prompt user for a student's grade */
function getPrompt() {
    let studGrade = prompt("Enter a student's grade");
    // check if user entered characters or empty string
    if (isNaN(Number(studGrade)) || studGrade == '') {
        alert("Error Please Try Again!");
        return getPrompt.call(this) // call getPrompt again to let user re-enter student's grade
    }
    if (studGrade == null) return; // check if user pressed ESC or Cancel
    studGrade = Math.round(Number(studGrade));
    if (studGrade < 0) studGrade = 0; // check if user entered a negative number
    if (studGrade > 5) studGrade = 5; // check if user entered a number larger than 5
    // studGrade = validateGrade.call(this, studGrade); !!!review
    setGradeAndColor.call(this, studGrade); // set box color according to grade

    students[Number(this.dataset.id)].setGrade(studGrade, Number(this.parentElement.dataset.colIndex));

    if (studGrade != 0) {
        if (this.dataset.missed == 'true') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = false;
        }
    } else {
        if (this.dataset.missed == 'false') {
            this.dataset.missed = true;
            missedLessons.dataset.count = Number(missedLessons.dataset.count) + 1;
            missedLessons.textContent = missedLessons.dataset.count;
        }
    }

    updateStudGradeAvg.call(this);
    updateTotalGradeAvg();
}







/* adds prmopt function on newly added column */
function addPrompts() {
    let gradeNodesList = Array.from(document.querySelectorAll('.grade__item'));
    for (let node of gradeNodesList) {
        node.addEventListener('click', getPrompt); // !!!important (when used arrow function, prompt window appears on other columns more than once after deleting a column)
    }
}

let totalStudents = document.querySelector('#tot-stud');
totalStudents.dataset.count = students.length;
totalStudents.textContent = totalStudents.dataset.count;

let totalDays = document.querySelector('#tot-days');

let missedLessons = document.querySelector('#miss-less');
let gradeTable = document.querySelector('.grades'); // gets grade table reference node

/* removeLastDay removes last added day from table */
function removeLastDay() {
    if (gradeTable.lastChild != null) {
        for (let item of gradeTable.lastChild.children)
            if (item.dataset.missed == "true") missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
        missedLessons.textContent = missedLessons.dataset.count;
        gradeTable.removeChild(gradeTable.lastChild); // removes last column (day) from grade table
    }
    if (totalDays.dataset.count != '0') {
        totalDays.dataset.count = Number(totalDays.dataset.count) - 1;
        totalDays.textContent = totalDays.dataset.count;
    }

    for (let student of students) {
        student.popGrade();
        document.querySelector(`#stud-${student.getID()}`).textContent = Math.round(student.getGradeAvg() * 10) / 10;
    }
    updateTotalGradeAvg();
}



/* newColObject is template for new column added by "Add Day" button */
let newColObject = {
    mainSelector: '.grades',
    parent: {
        element: 'div',
        index: 0,
        attributes: {
            'class': 'grade__col'
        }
    },
    firstChild: {
        element: 'div',
        content: `Day ${new Date().getDay() + 1}`,
        attributes: {
            'class': 'grade__date'
        }
    },
    otherChilds: {
        element: 'div',
        count: 10,
        content: '0',
        attributes: {
            'class': 'grade__item'
        }
    }
}


function createNewDay() {
    generateHTML(newColObject);
    totalDays.dataset.count = Number(totalDays.dataset.count) + 1;
    totalDays.textContent = totalDays.dataset.count;

    missedLessons.dataset.count = Number(missedLessons.dataset.count) + students.length;
    missedLessons.textContent = missedLessons.dataset.count;

    for (let student of students) {
        student.pushGrade(0);
        document.querySelector(`#stud-${student.getID()}`).textContent = Math.round(student.getGradeAvg() * 10) / 10;
    }
    updateTotalGradeAvg();
}



// Add event on mouse click to create new day in table
let addDayBtn = document.querySelector("#add-day");
addDayBtn.addEventListener('click', createNewDay);
addDayBtn.addEventListener('click', addPrompts);

// Add event on mouse click to remove last day from table
let removeDayBtn = document.querySelector("#rm-day");
removeDayBtn.addEventListener('click', removeLastDay);

// Add event on mouse click to update table and statistic info
let updateTableBtn = document.querySelector("#upd-tb");
updateTableBtn.addEventListener('click', () => alert('Test'));






// let startingDate = new Date(Date.UTC(2018, 3, 30));
// let startingDate2 = new Date(2018, 3, 30);
// console.log(startingDate);
// console.log(startingDate2);
// console.log(startingDate.getHours());
// console.log(startingDate2.getHours());
// console.log(startingDate.getDate());
// console.log(startingDate2.getDate());
// console.log(Date());

//#endregion