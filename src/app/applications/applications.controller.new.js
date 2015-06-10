(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsNewController', applicationsNewController);

  applicationsNewController.$inject =
    ['Restangular', '$scope', 'rAppTemplates', '$timeout', 'rShare', '$window'];

  function applicationsNewController(
      Restangular, $scope, rAppTemplates, $timeout, rShare, $window) {

    // Fields
    $scope.appTemplates = [];
    $scope.fromExisting = true;
    $scope.app = {};
    $scope.errorMessage = '';

    // Functions declaration
    $scope.showFromExisting = showFromExisting;
    $scope.showUpload = showUpload;
    $scope.createNewApplication = createNewApplication;
    $scope.formatTpl = formatTpl;
    $scope.completeCreation = completeCreation;

    // Initialize the list of templates
    rAppTemplates.refreshTemplates().then(function() {
      $scope.appTemplates = rAppTemplates.getTemplates();
    });

    // Functions
    function showFromExisting() {
      $scope.fromExisting = true;
      $('#upload-result-details').css('display', 'none');
    }

    function showUpload() {
      $scope.fromExisting = false;
    }

    function createNewApplication(app) {
      var newApp = {
        name: app.name,
        desc: app.description,
        tpl: {
          name: app.tpl.name,
          qualifier: app.tpl.qualifier
        }
      };

      Restangular.one('applications').post('', newApp).then(function() {
        $window.location = '#/app/' + newApp.name + '/details';

      }, function(response) {
        $scope.errorMessage = 'An error occured. ' + response.data.reason;
        $timeout(resetErrorMessage, 6000);
      });
    }

    function formatTpl(tpl) {
      return tpl.name + ' - ' + tpl.qualifier;
    }

    function resetErrorMessage() {
      $scope.errorMessage = '';
    }

    function completeCreation() {

      var last = rShare.eatLastItem();
      if (last) {
        $scope.appTemplates.push(last);
        $scope.app.tpl = last;
        showFromExisting();

        // Reset the upload form
        $('.fileinput').fileinput('clear');
        $('#upload-result-details').hide();
      }
    }
  }
})();