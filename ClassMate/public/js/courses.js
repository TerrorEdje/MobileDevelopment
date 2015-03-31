// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $("#myCoursesList").show();

});

// Functions =============================================================

$(".showMyCourses").click(function(){
    $(".myPage").hide();
    populateTable();
    $("#myCoursesList").show();
});

$(".addCourse").click(function(){
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

$('#myCoursesList table tbody').on('click', 'td a.linkshowcourse', showCourseInfo);
$('#myCoursesList table tbody').on('click', 'td a.linkdeletecourse', deleteCourse);

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

    // Empty content string
    var tableContent = '';

    // Get our User Object
    $.get( '/api/courses/' + thisCourseId + '/full', function( data ) {
        console.log(data);

        //Populate Info Box
        $('#CourseInfo').replaceWith("<h2>" + data.name + "</h2><p>Participants: " + data.participants.length + "</p>");
        
        // For each item in our JSON, add a table row and cells to the content string
        var i = 1;
        $.each(data.classes, function(){
            tableContent += '<tr>'
            + '<td>' + i + '</td>'
            + '<td>' + this.location + '</td>'
            + '<td>' + this.description + '</td>'
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
        if (data.message == "Course Added") {
            $(".form-horizontal")[0].reset();
            $(".myPage").hide();
            populateTable();
            $("#myCoursesList").show();
        }else{
            $('#message').text(data.errors.name.message);
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
        populateTable();
    }
});
};