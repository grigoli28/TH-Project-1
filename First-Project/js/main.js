'use strict';

/* Student() is a constructor for a student object, with property of full name and methods: addGrade, removeLastGrade, getGradeAvg;
addGrade method adds student's grade into array;
removeLastGrade method removes student's last added grade from array;
getGradeAvg method returns grade average for student;
*/

function Student(name) {
    if (Student.count == undefined) {
        Student.count = 1;
    } else {
        Student.count++;
    }
    this.fullName = name;

    let grades = [];

    this.addGrade = function(grade) {
        grades.push(grade);
        return this;
    }

    this.removeLastGrade = function() {
        grades.pop();
        return this;
    }

    this.getGrades = function() { // This function has to be !!!removed
        for (let grade of grades) {
            console.log(grade);
        }
    }

    this.getGradeAvg = function() {
        let gradeSum = grades.reduce((total, currValue) => {
            return total + currValue;
        });
        return gradeSum / grades.length;
    }
}



/* generateHTML function takes obj as parameter and generates HTML node from it;
obj has following syntax: {
    mainSelector, (required)       // element selector in which you want to insert generated HTML
    parent (required)              // element in which you create child elements (if needed)
    {
        tagName, (required)
        content, (optional)        // inner HTML
        attributes (optional)
            {
                nameValuePair1,    // nameValuePair ==> attrName: attrValue
                nameValuePair2,
                ...
                nameValuePairN
            }
    },
    firstChild (optional)          // use this when you want first child element to be different from others, otherwise you can skip it
    {
        tagName, (optional)
        content, (optional)
        attributes (optional)
            {
                nameValuePair1,
                nameValuePair2,
                ...
                nameValuePairN
            }
    },
    otherChilds (optional)
    {
        tagName, (optional)
        count, (optional)
        content, (optional)
        attributes (optional)
            {
                nameValuePair1,
                nameValuePair2,
                ...
                nameValuePairN
            }
    }
*/
function generateHTML(obj) {
    let mainNode = document.querySelector(obj.mainSelector);
    let parentNode = document.createElement(obj.parent.element);
    for (let key in obj.parent.attributes) {
        parentNode.setAttribute(key, obj.parent.attributes[key]);
    }
    if (obj.parent.content)
        parentNode.appendChild(document.createTextNode(obj.parent.content));
    if (obj.firstChild.element) {
        let firstChildNode = document.createElement(obj.firstChild.element);
        for (let key in obj.parent.attributes) {
            firstChildNode.setAttribute(key, obj.firstChild.attributes[key]);
        }
        if (obj.firstChild.content)
            firstChildNode.appendChild(document.createTextNode(obj.firstChild.content));
        parentNode.appendChild(firstChildNode);
    }
    if (obj.otherChilds.element) {
        for (let i = 0; i < obj.otherChilds.count; i++) {
            let childNode = document.createElement(obj.otherChilds.element);
            for (let key in obj.parent.attributes) {
                childNode.setAttribute(key, obj.otherChilds.attributes[key]);
                childNode.setAttribute('id', `stud-${i+1}--grade`);
            }
            if (obj.otherChilds.content)
                childNode.appendChild(document.createTextNode(obj.otherChilds.content));
            parentNode.appendChild(childNode);
        }
    }
    mainNode.appendChild(parentNode);
}



/* newColObject is template for new column added by "Add Day" button */
let newColObject = {
    mainSelector: '.grades',
    parent: {
        element: 'div',
        content: '',
        attributes: {
            'class': 'grade__col'
        }
    },
    firstChild: {
        element: 'div',
        content: 'Thu Jan 01',
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


/* removeLastDay removes last added day from table */
function removeLastDay() { // !!!review
    let gradeTableNode = document.querySelector('.grades'); // gets grade table reference node
    gradeTableNode.removeChild(gradeTableNode.lastChild); // removes last column (day) from grade table
}

/* setGradeBoxColor function sets background color for target Object according to student's grade */
function setGradeBoxColor(number) {
    this.textContent = number;
    if (number == 0) this.style.backgroundColor = 'var(--darker-red)';
    else if (number < 3) this.style.backgroundColor = 'var(--orange)';
    else if (number < 4) this.style.backgroundColor = 'var(--green)';
    else this.style.backgroundColor = 'var(--darker-green)';
}


let students = {};

for (let i = 0; i < 10; i++) {
    students[`stud-${i+1}`] = new Student(`Stud-${i+1}`);
}

function updateAvgGrade() {
    document.querySelector(`#${this.getAttribute('id').split('--')[0]}--avg`).textContent = Math.round(students[`${this.getAttribute('id').split('--')[0]}`].getGradeAvg() * 10) / 10;
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







/* Prompt user for a student's grade */
function getPrompt() {
    let studGrade = prompt("Enter a student's grade");
    // check if user entered characters or empty string
    if (isNaN(Number(studGrade)) || studGrade == '') {
        alert("Error Please Try Again!");
        // call getPrompt again to let user re-enter student's grade
        return getPrompt.call(this)
    }
    // check if user pressed ESC or Cancel
    if (studGrade == null) {
        alert("You Canceled!");
        return;
    }
    studGrade = Math.round(Number(studGrade));
    // check if user entered a negative number
    if (studGrade < 0) studGrade = 0;
    // check if user entered a number larger than 5
    if (studGrade > 5) studGrade = 5;
    // studGrade = validateGrade.call(this, studGrade); !!!review
    // set box color according to grade
    setGradeBoxColor.call(this, studGrade);
    // add student grade in array
    students[`${this.getAttribute('id').split('--')[0]}`].addGrade(studGrade);
    updateAvgGrade.call(this);

};




/* adds prmopt function on newly added column */
function addPrompt() {
    let gradeNodesList = Array.from(document.querySelectorAll('.grade__item'));
    for (let node of gradeNodesList) {
        node.addEventListener('click', getPrompt); // !!!important (when used arrow function, prompt window appears on other columns more than once after deleting a column)
    }
}



// Add event on mouse click to create new day in table
let addDayBtn = document.querySelector("#add-day");
addDayBtn.addEventListener('click', () => generateHTML(newColObject));
addDayBtn.addEventListener('click', addPrompt);

// Add event on mouse click to remove last day from table
let removeDayBtn = document.querySelector("#rm-day");
removeDayBtn.addEventListener('click', removeLastDay);

// Add event on mouse click to update table and statistic info
let updateTableBtn = document.querySelector("#upd-tb");
updateTableBtn.addEventListener('click', () => alert("Test"));





let target = document.querySelector('#stud-1--avg');
let changes = { childList: true };

function callback(mutationList) {
    for (let mutation of mutationList) {
        if (mutation.type == 'childList') {

        }
    }
}
let observer = new MutationObserver(callback);

observer.observe(target, changes);