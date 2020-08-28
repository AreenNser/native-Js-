var budgetController = (function () {
    var Expence = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allIteams[type].forEach(function (cur) {
            sum = sum + cur.value;

        });
        data.totals[type] = sum;


    }

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
    return {
        addIteam: function (type, des, val) {
            var ID, newIteam;

            if ((data.allIteams[type].length - 1) > 0) {
                ID = data.allIteams[type][data.allIteams[type].length - 1].id + 1;

            } else {
                ID = 0;
            }
            //Crate new item based on 'inc' or 'exp' type

            if (type === "exp") {
                newIteam = new Expence(ID, des, val);
            } else if (type === 'inc') {
                newIteam = new income(ID, des, val);

            }
            // Push it into our data structre
            data.allIteams[type].push(newIteam);
            //return the new Iteam
            return newIteam;
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
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                precentage: data.precntage
            }
        }

    }

})();

var UIController = (function () {
    var DomsStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: '.budget__expenses--percentage'
    }
    return {
        getInput: function () {

            return {
                type: document.querySelector(DomsStrings.inputType).value,
                description: document.querySelector(DomsStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomsStrings.inputValue).value)
            }
        },
        addListIeam: function (obj, type) {

            var html, newHtml, element;
            //Create HTML string with placeholder text
            if (type === 'inc') {
                element = DomsStrings.incomeContainer;
                html = ' <div class="item clearfix" id="income-%id%">' +
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
                element = DomsStrings.expensesContainer;
                html = ' <div class="item clearfix" id="expense-%id%">' +
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
            newHtml = newHtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        getDOMStrings: function () {
            return DomsStrings;
        }, clearFilds: function () {
            var fields, fielsArray;
            fields = document.querySelectorAll(DomsStrings.inputDescription + "," + DomsStrings.inputValue);
            fielsArray = Array.prototype.slice.call(fields);
            fielsArray.forEach(function (current, i) {
                current.value = "";

            });
            fielsArray[0].focus();
        }, displayBudgt: function (obj) {

            document.querySelector(DomsStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DomsStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DomsStrings.expenseLabel).textContent = obj.totalExp;
            if (obj.precentage > 0) {
                document.querySelector(DomsStrings.percentageLabel).textContent = obj.precentage + "%";
            } else {
                document.querySelector(DomsStrings.percentageLabel).textContent = '--';
            }

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
    }
    var updadeBudgets = function () {
        // calculate the budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        // display the budet on the UI
        UICtrl.displayBudgt(budget);
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
            //clear the filed
            UICtrl.clearFilds();
            updadeBudgets();
        }


    }
    return {
        init: function () {
            setupEventLiseners();
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