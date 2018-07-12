/* Student() is a constructor for a student object, with property of full name and methods: getID, setName, getName, setGrade, pushGrade, popGrade, getGradeAvg;
addGrade method adds student's grade into array;
removeLastGrade method removes student's last added grade from array;
getGradeAvg method returns grade average for student;
*/

function Student(name) {
    if (Student.count == undefined)
        Student.count = 0;
    else Student.count += 1;
    let ID = Student.count; // give each student ID

    this.getID = function() {
        return ID;
    }
    let fullName = name;

    this.setName = function(str) {
        if (str.length === 0) {
            console.log('Name not valid!');
            return;
        }
        fullName = str;
    }
    this.getName = function() {
        return fullName;
    }
    let grades = [];

    this.setGrade = function(grade, index) {
        grades[index] = grade;
    }
    this.pushGrade = function(grade) {
        grades.push(grade);
        return this;
    }
    this.popGrade = function() {
        grades.pop();
        return this;
    }
    this.getGradeAvg = function() {
        if (grades.length == 0) return 0;
        let gradeSum = grades.reduce((total, currValue) => {
            return total + currValue;
        });
        return Math.round(gradeSum / grades.length * 10) / 10;
    }
    Student.decreaseCount = function() {
        Student.count -= 1;
    }
}