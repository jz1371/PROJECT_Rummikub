'use strict';

angular.module('myApp').controller('ModalDemoCtrl', ['$scope','$modal','$log',function ($scope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'help.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('myApp').controller('ModalInstanceCtrl',['$scope','$modalInstance','items', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

angular.module('myApp').controller('CarouselDemoCtrl',['$scope', function ($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    //slides = [
    //    {image: "../img/valid-runs.png", text: "here"},
    //    {image: 'http://placekitten.com/' + 600 + '/300', text: "slide2"}
    //];
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i=0; i<4; i++) {
        $scope.addSlide();
    }
    slides.push({
        //image: 'http://placekitten.com/' + (600 + slides.length + 1) + '/300',
        image: 'img/joker-red.png',
        text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    })
}]);
