

const API_URL = 'http://localhost:3000/players'

const btnAddNewEmployee = $('#btn-new-employee');


btnAddNewEmployee.on('click', () => {
    $('#txt-name').prop("disabled", false);
    $('#txt-address').prop("disabled", false);
    $('#txt-gender-male').prop("disabled", false);
    $('#txt-gender-female').prop("disabled", false);
    $('#cb-department').prop("disabled", false);
    $("form").trigger("reset");
    $("#txt-id").val(generateNewId());
    $("#txt-name").trigger("focus");
    $("#btn-save").prop("disabled", false);
    $("#btn-update").prop("disabled", false);
});

function generateNewId() {
    return 'E-' + ((+$("#tbl-employee > tbody > tr:last-child > td:first-child")
        .text().replace('E-', '') + 1) + "").padStart(3, 0);
}

$("form").on('submit', (e) => {
    e.preventDefault();

    if (!validData()) return;
    saveEmployee();
}).on('reset', () => {
    $('#btn-save').prop("disabled", true);
    $('.is-invalid').removeClass('is-invalid');
});



async function saveEmployee() {
    const newEmployee = {
        id: $('#txt-id').val(),
        name: $('#txt-name').val().trim(),
        address: $('#txt-address').val().trim(),
        gender: $('input[type="radio"][name="gender"]:checked').val(),
        department: $('#cb-department').val()
    }
    try {
        $('#btn-add-new, form input, form button').prop("disabled", true);

        const response = await axios(API_URL, {
            method: "POST",
            data: newEmployee,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 201) {
            throw new Error(response.status + ";" + response.data);
        }
        addEmployeeRow(newEmployee);
    } catch (e) {
        alert("Failed to save the Employee Data, Please try again");
        console.log(e);
    }finally {
        $('#btn-add-new').prop("disabled", false);
        $('#btn-clear').prop("disabled", false);
        $('#cb-department').prop("disabled", true);
    }
}

function addEmployeeRow({id, name, gender, department}) {
    const rowHtml = `
                    <tr tabindex="0">
                        <td>${id}</td>
                        <td>
                            <i class="bi bi-gender-${gender}"></i>
                            ${name}
                        </td>
                        <td class="department">${department}</td>
                        <td><i class="bi bi-trash-fill"></i></td>
                    </tr>
    `

    $('#tbl-employee > tbody').append(rowHtml);
    $('#tbl-employee > tfoot').hide();
}

function validData(){
    let valid = true;

    if ($("#cb-department").val() === "Academic"){
        $("#cb-department").addClass('is-invalid').trigger('focus');
        valid = false;
    }
    if (!$('input[type="radio"][name="gender"]:checked').length){
        $('input[name="gender"]').addClass('is-invalid').first().trigger('focus');
        valid = false;
    }

    if ($("#txt-address").val().trim().length < 3) {
        $("#txt-address").addClass('is-invalid').trigger('focus').trigger('select');
        valid = false;
    }
    if (!/^[A-Za-z ]+$/.test($('#txt-name').val().trim())){
        $('#txt-name').addClass('is-invalid').trigger('focus').trigger('select')
            .next().text(!$('#txt-name').val().trim() ?
            "Name Can't be Empty" : "Name can include only Letters and spaces");
        valid = false;
    }
    return valid;
}
$('#txt-address, #cb-department, input[name="gender"], #txt-name')
    .on('input', (e) => {
        $(e.target.name === 'gender' ? 'input[name="gender"]' : e.target)
            .removeClass('is-invalid');
    });