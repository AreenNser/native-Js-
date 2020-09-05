var budgetController = (function () {
    //Expense constructor
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.precentage = -1;
    };
    //Income constructor
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allIteams: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }, budget: 0,
        precntage: -1
    }
    Expense.prototype.calcPercentage = function (totalIncome) {
        this.precentage = Math.round((this.precentage = this.value / totalIncome) * 100);
        console.log(this.precentage)
    }
    Expense.prototype.getPercentage = function () {
        console.log(this.precentage)
        return this.precentage;
    };


    // calcalate the sum of values in Array by type exp/inc
    var calculateTotal = function (type) {
        var sum = 0;
        data.allIteams[type].forEach(function (cur) {
            sum = sum + cur.value;

        });
        data.totals[type] = sum;
    }


    return {
        addIteam: function (type, des, val) {
            var ID, newIteam;

            if ((data.allIteams[type].length) > 0) {
                ID = data.allIteams[type][data.allIteams[type].length - 1].id + 1;

            } else {
                ID = 0;
            }
            //Crate new item based on 'inc' or 'exp' type

            if (type === "exp") {
                newIteam = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newIteam = new Income(ID, des, val);

            }
            // Push it into our data structre
            data.allIteams[type].push(newIteam);
            //return the new Iteam
            return newIteam;
        },
        deleteIteam: function (type, id) {
            var ids, index;
            ids = data.allIteams[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allIteams[type].splice(index, 1);
            }

        },
        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calcaulat the budget: income-expenses
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage
            if (data.totals.inc > 0)

                data.precntage = Math.round((data.totals.exp / data.totals.inc) * 100);


            else data.precntage = -1;


        },
        calculatePrecentage: function () {
            data.allIteams.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },
        getPercentages: function () {
            var allPerc = data.allIteams.exp.map(function (cur) {
                return cur.getPercentage();
            })

            return allPerc;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                precentage: data.precntage
            }
        },
        dataPrintTest: function () {
            console.log(data);
        }
    }

})();

var UIController = (function () {
    var DomStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        ExpensesesPreceLabel: '.item__percentage',
        dateLabel: ".budget__title--month"
    };
    var formatNumber = function (num, type) {
        var numSplet, int, dec;
        num = Math.abs(num)
        num = num.toFixed(2);
        numSplet = num.split(".");
        int = numSplet[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }
        dec = numSplet[1];
        var fileds = document.querySelectorAll(DomStrings.ExpensesesPreceLabel);
        var nodeListForEach = function (list, callback) {
            for (var i = 0; i < list.length; i++) {
                callback(list[i], i)
            }
        };
        return (type == 'exp' ? '-' : '+') + ' ' + int + "." + dec;
    }; var fileds = document.querySelectorAll(DomStrings.ExpensesesPreceLabel);
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    };
    return {
        changedType: function () {
            var fields = document.querySelectorAll(DomStrings.inputType + "," + DomStrings.inputDescription + "," + DomStrings.inputValue);
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DomStrings.inputButton).classList.toggle("red");
        },
        getInput: function () {

            return {
                type: document.querySelector(DomStrings.inputType).value,
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)
            }
        },
        addListIeam: function (obj, type) {

            var html, newHtml, element;
            //Create HTML string with placeholder text
            if (type === 'inc') {
                element = DomStrings.incomeContainer;
                html = ' <div class="item clearfix" id="inc-%id%">' +
                    ' <div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__delete">' +
                    ' <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    ' </div>' +
                    '</div>' +
                    '</div>';
            }
            else if (type === 'exp') {
                element = DomStrings.expensesContainer;
                html = ' <div class="item clearfix" id="exp-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    ' <div class="item__percentage">10%</div>' +
                    '<div class="item__delete">' +
                    ' <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>  </div> </div>';
            }
            //replace the placeholder with the Item valuues
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deletListIteam: function (selectorID) {
            var elm = document.getElementById(selectorID);
            elm.parentNode.removeChild(elm);
        },
        displayPrecentages: function (precentages) {


            nodeListForEach(fileds, function (current, index) {
                if (precentages[index] > 0)
                    current.textContent = precentages[index] + "%";
                else {
                    current.textContent = '---';
                }
            })
        },


        getDOMStrings: function () {
            return DomStrings;
        }, clearFilds: function () {
            var fields, fielsArray;
            fields = document.querySelectorAll(DomStrings.inputDescription + "," + DomStrings.inputValue);
            fielsArray = Array.prototype.slice.call(fields);
            fielsArray.forEach(function (current, i) {
                current.value = "";

            });
            fielsArray[0].focus();
        }, displayBudgt: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DomStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DomStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DomStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            console.log(obj.precentage)
            if (obj.precentage > 0) {

                document.querySelector(DomStrings.percentageLabel).textContent = obj.precentage + "%";
            } else {
                document.querySelector(DomStrings.percentageLabel).textContent = '--';
            }

        },
        displayMonth: function () {
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = months[now.getMonth()];

            year = now.getFullYear();
            document.querySelector(DomStrings.dateLabel).textContent = month + " " + year;
        }

    }


})();

var controller = (function (budgetCtrl, UICtrl) {
    var setupEventLiseners = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddIteam);
        document.addEventListener("keypress", function (event) {
            if (event.key === 13 || event.which === 13) {
                ctrlAddIteam();
            }
        })
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType)
    }
    var updadeBudgets = function () {
        // calculate the budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        console.log("budget" + budget)
        console.log(budget)
        // display the budet on the UI
        UICtrl.displayBudgt(budget);
    };
    var updatePrecentages = function () {
        //1 calculate
        budgetCtrl.calculatePrecentage();
        // 2 read from budget controler
        var Percentages = budgetCtrl.getPercentages();
        console.log("precentage" + Percentages);



        //3 update the  UI
        UIController.displayPrecentages(Percentages);
    };
    var ctrlAddIteam = function () {
        var input, newIteam;
        //get the field input data
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add new item to the budget controller
            newIteam = budgetCtrl.addIteam(input.type, input.description, input.value);
            //add the Item to UI
            UICtrl.addListIeam(newIteam, input.type);
            // 4 clear the filed
            UICtrl.clearFilds();

            //5 calculate and update budget
            updadeBudgets();

            // 6. calc and update precentage
            updatePrecentages();
        }


    };

    var ctrlDeleteItem = function (event) {
        var iteamID, splitID, type, ID;
        iteamID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (iteamID) {
            //inc-id
            splitID = iteamID.split('-');
            type = splitID[0];
            ID = splitID[1];
            //delete the iteam from the data structure
            budgetCtrl.deleteIteam(type, ID / 1);
            UIController.deletListIteam(iteamID);
            //delete the iteam from UI
            updadeBudgets();
            updatePrecentages();


        }
    };
    return {
        init: function () {
            setupEventLiseners();
            UICtrl.displayMonth();
            UICtrl.displayBudgt({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                precentage: -1
            });
        }
    }
})(budgetController, UIController);
controller.init();