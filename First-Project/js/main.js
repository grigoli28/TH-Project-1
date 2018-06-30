/* function Student is a constructor for student object,
with property of full name and methods: addGrade, removeLastGrade, getGradeAvg */

function Student(fullName) {
    this.fullName = fullName;
    let grades = [];

    /* addGrade method adds student's grade into array */
    this.addGrade = function(grade) {
        grades.push(grade);
        return this;
    }

    /* removeLastGrade method removes student's last added grade from array  */
    this.removeLastGrade = function() {
        grades.pop();
        return this;
    }

    this.getGrades = function() { // This function has to be !!!removed
        for (let grade of grades) {
            console.log(grade);
        }
    }

    /* getGradeAvg method returns grade average for student */
    this.getGradeAvg = function() {
        let gradeSum = grades.reduce((total, currValue) => {
            return total + currValue;
        });
        return gradeSum / grades.length;
    }
}


/* !!!remove 
let g = new Student();
g.addGrade(5).addGrade(4).addGrade(3).addGrade(2).addGrade(1);
console.log(g.getGradeAvg());
*/