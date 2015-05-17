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
    $(".message").val("");
    $(".myPage").hide();
    $("#addCourse").show();
});

$(".showSubscribedCourses").click(function(){
    populateSubscribed();
    $(".myPage").hide();
    $("#mySubscribedCoursesList").show();
});

$(".subscribeCourse").click(function(){
    $("#key").val("");
    $(".myPage").hide();
    $("#subscribeCourse").show();
});

function showMyCourses() {
    $(".message").val("");
    $(".myPage").hide();
    populateTable();
    $("#myCoursesList").show();
};

function showMySubscribedCourses() {
    $(".message").val("");
    $(".myPage").hide();
    populateSubscribed();
    $("#mySubscribedCoursesList").show();
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
    $.get( '/api/courses', function( data ) {
        var i = 1;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.courses, function(){
            if (this.creator==$('#userid').val()) {
                tableContent += '<tr>'
                + '<td><a href="" class="linkshowcourse" rel="' + this._id + '">' + this.name + '</a></td>'
                + '<td>' + this.description + '</td>'
                + '<td>' + this.subId + '</td>'
                + '<td><a href="" class="linkeditcourse" rel="' + this._id + '">Edit Course</a></td>'
                + '<td><a href="" class="linkdeletecourse" rel="' + this._id + '">Delete Course</a></td>'
                + '</tr>';
                i++;
            }
        });

        if (i == 1) {
            tableContent += '<tr>'
            + '<td>You dont own any classes yet.</td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
            + '</tr>';
        }

        // Inject the whole content string into our existing HTML table
        $('#myCoursesList table tbody').html(tableContent);
    });
};

function populateSubscribed() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.get( '/api/users/' + $('#userid').val() + '/courses', function( data ) {

        var i = 1;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.courses, function(){
            tableContent += '<tr>'
            + '<td><a href="" class="linkshowcourse" rel="' + this._id + '">' + this.name + '</a></td>'
            + '<td>' + this.description + '</td>'
            + '</tr>';
            i++;
        });

        if (i == 1) {
            tableContent += '<tr>'
            + '<td>You subscribed to any classes yet.</td>'
            + '<td></td>'
            + '</tr>';
        }

        // Inject the whole content string into our existing HTML table
        $('#mySubscribedCoursesList table tbody').html(tableContent);
    });
};

// Show User Info
function showCourseInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve CourseID from link rel attribute
    var thisCourseId = $(this).attr('rel');

    // Empty content string
    var tableContent = '';

    // Get our User Object
    $.get( '/api/courses/' + thisCourseId + '?classes=true&participants=true', function( data ) {
        //Populate Info Box
        if (data.creator == $('#userid').val()) {
            $('#CourseInfo').html("<h2>" + data.name + "</h2><img src='api/qr/" + data.subId + "'><p><a href='' class='linkeditcourse btn btn-primary' rel=" + data._id + ">Edit Course</a> <a href='' class='linkdeletecourse btn btn-danger' rel=" + data._id + ">Delete Course</a> <a href='' class='linkaddclass btn btn-default' rel=" + data._id + ">Add Class</a><br/>Subscription code: " + data.subId + "<br/>Participants: " + data.participants.length + "</p>");
        } else {
            $('#CourseInfo').html("<h2>" + data.name + "</h2><img src='api/qr/" + data.subId + "'><p>Subscription code: " + data.subId + "<br/>Participants: " + data.participants.length + "</p>");
        }
        
        // For each item in our JSON, add a table row and cells to the content string
        var i = 1;
        $.each(data.classes, function(){
            tableContent += '<tr>'
            + '<td>' + i + '</td>'
            + '<td>' + this.location + '</td>'
            + '<td>' + this.description + '</td>'
            + '<td>' + new Date(this.date).toDateString() + '</td>'
            + '<td>' + this.date.substring(11,16) + '</td>'
            + '</tr>';
            i++;
        });

    if (i == 1) {
        tableContent += '<tr>'
        + '<td>This course has no classes yet.</td>'
        + '<td></td>'
        + '<td></td>'
        + '<td></td>'
        + '<td></td>'
        + '</tr>';
    }

    // Inject the whole content string into our existing HTML table
    $('#myCourse table tbody').html(tableContent);
    });
    $(".myPage").hide();
    $("#myCourse").show();
};

$('#createCourse').click(function(event) {
    event.preventDefault();

    var form = $(this).closest('form').serialize();

    $.post('/api/courses', form)
    .done( function(msg) { showMyCourses(); $(".form-horizontal")[0].reset(); } )
    .fail( function(xhr, textStatus, errorThrown) {
        $('.message').text("At least give the course a 3 lettered name.");
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
    $.get( '/api/courses/' + thisCourseId, function( data ) {
        $('#editCourseId').remove("courseId");
        $('#editCourseId').html("<input type='hidden' name='courseId' value='" + thisCourseId + "''>");
        $('#editName').val(data.name);
        $('#editDescription').val(data.description);
        $('#editid').val(data._id);
    });
    $(".myPage").hide();
    $("#editCourse").show();
};

$('#updateCourse').click(function(event) {
    event.preventDefault();

    var form = $(this).closest('form').serialize();
    $.ajax({
        url: '/api/courses',
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
    $.post('/api/users/' + $('#subscribeUserId').val() + '/courses', { id: $('#key').val() })
    .done( function(msg) { showMySubscribedCourses(); $(".form-horizontal")[0].reset(); } )
    .fail( function(xhr, textStatus, errorThrown) {
        $('.message').text(xhr.responseText.replace('"','').replace('"',''));
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
    $.get( '/api/courses/' + thisCourseId, function( data ) {

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
    var form = "date=" + $("#classDate").val() + " " + $("#classTime").val() + ".000Z&location=" + $("#classLocation").val() + "&description=" + $("#classDescription").val();
    
    $.post('/api/courses/' + $('#CourseIdforClass input').val(), form)
    .done( function(msg) { showMyCourses(); $(".form-horizontal")[0].reset(); } )
    .fail( function(xhr, textStatus, errorThrown) {
        $('.message').text(xhr.responseText.replace('"','').replace('"',''));
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
    $.get( '/api/courses/' + thisCourseId, function( data ) {
        $('#editCourseId').remove("courseId");
        $('#editCourseId').html("<input type='hidden' name='courseId' value='" + thisCourseId + "''>");
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