angular.module('myApp').controller('HelpCtrl', ['$scope','$modal','$log',function ($scope, $modal, $log) {

    'use strict';


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

angular.module('myApp').controller('ModalInstanceCtrl',['$scope','$modalInstance','items', function ($scope, $modalInstance, items) {

    'use strict';
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
    'use strict';
    $scope.helps = [
        {"image": "img/valid.png", "rule": 'RULE_1'},
        {"image": "img/valid-runs.png", "rule": 'RULE_2'},
        {"image": "img/valid-groups.png", "rule": 'RULE_3'},
        {"image": "img/valid-joker.png", "rule": 'RULE_4'},
        {"image": "img/valid-run2.png", "rule": 'RULE_5'}
    ];
    $scope.myInterval = 0;
}]);
