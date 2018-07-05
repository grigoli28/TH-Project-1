'use strict';

let studentNames = [
    'Grigol Tchkoidze 1',
    'Grigol Tchkoidze 2',
    'Grigol Tchkoidze 3',
    'Grigol Tchkoidze 4',
    'Grigol Tchkoidze 5',
    'Grigol Tchkoidze 6',
    'Grigol Tchkoidze 7',
    'Grigol Tchkoidze 8',
    'Grigol Tchkoidze 9',
    'Grigol Tchkoidze 10',
];

let studentCount = 10;
let techubStudents = [];

for (let i = 0; i < studentCount; i++) {
    techubStudents.push(new Student(studentNames[i], i));
}

function updateTotalGradeAvg() {
    let gradesTotal = 0;
    for (let student of techubStudents) {
        gradesTotal += student.getGradeAvg();
    }
    document.querySelector('#avg-grade').textContent = Math.round(gradesTotal / techubStudents.length * 10) / 10;
}

/* adds prmopt window on each grade box in newly added column*/
function addPromptWindows() {
    let gradeBoxes = Array.from(document.querySelectorAll('.grade__item'));
    for (let node of gradeBoxes) {
        node.addEventListener('click', getPrompt); // !!!important (when used arrow function, prompt window appears on other columns more than once after deleting a column)
    }
}


let totalTechubStudents = document.querySelector('#tot-stud');

totalTechubStudents.dataset.count = techubStudents.length;
totalTechubStudents.textContent = totalTechubStudents.dataset.count;


let missedLessons = document.querySelector('#miss-less');



/* Prompt user for a student's grade */
function getPrompt() {
    let studentGrade = prompt("Enter a student's grade");
    // check if user entered characters or empty string
    if (isNaN(Number(studentGrade)) || studentGrade == '') {
        alert("Error! Please Enter a Number!");
        return getPrompt.call(this) // call getPrompt again to let user re-enter student's grade
    }
    if (studentGrade == null) return; // check if user pressed ESC or Cancel
    studentGrade = Math.round(Number(studentGrade));
    if (studentGrade < 0) studentGrade = 0; // check if user entered a negative number
    if (studentGrade > 5) studentGrade = 5; // check if user entered a number larger than 5
    // studentGrade = validateGrade.call(this, studentGrade); !!!review
    setGradeAndColor.call(this, studentGrade); // set box color according to grade

    techubStudents[Number(this.dataset.id)].setGrade(studentGrade, Number(this.parentElement.dataset.colIndex));

    if (studentGrade != 0) {
        if (this.dataset.missed == 'true') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = false;
        }
    } else {
        if (this.dataset.missed == 'false') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) + 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = true;
        }
    }
    document.querySelector(`#stud-${this.dataset.id}`).textContent = Math.round(techubStudents[Number(this.dataset.id)].getGradeAvg() * 10) / 10;
    updateTotalGradeAvg();
}


/* newColumn is template for new column added by "Add Day" button */
let newColumn = {
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
        content: '',
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



let totalDays = document.querySelector('#tot-days');

function createNewDay() {
    newColumn.firstChild.content = new Techubdate().getFullDate(); // to create new Techubdate every time user adds new day
    generateHTML(newColumn);
    newColumn.parent.index += 1;
    totalDays.dataset.count = Number(totalDays.dataset.count) + 1;
    totalDays.textContent = totalDays.dataset.count;

    missedLessons.dataset.count = Number(missedLessons.dataset.count) + techubStudents.length;
    missedLessons.textContent = missedLessons.dataset.count;

    for (let student of techubStudents) {
        student.pushGrade(0);
        document.querySelector(`#stud-${student.getID()}`).textContent = Math.round(student.getGradeAvg() * 10) / 10;
    }
    updateTotalGradeAvg();
}

let gradeTable = document.querySelector('.grades'); // gets grade table reference node

/* removeLastDay removes last added day from table */
function removeLastDay() {
    Techubdate.resetToPrevDate();
    newColumn.parent.index -= 1;
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
    for (let student of techubStudents) {
        student.popGrade();
        document.querySelector(`#stud-${student.getID()}`).textContent = Math.round(student.getGradeAvg() * 10) / 10;
    }
    updateTotalGradeAvg();
}


// Add event on mouse click to create new day in table
let addDayBtn = document.querySelector("#add-day");
addDayBtn.addEventListener('click', createNewDay);
addDayBtn.addEventListener('click', addPromptWindows);

// Add event on mouse click to remove last day from table
let removeDayBtn = document.querySelector("#rm-day");
removeDayBtn.addEventListener('click', removeLastDay);


// for (let i =0; i < 7;i++){
//     console.log(new Techubdate().getFullDate())
// }



//#region 
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