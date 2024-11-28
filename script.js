/*
Name: Mena Hanna
File: script.js
Date: 11/27/2024
GUI Assignment: Creating an Interactive Dynamic Multiplication Table
Mena Hanna, UMass Lowell Computer Science, mena_hanna@student.uml.edu
Copyright (c) 2024 by Mena Hanna. All rights reserved.
May be freely copied or excerpted for educational purposes with credit to the author.

Description:
This JavaScript file adds interactive functionality to the dynamic multiplication table web app.
It reads user inputs from the form, validates them using the jQuery Validation plugin, and generates a multiplication table based on the input ranges.
Sliders are also integrated for easier value selection and synchronized with input fields to ensure a smooth user experience.

The script includes functions to:
- Validate input ranges, ensuring values are within allowed limits (e.g., between -50 and 50), and maximum values are not less than minimum values.
- Dynamically generate a multiplication table, which is displayed in new tabs that users can easily manage.
- Allow users to create multiple tabs for different tables and delete specific tabs using checkboxes.
- Provide in-line error messages to guide users in correcting input values.

*/ 
$(document).ready(function () {
    // initialize tabs
    $("#tabs").tabs();

    // Custom validation method to check if a value is greater than or equal to another value
    $.validator.addMethod("greaterThanOrEqualTo", function (value, element, param) {
        var target = $(param);
        if (this.settings.onfocusout) {
            target.off(".validate-greaterThanOrEqualTo").on("blur.validate-greaterThanOrEqualTo", function () {
                $(element).valid();
            });
        }
        return parseFloat(value) >= parseFloat(target.val());
    }, "The maximum value must be greater than or equal to the minimum value.");

    // Initialize form validation
    $("#form-container").validate({
        rules: {
            min_col_value: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            max_col_value: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanOrEqualTo: "#min_col_value"
            },
            min_row_value: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            max_row_value: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanOrEqualTo: "#min_row_value"
            }
        },
        messages: {
            min_col_value: {
                required: "Please enter a minimum column value.",
                number: "Please enter a valid number.",
                min: "Value must be at least -50.",
                max: "Value must be no greater than 50."
            },
            max_col_value: {
                required: "Please enter a maximum column value.",
                number: "Please enter a valid number.",
                min: "Value must be at least -50.",
                max: "Value must be no greater than 50.",
                greaterThanOrEqualTo: "Maximum column value must be greater than or equal to the minimum column value."
            },
            min_row_value: {
                required: "Please enter a minimum row value.",
                number: "Please enter a valid number.",
                min: "Value must be at least -50.",
                max: "Value must be no greater than 50."
            },
            max_row_value: {
                required: "Please enter a maximum row value.",
                number: "Please enter a valid number.",
                min: "Value must be at least -50.",
                max: "Value must be no greater than 50.",
                greaterThanOrEqualTo: "Maximum row value must be greater than or equal to the minimum row value."
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        submitHandler: function (form) {
            generateTable(); // Generate table when form is valid
        }
    });

    // Attach event listener for generating the table via button click
    $("#add-tab-button").click(function (e) {
        e.preventDefault();
        if ($("#form-container").valid()) {
            generateTable();
        }
    });

    // Initialize sliders and two-way binding
    $("#min_col_slider").slider({
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#min_col_value").val(ui.value);
        }
    });

    $("#max_col_slider").slider({
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#max_col_value").val(ui.value);
        }
    });

    $("#min_row_slider").slider({
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#min_row_value").val(ui.value);
        }
    });

    $("#max_row_slider").slider({
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#max_row_value").val(ui.value);
        }
    });

    // Two-way binding: Update slider value when input changes
    $("#min_col_value").on("input", function () {
        $("#min_col_slider").slider("value", this.value);
    });

    $("#max_col_value").on("input", function () {
        $("#max_col_slider").slider("value", this.value);
    });

    $("#min_row_value").on("input", function () {
        $("#min_row_slider").slider("value", this.value);
    });

    $("#max_row_value").on("input", function () {
        $("#max_row_slider").slider("value", this.value);
    });

    // Attach event listener for deleting selected tabs
    $("#delete-tabs-button").click(function () {
        deleteSelectedTabs();
    });

    
    function generateTable() {
        var minCol = parseInt($("#min_col_value").val());
        var maxCol = parseInt($("#max_col_value").val());
        var minRow = parseInt($("#min_row_value").val());
        var maxRow = parseInt($("#max_row_value").val());

        // Clear existing table
        $("#mytable").empty();

        var output = "<tr><th class='no-border'></th>";

        // Create top header row
        for (var j = minCol; j <= maxCol; j++) {
            output += "<th>" + j + "</th>";
        }
        output += "</tr>";

        // Create rows for the table
        for (var i = minRow; i <= maxRow; i++) {
            output += "<tr><th>" + i + "</th>";
            for (var j = minCol; j <= maxCol; j++) {
                output += "<td>" + (i * j) + "</td>";
            }
            output += "</tr>";
        }

        // Add generated output to the table
        $("#mytable").html(output);

        // Add a new tab with the generated table
        addTableToTabs(minCol, maxCol, minRow, maxRow, output);
    }

    function addTableToTabs(minCol, maxCol, minRow, maxRow, tableContent) {
        // Increment the current number of tabs
        var tabCount = $("#tabs ul li").length + 1;
        var tabTitle = `Cols(${minCol}-${maxCol}), Rows(${minRow}-${maxRow})`;

        // Create a new tab header with a checkbox using jQuery
        $("<li>", {
            id: 'tab-li-' + tabCount
        }).append(
            $("<input>", { type: "checkbox", class: "tab-checkbox", id: 'tab-checkbox-' + tabCount })
        ).append(
            $("<a>", { href: '#tab-' + tabCount, text: tabTitle })
        ).appendTo("#tabs ul");

        // Create a new content pane for the table using jQuery
        $("<div>", {
            id: 'tab-' + tabCount,
            html: "<table class='table table-bordered table-hover text-center mytable'>" + tableContent + "</table>"
        }).appendTo("#tabs"); 

        // Refresh the tabs to include the newly added tab
        $("#tabs").tabs("refresh");
    }

    function deleteSelectedTabs() {
        // Iterate through each checkbox to find the selected tabs
        $("#tabs ul li").each(function () {
            var checkbox = $(this).find('.tab-checkbox');  // Find the checkbox in this li

            if (checkbox.is(":checked")) {
                // Get the ID of the tab header li element
                var tabId = $(this).attr('id');
                // Get the associated tab content div ID by changing "li" to "div"
                var tabContentId = "#" + tabId.replace("tab-li-", "tab-");

                // Remove the tab header and content using jQuery
                $(this).remove();  // Remove the tab header
                $(tabContentId).remove();  // Remove the content pane
            }
        });        

        // Refresh tabs to ensure the UI updates
        $("#tabs").tabs("refresh");
    }
});

