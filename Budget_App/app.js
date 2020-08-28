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


    var data = {
        allIteams: {
            exp: [],
            inc: []
        },
        tatals: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: '.expenses__list'
    }
    return {
        getInput: function () {

            return {
                type: document.querySelector(DomsStrings.inputType).value,
                description: document.querySelector(DomsStrings.inputDescription).value,
                value: document.querySelector(DomsStrings.inputValue).value
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
    var updadeBudgets = function () { };
    var ctrlAddIteam = function () {
        var input, newIteam;
        //get the field input data
        input = UICtrl.getInput();

        //add new item to the budget controller
        newIteam = budgetCtrl.addIteam(input.type, input.description, input.value);
        //add the Item to UI
        UICtrl.addListIeam(newIteam, input.type);
        //clear the filed
        UICtrl.clearFilds();
        // calculate the budget
        // display the budet on the UI
    }
    return {
        init: function () {
            setupEventLiseners();
        }
    }
})(budgetController, UIController);
controller.init();