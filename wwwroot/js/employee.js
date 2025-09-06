$(document).ready(function () {
    var table = $('#employeeTable').DataTable({
        ajax: {
            url: '/Employees/GetAll',
            dataSrc: 'data'
        },
        columns: [
            { data: 'empId' },
            { data: 'empName' },
            { data: 'email' },
            { data: 'department' },
            { data: 'salary' },
            {
                data: 'empId',
                render: function (data) {
                    return `
<button class="btn btn-sm btn-primary edit-btn" data-id="${data}">Edit</button>
<button class="btn btn-sm btn-danger delete-btn" data-id="${data}">Delete</button>
`;
                },
                orderable: false
            }
        ]
    });


    // show empty modal for Add
    $('#addEmployeeBtn').on('click', function () {
        clearModal();
        $('#employeeModalLabel').text('Add Employee');
        var modal = new bootstrap.Modal(document.getElementById('employeeModal'));
        modal.show();
    });


    // Edit
    $('#employeeTable').on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        $.get(`/Employees/Get/${id}`, function (data) {
            $('#EmpId').val(data.empId);
            $('#EmpName').val(data.empName);
            $('#Email').val(data.email);
            $('#Department').val(data.department);
            $('#Salary').val(data.salary);


            $('#employeeModalLabel').text('Edit Employee');
            var modal = new bootstrap.Modal(document.getElementById('employeeModal'));
            modal.show();
        }).fail(function () {
            showAlert('Error loading employee', 'danger');
        });
    });


    $('#employeeTable').on('click', '.delete-btn', function () {
        debugger;
        var id = $(this).data('id');

        Swal.fire({
            title: 'Are you sure?',
            text: "This record will be deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/Employees/Delete',
                    type: 'POST',
                    data: { id: id },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
                            $('#employeeTable').DataTable().ajax.reload();
                        } else {
                            Swal.fire('Error!', 'Failed to delete employee.', 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    }
                });
            }
        });
    });

    $('#employeeForm').validate({
       
        rules: {
            EmpName: {
                required: true,
                maxlength: 100
            },
            Email: {
                required: true,
                email: true,
                remote: {
                    url: '/Employees/CheckEmail',   // backend method for email check
                    type: 'POST',
                    data: {
                        email: function () {
                            return $('#Email').val();
                        },
                        id: function () {
                            return $('#EmpId').val();  // for edit mode, exclude current record
                        }
                    }
                }
            },
            Department: {
                required: true
            },
            Salary: {
                required: true,
                number: true,
                min: 1
            }
        },
        messages: {
            EmpName: {
                required: "Employee name is required",
                maxlength: "Name cannot exceed 100 characters"
            },
            Email: {
                required: "Email is required",
                email: "Enter a valid email address",
                remote: "This email already exists"
            },
            Department: {
                required: "Department is required"
            },
            Salary: {
                required: "Salary is required",
                number: "Enter a valid number",
                min: "Salary cannot be negative or 0"
            }
        },

        errorClass: "text-danger",    // Bootstrap red color
        errorElement: "span",         // wrap error inside <span> instead of <label>
        highlight: function (element) {
            $(element).addClass('is-invalid');  // Bootstrap input red border
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        },

        submitHandler: function (form) {
            var formData = $(form).serialize();  // serialize all fields

            $.ajax({
                url: '/Employees/Save',
                method: 'POST',
                data: formData,
                success: function (res) {
                    if (res.success) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Saved successfully',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            var modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
                            modal.hide();
                            table.ajax.reload();
                        });
                    } else {
                        Swal.fire({
                            title: 'Failed!',
                            text: 'Save failed',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function (xhr) {
                    var msg = 'Error saving employee';
                    if (xhr.responseText) msg = xhr.responseText;

                    Swal.fire({
                        title: 'Error!',
                        text: msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });





// Form submit (create/update)
//$('#employeeForm').validate({

//    submitHandler: function (form) {
//        var token = $('input[name="__RequestVerificationToken"]').val();
//        var formData = $(form).serialize();


//        $.ajax({
//            url: '/Employees/Save',
//            method: 'POST',
//            headers: { 'RequestVerificationToken': token },
//            data: formData,
//            success: function (res) {
//                if (res.success) {
//                    showAlert('Saved successfully', 'success');
//                    var modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
//                    modal.hide();
//                    table.ajax.reload();
//                } else {
//                    showAlert('Save failed', 'danger');
//                }
//            },
//            error: function (xhr) {
//                var msg = 'Error saving employee';
//                if (xhr.responseText) msg = xhr.responseText;
//                showAlert(msg, 'danger');
//            }
//        });
//    }
//    });

    //$('#employeeForm').validate({
    //    rules: {
    //        EmpName: {
    //            required: true,
    //            maxlength: 100
    //        },
    //        Email: {
    //            required: true,
    //            email: true,
    //            remote: {
    //                url: '/Employees/CheckEmail',
    //                type: 'POST',
    //                data: {
    //                    email: function () {
    //                        return $('#Email').val();
    //                    },
    //                    id: function () {
    //                        return $('#EmpId').val() || 0; // hidden field for edit
    //                    },
    //                    __RequestVerificationToken: function () {
    //                        return $('input[name="__RequestVerificationToken"]').val();
    //                    }
    //                }
    //            }
    //        },
    //        Department: {
    //            required: true,
    //            maxlength: 50
    //        },
    //        Salary: {
    //            required: true,
    //            number: true,
    //            min: 0
    //        }
    //    },
    //    messages: {
    //        EmpName: {
    //            required: "Name is required",
    //            maxlength: "Name cannot exceed 100 characters"
    //        },
    //        Email: {
    //            required: "Email is required",
    //            email: "Enter a valid email address",
    //            remote: "This email already exists"
    //        },
    //        Department: {
    //            required: "Department is required",
    //            maxlength: "Department cannot exceed 50 characters"
    //        },
    //        Salary: {
    //            required: "Salary is required",
    //            number: "Only numeric values allowed",
    //            min: "Salary cannot be negative"
    //        }
    //    },
    //    errorClass: "text-danger",

    //    // 👇 Hook into invalid handler
    //    invalidHandler: function (event, validator) {
    //        if (validator.errorList.length) {
    //            var firstError = validator.errorList[0];
    //            if (firstError.element.id === "Email" && firstError.message === "This email already exists") {
    //                Swal.fire({
    //                    icon: 'warning',
    //                    title: 'Duplicate Email',
    //                    text: 'This email already exists in the system. Please use another email.'
    //                });
    //            }
    //        }
    //    },

    //    submitHandler: function (form) {
    //        var token = $('input[name="__RequestVerificationToken"]').val();
    //        var formData = $(form).serialize();

    //        $.ajax({
    //            url: '/Employees/Save',
    //            method: 'POST',
    //            headers: { 'RequestVerificationToken': token },
    //            data: formData,
    //            success: function (res) {
    //                if (res.success) {
    //                    Swal.fire('Success', 'Saved successfully', 'success');
    //                    var modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
    //                    modal.hide();
    //                    $('#employeeTable').DataTable().ajax.reload();
    //                } else {
    //                    Swal.fire('Error', 'Save failed', 'error');
    //                }
    //            },
    //            error: function (xhr) {
    //                var msg = 'Error saving employee';
    //                if (xhr.responseText) msg = xhr.responseText;
    //                Swal.fire('Error', msg, 'error');
    //            }
    //        });
    //    }
    //});


    $('#employeeModal').on('hidden.bs.modal', function () {
        var form = $('#employeeForm');

        // Reset form fields
        form[0].reset();

        // Clear validation error messages and styles
        form.validate().resetForm();
        form.find('.is-invalid').removeClass('is-invalid');
    });




function clearModal() {
    $('#EmpId').val(0);
    $('#EmpName').val('');
    $('#Email').val('');
    $('#Department').val('');
    $('#Salary').val('');
    $('#employeeForm').validate().resetForm();
}


function showAlert(message, type) {
    var html = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    $('#alertPlaceholder').html(html);
}
});