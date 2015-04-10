// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $("#myCoursesList").show();

});

// Functions =============================================================

$(".showMyCourses").click(function(){
    showMyCourses();
});

$(".addCourse").click(function(){
    $(".message").text("");
    $(".myPage").hide();
    $("#addCourse").show();
});

$(".showSubscribedCourses").click(function(){
    $(".myPage").hide();
    $("#mySubscribedCoursesList").show();
});

$(".subscribeCourse").click(function(){
    $(".myPage").hide();
    $("#subscribeCourse").show();
});

function showMyCourses() {
    $(".message").text("");
    $(".myPage").hide();
    populateTable();
    $("#myCoursesList").show();
};

$(document.body).on('click', '.linkshowcourse', showCourseInfo);
$(document.body).on('click','.linkeditcourse',editCourse);
$(document.body).on('click','.linkdeletecourse',deleteCourse);
$(document.body).on('click', '.linkaddclass', addClass);
$(document.body).on('click', '.linkshowclass', showClassInfo);
$(document.body).on('click', '.linkdeleteclass', deleteClass);
$(document.body).on('click', '.linkeditclass', editClass);

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.get( '/api/courses/full', function( data ) {
        console.log(data);
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.courses, function(){
            tableContent += '<tr>'
            + '<td><a href="" class="linkshowcourse" rel="' + this._id + '">' + this.name + '</a></td>'
            + '<td>' + this.description + '</td>'
            + '<td>' + this.subId + '</td>'
            + '<td><a href="" class="linkeditcourse" rel="' + this._id + '">Edit Course</a></td>'
            + '<td><a href="" class="linkdeletecourse" rel="' + this._id + '">Delete Course</a></td>'
            + '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#myCoursesList table tbody').html(tableContent);
    });
};

// Show User Info
function showCourseInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve CourseID from link rel attribute
    var thisCourseId = $(this).attr('rel');
    console.log(thisCourseId);

    // Empty content string
    var tableContent = '';

    // Get our User Object
    $.get( '/api/courses/' + thisCourseId + '/full', function( data ) {
        console.log(data);

        //Populate Info Box
        $('#CourseInfo').html("<h2>" + data.name + "</h2><p><a href='' class='linkeditcourse btn btn-primary' rel=" + data._id + ">Edit Course</a> <a href='' class='linkdeletecourse btn btn-danger' rel=" + data._id + ">Delete Course</a> <a href='' class='linkaddclass btn btn-default' rel=" + data._id + ">Add Class</a><br/>Subscription code: " + data.subId + "<br/>Participants: " + data.participants.length + "</p>");
        
        // For each item in our JSON, add a table row and cells to the content string
        var i = 1;
        $.each(data.classes, function(){
            tableContent += '<tr>'
            + '<td>' + i + '</td>'
            + '<td>' + this.location + '</td>'
            + '<td>' + this.description + '</td>'
            + '<td><a href="" class="linkeditclass" rel="' + this._id + '">Edit Class</a></td>'
            + '<td><a href="" class="linkdeleteclass" rel="' + this._id + '">Delete Class</a></td>'
            + '</tr>';
            i++;
        });

    // Inject the whole content string into our existing HTML table
    $('#myCourse table tbody').html(tableContent);
    });
    $(".myPage").hide();
    $("#myCourse").show();
};

$('#createCourse').click(function(event) {
    event.preventDefault();

    var form = $(this).closest('form').serialize();
    $.post('/api/courses', form, function(data) {
        console.log(data);
        if (data.message == "Course added") {
            $(".form-horizontal")[0].reset();
            showMyCourses();
        }else{
            $('.message').text("Make sure you filled in all the required fields.");
        }
    });
});

function deleteCourse(event) {
    event.preventDefault();
    var courseId = $(this).attr('rel');

    $.ajax({
        url: '/api/courses/' + courseId,
        type: 'DELETE',
        success: function(result) {
            showMyCourses();
        }
    });
};

function editCourse(event) {
    
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve CourseID from link rel attribute
    var thisCourseId = $(this).attr('rel');

    // Empty content string
    var tableContent = '';

    // Get our User Object
    $.get( '/api/courses/' + thisCourseId + '/full', function( data ) {
        $('#editCourseId').remove("courseId");
        $('#editCourseId').html("<input type='hidden' name='courseId' value='" + thisCourseId + "''>");
        console.log(data);
        $('#editName').val(data.name);
        $('#editDescription').val(data.description);
    });
    $(".myPage").hide();
    $("#editCourse").show();
};

$('#updateCourse').click(function(event) {
    event.preventDefault();

    var form = $(this).closest('form').serialize();
    $.ajax({
        url: '/api/courses/' + $('#editCourseId input').val(),
        type: 'PUT',
        data: form  ,
        success: function(result) {
            showMyCourses();
        }
    });
});

$('#subscribe').click(function(event) {
    event.preventDefault();
    var form = $(this).closest('form').serialize();
    $.post('/api/users/' + $('#subscribeUserId').val() + '/courses', 'id=' + $('#key').val(), function(data) {
        if (data.message == "User subscribed") {
            $(".form-horizontal")[0].reset();
            showMyCourses();
        }else{
            $('.message').text("Make sure you used the right key and that you're not already in the course.");
        }
    });
});

// classes

// Show User Info
function showClassInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve CourseID from link rel attribute
    var thisCourseId = $(this).attr('rel');

    // Empty content string
    var tableContent = '';

    // Get our User Object
    $.get( '/api/courses/' + thisCourseId + '/full', function( data ) {
        console.log(data);

        //Populate Info Box
        $('#CourseInfo').replaceWith("<h2>" + data.name + "</h2><p>Subscription code: " + data.subId + "<br/>Participants: " + data.participants.length + "<br/><a href='' class='linkeditcourse btn' rel=" + data._id + ">Edit Course</a><br/><a href='' class='linkaddclass btn' rel=" + data._id + ">Add Class</a></p>");
        
        // For each item in our JSON, add a table row and cells to the content string
        var i = 1;
        $.each(data.classes, function(){
            tableContent += '<tr>'
            + '<td>' + i + '</td>'
            + '<td>' + this.location + '</td>'
            + '<td>' + this.description + '</td>'
            + '<td><a href="" class="linkeditclass" rel="' + this._id + '">Edit Class</a></td>'
            + '<td><a href="" class="linkdeleteclass" rel="' + this._id + '">Delete Class</a></td>'
            + '</tr>';
            i++;
        });

    // Inject the whole content string into our existing HTML table
    $('#myCourse table tbody').html(tableContent);
    });
    $(".myPage").hide();
    $("#myCourse").show();
};

function addClass(event) {
    event.preventDefault();
    var thisCourseId = $(this).attr('rel');
    $('#CourseIdforClass').remove("courseId");
    $('#CourseIdforClass').html("<input type='hidden' name='courseId' value='" + thisCourseId + "''>");
    
    $(".message").text("");
    $(".myPage").hide();
    $("#addClass").show();
};

$('#createClass').click(function(event) {
    event.preventDefault();
    var form = "date=" + $("#classDate").val() + "T" + $("#classTime").val() + ".000Z&location=" + $("#classLocation").val() + "&description=" + $("#classDescription").val();
    console.log(form);
    $.post('/api/courses/' + $('#CourseIdforClass input').val() + '/classes', form, function(data) {
        console.log(data);
        if (data.message == "Class added") {
            $(".form-horizontal")[0].reset();
            showMyCourses();
        }else{
            $('.message').text("Make sure you fill in all required fields.");
        }
    });
});

function deleteClass(event) {
    event.preventDefault();
    var courseId = $(this).attr('rel');

    $.ajax({
        url: '/api/courses/' + courseId,
        type: 'DELETE',
        success: function(result) {
            showMyCourses();
        }
    });
};

function editClass(event) {
    
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve CourseID from link rel attribute
    var thisCourseId = $(this).attr('rel');

    // Empty content string
    var tableContent = '';

    // Get our User Object
    $.get( '/api/courses/' + thisCourseId + '/full', function( data ) {
        $('#editCourseId').remove("courseId");
        $('#editCourseId').html("<input type='hidden' name='courseId' value='" + thisCourseId + "''>");
        console.log(data);
        $('#editName').val(data.name);
        $('#editDescription').val(data.description);
    });
    $(".myPage").hide();
    $("#editCourse").show();
};

$('#updateClass').click(function(event) {
    event.preventDefault();

    var form = $(this).closest('form').serialize();
    $.ajax({
        url: '/api/courses/' + $('#editCourseId input').val(),
        type: 'PUT',
        data: form  ,
        success: function(result) {
            showMyCourses();
        }
    });
});