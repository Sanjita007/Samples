<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="RegistrationWithWebMethod.aspx.cs" Inherits="JSWithWebForms.RegistrationWithWebMethod" %>
<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <table>
        <tr>
            <td>Name</td>
            <td><input type="text" id="txtName"/></td>
        </tr>
        
        <tr>
            <td>Address</td>
            <td><input type="text" id="txtAddress"/></td>
        </tr>
        
        <tr>
            <td>Email</td>
            <td><input type="text" id="txtEmail"/></td>
        </tr>
        
        <tr>
            <td>Phone</td>
            <td><input type="text" id="txtPhone"/></td>
        </tr>
        
        <tr>
            <td>Remarks</td>
            <td><input type="text" id="txtRemarks"/></td>
        </tr>
        
        <tr>
            <td></td>
            <td><input type="button" id="btnSubmit"value="Submit"/></td>
        </tr>
    </table>

    <div id="Grid"></div>
    <script type="text/javascript">

        $(document).ready(function () {
            debugger;
            LoadRecords();
        });

        function LoadRecords() {
            $.ajax({
                url: "RegistrationWithWebMethod.aspx/GetAll",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    debugger;
                    if (data.d) {
                        var htm = '<table border="1"><tr><td>Name</td><td>Address</td><td>Email</td><td>Phone</td><td>Remarks</td></tr>';
                        $.each(data.d, function (i, item) {
                            htm += '<tr><td>' + item.Name + '</td>';
                            htm += '<td>' + item.Address + '</td>';
                            htm += '<td>' + item.Email + '</td>';
                            htm += '<td>' + item.Phone + '</td>';
                            htm += '<td>' + item.Remarks + '</td>';
                            htm += '<td><input type="button" value="Edit"></td></tr>';
                        });
                        htm += '</table>';
                        $("#Grid").html(htm);
                    }
                    else {
                        alert("Error");
                        $("#Grid").html('');
                    }
                }
            })
        };

        function LoadRecordByName(name) {
            // load in respective field
        }
        $("#btnSubmit").click(function () {
            debugger;
            var name = $("#txtName").val();

            if (!name) {
                alert("Invalid name!");
                return;
            }
            var address = $("#txtAddress").val();
            var email = $("#txtEmail").val();
            var phone = $("#txtPhone").val();
            var remarks = $("#txtRemarks").val();
            $.ajax({
                url: "RegistrationWithWebMethod.aspx/Register",
                type: "POST",
                data: "{entity:{ Name: '" + name + "', Address: '" + address + "', Email: '" + email + "', Phone: '" + phone + "', Remarks: '" + remarks + "'}}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    debugger;
                    if (data.d === true) {
                        alert("Successful");
                        $("#txtName").val('');
                        $("#txtAddress").val('');
                        $("#txtEmail").val('');
                        $("#txtPhone").val('');
                        $("#txtRemarks").val('');
                        LoadRecords();
                    }
                    else {
                        alert("Unsuccessful.");
                    }
                }
            });
        });

    </script>

</asp:Content>
