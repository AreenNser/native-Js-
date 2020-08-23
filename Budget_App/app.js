var budgetController = (function () {


})();

var UIController = (function () {
    var DomsStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }
    return {
        getInput: function () {

            return {
                type: document.querySelector(DomsStrings.inputType).value,
                description: document.querySelector(DomsStrings.inputDescription).value,
                value: document.querySelector(DomsStrings.inputValue).value
            }
        },
        getDOMStrings: function () {
            return DomsStrings;
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

    var ctrlAddIteam = function () {
        var input = UICtrl.getInput(); console.log(input);
    }
    return {
        init: function () {
            setupEventLiseners();
        }
    }
})(budgetController, UIController);
controller.init();