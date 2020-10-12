(function() {
    "use strict";
    angular.module('QuizApp.dashBoard.controllers', [])
        .controller('dashBoardController', dashBoardController);

    dashBoardController.$inject = ['$rootScope', '$scope', '$route', '$location', '$timeout', '$interval', 'AppService', 'appConstants'];

    function dashBoardController($rootScope, $scope, $route, $location, $timeout, $interval, AppService, appConstants) {
        var _this = this;


        window.scrollTo(0, 0);
        _this.AppService = AppService;
        _this.userName = "";
        _this.userEmail = "";
        _this.userPhone = "";
        _this.login = false;
        _this.loginUser = loginUser;
        _this.openPushPopUp = openPushPopUp;
        _this.showAllAnswer = showAllAnswer;
        _this.showGraph = showGraph;
        _this.queState = [true, false, false, false, false];
        _this.correctAns = [];
        _this.ans = [];
        _this.boolArr = [];
        _this.myData = [];
        _this.shoqQue = shoqQue;
        _this.saveAns = saveAns;

        _this.showAnswer = false;
        $('#onepush-modal').openModal();
        //all Questions and answers stored here can have this as separate json file
        _this.data = [{
                "id": 0,
                "que": "Which of the following is not a core AngularJS directive.",
                "options": {
                    "A": "ng-app",
                    "B": "ng-model",
                    "C": "ng-bind",
                    "D": " ng-state"
                },
                "answer": "D"
            },
            {
                "id": 1,
                "que": "Which of the following is true about AngularJS service?",
                "options": {
                    "A": "Services are JavaScript functions.",
                    "B": "Services are responsible to do specific tasks only",
                    "C": "Inbuilt services are always prefixed with $ symbol.",
                    "D": " All of the above."
                },
                "answer": "D"
            },
            {
                "id": 2,
                "que": "What is MVC?",
                "options": {
                    "A": "MVC is name of an algorithm.",
                    "B": " MVC is a software design pattern for developing web applications.",
                    "C": "MVC is a software technique to optimize web application performance.",
                    "D": "None of the above."
                },
                "answer": "B"
            },
            {
                "id": 3,
                "que": "Which of the following tag represents a section of the document intended for navigation in HTML5? ",
                "options": {
                    "A": "footer",
                    "B": "nav",
                    "C": "section",
                    "D": "dialog"
                },
                "answer": "B"
            },
            {
                "id": 4,
                "que": " Which of the following is true about currency filter?",
                "options": {
                    "A": " Currency filter formats text in a currency format.",
                    "B": "Currency filter is a function which takes text as input.",
                    "C": "Both of the above.",
                    "D": " None of the above."
                },
                "answer": "B"
            },


        ];
        //when user clicks on login mark him as authenticated user and move further
        function loginUser() {
            _this.login = true;
            $('#onepush-modal').closeModal();
        }

        function shoqQue(id) {

            if (queState[id - 1] == true) return true;

            else
                return false;
        }

        function saveAns(object) {
            var id = object.target.id.split('')[0];
            var tempAns = object.target.id.split('')[1];
            _this.ans[id] = tempAns;
            console.log(_this.ans);
            //afte clicking wait for a second while moving to next question
            $timeout(
                function() {
                    if (id < _this.data.length - 1) {
                        _this.queState[parseInt(id) + 1] = true;
                        _this.queState[id] = false;
                    }
                    //alert("Called after delay.");
                },
                1000);



        }
        //to show all the questions
        function showAllAnswer() {
            _this.showAnswer = true;
            for (var i = 0; i <= _this.data.length; i++) {
                _this.queState[i] = true;
                document.getElementById(i + _this.ans[i]).checked = true;


            }

        }


        //to generate a graph
        function showGraph() {
            $('#graph-modal').openModal();
            _this.myData = [];
            for (var i = 0; i < _this.data.length; i++) {
                _this.correctAns[i] = _this.data[i].answer;
                if (_this.correctAns[i] == _this.ans[i]) {
                    _this.boolArr[i] = 1;
                } else {
                    _this.boolArr[i] = 0;
                }
            }
            for (var i = 0; i < _this.data.length; i++) {
                var obj = {
                    name: i + 1,
                    y: _this.boolArr[i]

                };
                _this.myData.push(obj);
            }
            // Create the chart
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'This graph shows your answers'
                },

                xAxis: {
                    type: 'Question'
                },
                yAxis: {
                    title: {
                        text: 'Total percent mark'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                series: [{

                    data: _this.myData

                }]

            });
        }
        function openPushPopUp() {

            $('#onepush-modal').openModal();
        }



        // fetchdashBoard();

    }

})();

(function() {
    'use strict';
    var QuizApp = angular.module("QuizApp", [
        'ngRoute',
        'QuizApp.dashBoard'
    ])


    QuizApp.config(['$routeProvider', '$compileProvider', '$locationProvider',
        function($routeProvider, $compileProvider, $locationProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/dashBoard'
                });
        }
    ]);

    QuizApp.run(function($rootScope, $window) {
        console.log("App started successfully!");
    });

})();
(function() {
    'use strict';
    var AppService = angular.module('QuizApp')
        .factory('AppService', function($rootScope, $http, $location, $timeout) {


            return {
                ShowLoader: function(message) {

                    (function() {
                        setTimeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope.loaderVisibility = true;
                                $rootScope.loaderText = message;
                            })
                        }, 0);
                    })();
                },
                HideLoader: function() {
                    (function() {
                        setTimeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope.loaderVisibility = false;
                            })
                        }, 0);
                    })();
                    setTimeout(SetRippleEffectHandle, 0);

                },
                LoadTimer: function(time, message) {

                    (function() {
                        setTimeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope.loaderVisibility = false;
                                $rootScope.loaderText = message;
                            })
                        }, 0);
                    })();

                    (function() {
                        setTimeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope.loaderVisibility = true;
                                $rootScope.loaderText = message;
                            })
                        }, 0);
                    })();

                    (function() {
                        setTimeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope.loaderVisibility = false;
                                $rootScope.loaderText = message;
                            })
                        }, time);
                    })();
                }
            };
        })

})();
(function() {
    'use strict'
    var constants = angular.module("QuizApp")
        .constant('appConstants', {

            OnePushBaseURL: "https://hackerearth.0x10.info/api/one-push",

        });
})();
(function() {
    angular.module('QuizApp.dashBoard.services', [])
        .factory('dashBoardService', dashBoardService);

    dashBoardService.$inject = ["$timeout", "$q", "$http", "appConstants"];

    function dashBoardService($timeout, $q, $http, appConstants) {

        //call service to get JSON data
        var dashBoardService = {
            fetchdashBoard: fetchdashBoard

        };

        return dashBoardService;

        function fetchdashBoard(params) {

            var def = $q.defer();

            var req = {
                method: 'GET',
                url: 'que.html',


            }
            $http(req).then(function(response) {
                def.resolve({
                    dashBoard: response.data.websites
                });
            }, function(arg) {
                def.reject(arg.data);
            });

            return def.promise;
        }



    }
})();
(function() {
    "use strict";

    angular.module('QuizApp.dashBoard', [
            "QuizApp.dashBoard.controllers",
            "QuizApp.dashBoard.services",
        ])
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];

    function routeConfig($routeProvider) {
        $routeProvider.when('/dashBoard', {
            controller: 'dashBoardController',
            controllerAs: 'dashBoardVM',
            templateUrl: 'ng_app/components/dashBoard/dashBoard.html',
            //resolve: {}
        });
    }

})();
