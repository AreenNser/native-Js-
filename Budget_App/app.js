var budgetController = (function () {


})();

var UIController = (function () {



})();

var controller = (function (budgetCtrl, UICtrl) {

    var ctrlAddIteam = function () {

    }
    document.querySelector(".add__btn").addEventListener('click', ctrlAddIteam);
    document.addEventListener("keypress", function (event) {
        if (event.key === 13 || event.which === 13) {
            ctrlAddIteam();
        }
    })
})(budgetController, UIController);