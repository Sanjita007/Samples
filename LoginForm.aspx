<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LoginForm.aspx.cs" Inherits="JSWithWebForms.LoginForm" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <style type="text/css">
        .auto-style1 {
            width: 50%;
        }

        .auto-style2 {
            width: 152px;
        }
        .auto-style3 {
            width: 550px;
        }
    </style>

</head>
<body>
    <form id="form1">
        <div>
            <table align="center" class="auto-style1">
                <tr>
                    <td class="auto-style2">User Name</td>
                    <td class="auto-style3">
                        <input type="text" id="txtUserName" /></td>
                </tr>
                <tr>
                    <td class="auto-style2">Password</td>
                    <td class="auto-style3">
                        <input type="password" id="txtPassword" /></td>
                </tr>
                <tr>
                    <td class="auto-style2">
                        <input type="button" id="btnSubmit" value="submit"/></td>
                    <td class="auto-style3">&nbsp;</td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>
<script src="Scripts/jquery-3.4.1.min.js"></script>
<script type="text/javascript">
    $("#btnSubmit").click(function () {
        var userName = $("#txtUserName").val();
        var userPassword = $("#txtPassword").val();
        $.ajax({
            url: "api/Login/ValidateUser",
            //url: "Login.aspx/ValidateUser",
            type: "POST",
            //data: "{loginModel:{ UserName:'" + userName + "', Password:'" + userPassword + "'}}",
            data: "{ UserName:'" + userName + "', Password:'" + userPassword + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                debugger;
                //if (data.d.Data.Success === true) {
                if (data.Data.Success === true) {
                    alert("Login successful");
                    window.location.replace("Default.aspx");
                }
                else {
                    alert("Invalid UserName and(or) Password.");
                }
            }
        });
    });

</script>
