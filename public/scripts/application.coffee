window.ScamDatabase = angular.module("ScamDatabase", [])

ScamDatabase.controller 'ScammerController', ($scope, $http) ->
    $http.get("/scammers").success((data) ->
        $scope.scammers = data
        $scope.recordsPerPage = 10
        $scope.curPage = 0

        $scope.numPages = ->
            Math.ceil $scope.scammers / $scope.recordsPerPage

        return
    ).error (err) ->
        $scope.scammers = -1

ScamDatabase.filter("capitalize", ->
    return (input) ->
        if input and isNaN(input)
            words = input.split(" ")

            $.each words, (index, word) ->
                words[index] = word.charAt(0).toUpperCase() + word.slice(1)

            words.join())

ScamDatabase.filter "startAt", ->
    return (input, start) ->
        input.slice parseInt(start)  if input instanceof Object

$(document).ready ->
    $("#sub-success").toggle()  if window.location.search is "?success"
    $("#sub-failure").toggle()  if window.location.search.match(/\?errors=true(\w+)*$/)