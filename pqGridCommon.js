/// <reference path="../../lib/scripts/jquery-ui-1.9.2.min.js" />
/// <reference path="../../lib/scripts/jquery-1.9.0.min.js" />


function PqGridCommonVM(reportType) {
    ReportType = reportType;
    const self = this;

    self.urlValue = "";
    self.gridId = "";
    self.recIndex = "tranId";

    // grid style related
    var headerFontSize = "16px";
    var gridFontSize = "14px";
    var headerFontWeight = "bold";
    //

    const ajaxConfig = {
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "applicaiton/json; charset=utf-8",
        url: "",
        data: "",
        beforeSend: function () {
            $(".loadingGif").show();
        },
        complete: function () {
            $(".loadingGif").hide();
        },
        success: function () {
            $(".loadingGif").hide();
        },
        error: function () {
            $(".loadingGif").hide();
        }
    },
        ajaxCall = function (config) {
            $.ajax(config);
        };

    const pqOptions = {
        width: "auto",
        height: 570,
        showTitle: false,
        showHeader: true,
        showTop: true,
        showToolbar: true,
        showBottom: true,
        wrap: false,
        hwrap: false,
        sortable: false,
        editable: false,
        resizable: false,
        collapsible: false,
        virtualX: true,
        virtualY: true,
        draggable: true,
        scrollModel: {
            autoFit: true
        },

        numnerCell: {
            show: true, resizable: true, title: "S.N."
        },
        pageModel: {
            curPage: 1,
            rPP: 20, rPPOptions: [10, 20, 50, 100, 200, 500, 1000, 10000,100000],
            type: (ReportType == "clientSummary" || ReportType == "clientDetails"?"local":"remote"),
            strRpp: "{0}"

        },
        columnTemplate: {
            wrap: true, editable: false, dataType: "string", halign: "center"
        },
        columnBorders: true,
        ftionMode: { type: "row" },
        toolbar: {
            items: [{
                type: "select",
                label: "Format:",
                attr: "id='export_format'",
                options: [{ xlsx: "Excel", csv: "Csv", html: "html", json: "json" }]
            },
            {
                type: "button",
                label: "Export",
                attr: "class='btn btn-default'",
                listener: function () {
                    var format = $("#export_format").val(),
                        blob = this.exportData({
                            nopqdata: true,
                            render: true,
                            format: format
                        });

                    if (typeof blob === "string") {
                        blob = new Blob([blob]);
                    }

                    var dateObj = new Date();
                    saveAs(blob, reportType + dateObj.getFullYear() + "-" + dateObj.getMonth() + "-" + dateObj.getDate() + "." + format)

                }
            }]
        },

        filterModel: {
            on: true,
            header: true,
            type: 'local',
            menuIcon: true
        },
        columnTemplate: { wrap: true, editable: false, dataType: "string", halign: "center", hvalign: "center", resizable: true, styleHead: { 'font-weight': "bold" } },

    }

    self.CommonGrid = function () {
        const allData = {
            location: "remote",
            contentType: "application/json; charset=UTF-8",
            dataType: "JSON",
            method: "GET",
            url: self.urlValue + "?ClientID=" + self.ClientID() + "&ClientName=" + self.ClientName() + "&DateFrom=" + self.DateFrom() + "&DateTo=" + self.DateTo() + "&Status=" + self.Status() + "&ActionType=" + self.ActionType(),
            recIndx: self.recIndex,
            beforeSend: function () {
                return true;
            },
            error: function (errorThrown) {
                console.log(errorThrown);
            },

            getData: function (result) {
                //debugger;
                if (result.Success) {
                    return {
                        curPage: result.Data.CurrentPage, totalRecords: result.Data.TotalNoOfRecords, data: result.Data.Records
                    };
                }

                else {
                    console.log(result.Message);

                    return {
                        curPage: 0, totalRecords: 0, data: []
                    };
                }
            }

        };

        pqOptions.dataModel = allData;
        self.$sctGrid = $(self.gridDivId).pqGrid(pqOptions);
    };

    self.Search = function () {
        self.GridDestroy();
        self.CommonGrid();

    };

    self.GridDestroy = function () {
        if (self.$sctGrid.pqGrid('instance')) {
            self.$sctGrid.pqGrid('destroy');
        }

    }

    self.searchClick = function () {
        //debugger;
        self.GridDestroy();
        self.CommonGrid();

        self.Search();
    };

    self.killProcessClick = function (id) {
        //alert("kill :" + id);
        //debugger;
        ajaxConfig.async = true;
        ajaxConfig.url = "/LongRunningQuery/KillLongRunning" + "?ClientID=" + self.ClientID() + "&SessionID=" + id;
        ajaxConfig.success = function (data) {
            if (data.Success) {
                alert("Kill process performed successfully!");
                self.Search();

            }
            else {
                debugger;
                alert(data.Data.ErMsg);
                self.Search();

            }
        }
        ajaxCall(ajaxConfig);
    }

    //self.ClientIDChange = function (event, newValue) {
    //    self.DateFrom('');
    //    self.DateTo('');
    //    self.searchClick();
    //}

    self.defracClick = function (id) {
        ajaxConfig.async = true;
        ajaxConfig.url = "/ClientMaintenance/DefragDB" + "?ClientID=" + id;
        ajaxConfig.success = function (data) {
            if (data.Success) {
                alert("Task performed successfully!");
            }
            else {
                alert(data.Data.ErMsg);
            }
        }
        ajaxCall(ajaxConfig);

    };

    self.deleteClientClick = function () {
        //debugger;
        ajaxConfig.async = true;
        var id = document.getElementById('clientId').innerText;
        ajaxConfig.url = "/ClientDetails/Delete" + "?id=" + id;
        ajaxConfig.success = function (data) {
            if (data.Success) {
                alert("Client Data deleted successfully!");
                self.Search();
            }
            else {
                alert(data.Data.ErMsg);
            }
        }
        ajaxCall(ajaxConfig);

    };

    self.deleteConfirmClick = function (id) {
        $("#clientId").html(`${id}`);
    }

    var BakId = 0;
    self.manualBackupClick = function (id) {
        //alert("manual backup button works for clientId:" + id);
        //ajaxConfig.async = true;
        //ajaxConfig.url = "/ClientMaintenance/ManualBackup" + "?ClientID=" + id;
        //ajaxConfig.success = function () {
        //    if (data.success) {

        //    }
        //    else {
        //    }
        //}
        //ajaxCall(ajaxConfig);
        BakId = id;
        $("#bak-det").html(`<input type="radio" value="1" id="full" name="backup-type" style="display: none;"/>
            <label for="full" style="display: none;"> Full Backup</label><br/>
            <input type="radio" value="2" id="diff" name="backup-type" />
            <label for="diff">Differential backup</label><br/>
            <input type="radio" value="3" id="fullcopy" name="backup-type" checked/>
            <label for="fullcopy">full Backup (copy only)</label>
            `);
    };

    self.SelectBakClick = function () {
        //debugger;
        var bkTypeId = $('input[name="backup-type"]:checked').val();
        ajaxConfig.async = true;
        ajaxConfig.url = "/ClientMaintenance/ManualBackup" + "?ClientID=" + BakId + "&BackupTypeID=" + bkTypeId;
        ajaxConfig.success = function (data) {
            //debugger;
            $(".loadingGif").hide();
            if (data.Success) {
                alert("Backup saved successfully!");

            }
            else {
                alert(data.Data.ErMsg);

            }
        }
        ajaxCall(ajaxConfig);
    }

    self.missingIndexClick = function (id) {
        //alert("missing Index button works for clientId:" + id);
        ajaxConfig.async = true;
        ajaxConfig.url = "/ClientMaintenance/MissingIndex" + "?ClientID=" + id;
        ajaxConfig.success = function (data) {
            $(".loadingGif").hide();

            if (data.Success) {
                alert("Missing index performed successfully!");

            }
            else {
                alert(data.Data.ErMsg);

            }
        }
        ajaxCall(ajaxConfig);

    };

    self.queryClick = function (id) {
        //alert("query button works for clientId:" + id);
        ajaxConfig.async = true;
        ajaxConfig.url = "/ClientMaintenance/UpdateStats" + "?ClientID=" + id;
        ajaxConfig.success = function (data) {
            $(".loadingGif").hide();
            if (data.Success) {
                alert("Update Stats performed successfully!");
            }
            else {
                alert(data.Data.ErMsg);

            }
        }
        ajaxCall(ajaxConfig);

    };


    self.retryClick = function (id, tranId) {
        //debugger;
        //alert("retry button works for clientId:" + id);
        ajaxConfig.async = true;
        ajaxConfig.url = "/DayEnd/RetryDayEnd" + "?ClientID=" + id + "&TranID=" + tranId;
        ajaxConfig.success = function (data) {
            $(".loadingGif").hide();
            if (data.Success) {
                // when successful
                alert("Day End retry(request) performed successfully!");

            }
            else {
                alert(data.Data.ErMsg);
            }
        }

        ajaxCall(ajaxConfig);

        // reload the grid after retry operation
        self.Search();
    };

    self.detailsClick = function (text) {
        $("#error-det").html(text);
    }

    function init() {
        //debugger;

        self.ClientID = ko.observable('');
        self.ClientName = ko.observable('');

        var today = new Date();
        var newVal = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        self.DateFrom = ko.observable(newVal.getFullYear() + '-' + (newVal.getMonth() + 1).toString().padStart(2, '0') + '-' + newVal.getDate().toString().padStart(2, '0'));
        self.DateTo = ko.observable(today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0'));

        self.StatusList = ko.observableArray([{ id: 0, value: "All (Status)" },
        { id: 1, value: "Request" },
        { id: 2, value: "Running" },
        { id: 3, value: "Success" },
        { id: 4, value: "Failure" }]);

        self.Status = ko.observable(0);

        if (ReportType == "dayEnd") {

            self.urlValue = "/DayEnd/GetDayEndReport";
            self.gridDivId = "#koDayEnd";
            pqOptions.colModel =
                [
                    {
                        title: "Tran Id", dataIndx: "TranId", width: "10%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Br Code", dataIndx: "BrCode", width: "20%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Date", dataIndx: "Date", width: "35%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Action Date", dataIndx: "ActionDate", width: "32%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    }
                ]
        }
        else if (ReportType == "dayEndTran") {

            self.urlValue = "/DayEnd/GetDayEndTranReport";
            self.gridDivId = "#koDayEndTran";
            //self.columnModel =
            pqOptions.colModel =
                [
                    {
                        title: "Tran Id", dataIndx: "TranId", width: "5%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Client Id", dataIndx: "ClientId", width: "5%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Day End Req Sys Date", dataIndx: "DayEndReqSysDateTime", width: "13%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "DayEnd Tran Date", dataIndx: "DayEndTranDate", width: "10%", align: "center",
                        render: (ui) => {
                            if (ui.cellData) {

                                var dateVal = new Date(ui.cellData);
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "DayEnd Start Date", dataIndx: "DayEndStartTime", width: "12%", align: "center",
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "DayEnd End Date", dataIndx: "DayEndEndTime", width: "12%", align: "center",
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "DayEnd Duration(ms)", dataIndx: "DayEndDuration", width: "12%", align: "center",
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },

                    {
                        title: "DayEnd Failed Cause", dataIndx: "DayEndFailedCause", width: "13%", align: "right",
                        render: function (ui) {
                            //debugger;
                            if (ui.cellData) {

                                let str = ui.cellData;
                                if (str.length > 0) {
                                    return `<span>${str.substring(1, 15)}</span>    <button type='button' class='btn btn-primary' data-toggle="modal" data-target="#detailModel"  onclick='objec.detailsClick("${ui.rowData.DayEndFailedCause}")'><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></button> `
                                }
                            }
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "DayEnd Status", dataIndx: "Status", width: "10%", align: "left",
                        render: (ui) => {
                            //debugger;
                            if (ui.cellData == 'Failure' && ui.rowData.isLatest == '1') {
                                return `<span>${ui.cellData}</span>    <button type='button' class='btn btn-primary' onclick='objec.retryClick("${ui.rowData.ClientId}","${ui.rowData.TranId}")'>Retry</button> `
                            }
                            else {
                                return `${ui.cellData}`;
                            }
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "IsLatest", dataIndx: "IsLatest", width: "7%", align: "center",
                        ////column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },

                ];


        }

        else if (ReportType == "sct") {
            self.urlValue = "/SCTReport/GetSCTReport";
            self.gridDivId = "#koSct";
            //self.columnModel =
            pqOptions.colModel =
                [
                    {
                        title: "Tran Id", dataIndx: "TranId", width: "3%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Company Name", dataIndx: "CmpName", width: "10%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Date", dataIndx: "Date", width: "8%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Message Type", dataIndx: "MessageType", width: "8%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Originator", dataIndx: "Originator", width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Amount", dataIndx: "Amount", width: "8%", align: "right",
                        render: (ui) => {
                            return (parseFloat(ui.cellData) || 0).toFixed(2);
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Tran Charge", dataIndx: "TranCharge", width: "7%", align: "right",
                        render: (ui) => {
                            return (parseFloat(ui.cellData) || 0).toFixed(2);
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Trace", dataIndx: "Trace", width: "5%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },

                    {
                        title: "Sys Date Time", dataIndx: "SysDateTime", width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },

                    {
                        title: "PAN", dataIndx: "Pan", width: "8%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Card", dataIndx: "Card", width: "7%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Issuer Id", dataIndx: "IssuerId", width: "7%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Acquirer Id", dataIndx: "AcquirerId", width: "7%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },

                ]
        }

        else if (ReportType == "clientHist") {
            self.urlValue = "/ClientMaintenance/ClientMaintenanceNav/";
            self.gridDivId = "#koApp";
            //self.columnModel =
            pqOptions.colModel =
                [
                    {
                        title: "Client Id", dataIndx: "ClientId", width: "7%", align: "right", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Client Name", dataIndx: "ClientName", width: "19%", align: "left", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Cloud Expiry Date", dataIndx: "CloudExpiryDate", width: "13%", align: "center",
                        render: (ui) => {
                            if (ui.cellData) {

                                var dateVal = new Date(ui.cellData);
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        }, filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Grace Days", dataIndx: "GraceDays", width: "10%", align: "right",
                        filter: {
                            crules: [{ condition: 'begin' }]
                        },
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Before Expiry Notificaiton", dataIndx: "BeforeExpiryNotificaiton", width: "15%", align: "right",
                        filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    //{ title: "Status", dataIndx: "status", width: "10%", align: "left" },
                    {
                        title: "Action", title: "Action", render: function (ui) {
                            return `<button type='button' class='btn btn-primary' onclick='objec.defracClick("${ui.rowData.ClientId}")'>Disk Defrag</button> ` +
                                `<button type='button' class='btn btn-primary' onclick='objec.queryClick("${ui.rowData.ClientId}")'>Update Stats</button> ` +
                                `<button type='button' class='btn btn-primary' onclick='objec.missingIndexClick("${ui.rowData.ClientId}")'>Missing Index</button> ` +
                                `<button type='button' class='btn btn-primary' data-toggle="modal" data-target="#bakModel" onclick='objec.manualBackupClick("${ui.rowData.ClientId}")'>Backup</button> `

                        }, width: "36%", align: "center",
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        },
                        exportRender: false

                    }]
        }

        else if (ReportType == "sms") {
            self.urlValue = "/SmsHistory/GetSmsHistory";
            self.gridDivId = "#koSms";
            //self.columnModel =
            pqOptions.colModel =
                [
                    //{ title: "Tran Id", dataIndx: "tranId", width: "5%", align: "right" },
                {
                        title: "Status", dataIndx: "Status", width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                },
                    {
                        title: "Date", dataIndx: "Date", width: "10%", align: "center",
                        render: (ui) => {
                            if (ui.cellData) {

                                var dateVal = new Date(ui.cellData);
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Success Time", dataIndx: "SuccessTime", width: "15%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Error Desc", dataIndx: "ErrorDesc", width: "35%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },

                    {
                        title: "Service Type", dataIndx: "ServiceTypeName", width: "30%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    }
                ]
        }

        else if (ReportType == "longRunning") {
            //debugger;
            self.urlValue = "/LongRunningQuery/GetLongRunningQueryReport";
            self.gridDivId = "#koLR";
            pqOptions.colModel =
                [
                    {
                        title: "Text", dataIndx: "Text", width: "45%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Session Id", dataIndx: "SessionId", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Status", dataIndx: "Status", width: "7%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Commmand", dataIndx: "Command", width: "12%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "CpuTime", dataIndx: "CpuTime", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Total Elapsed Time", dataIndx: "TotalElapsedTime", width: "12%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Action", render: function (ui) {
                            return ` <button type='button' class='btn btn-danger' onclick='objec.killProcessClick("${ui.rowData.SessionId}")'>Kill Process</button> `
                        },
                        width: "10%", align: "left",
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    }
                ]
        }


        else if (ReportType == "clientDetails") {
            self.urlValue = "/ClientDetails/GetAllClients";
            self.gridDivId = "#KoClientDetails";
            pqOptions.colModel =
                [
                    {
                        title: "Client Id", dataIndx: "ClientId", width: "4%", align: "right", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Client Name", dataIndx: "ClientName", width: "12%", align: "left", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Alias", dataIndx: "Alias", width: "3%", align: "center",
                        filter: {
                            crules: [{ condition: 'begin' }],
                        },
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Data Source", dataIndx: "DataSource", width: "12%", align: "center", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "DB Name", dataIndx: "DbName", width: "9%", align: "left", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },

                    {
                        title: "Mobile No", dataIndx: "MobileNo", width: "6%", align: "right", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Address", dataIndx: "AddressInfo", width: "7%", align: "left", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Email", dataIndx: "EmailId", width: "6%", align: "right", filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    //{ title: "AtmBinNo", dataIndx: "atmBinNo", width: "5%", align: "right", filter: { crules: [{ condition: 'begin' }] } },
                    //{ title: "Settlement No", dataIndx: "settlementAcNo", width: "5%", align: "right" },
                    //{ title: "Sct Inst Id", dataIndx: "sctInstId", width: "5%", align: "right" },
                    {
                        title: "Card Prod Type", dataIndx: "CardProdType", width: "7%", align: "right",
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    //column styles

                    {
                        title: "Cloud Expiry Date", dataIndx: "CloudExpiryDate", width: "9%", align: "center", render: (ui) => {
                            if (ui.cellData) {

                                var dateVal = new Date(ui.cellData);
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        }, filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },

                    {
                        title: "Grace Days", dataIndx: "GraceDays", width: "5%",
                        align: "right",
                        filter: {
                            crules: [{ condition: 'begin' }]
                        },
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Before expiry notification", dataIndx: "BeforeExpiryNotification", width: "7%", align: "right",
                        filter: {
                            crules: [{ condition: 'begin' }]
                        },
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Action", title: "Action", render: function (ui) {
                            return `<a href = "/ClientDetails/Edit/${ui.rowData.ClientId}"><button type='button' class='btn btn-primary'>Edit</button></a> ` +
                                ` <button type='button' class='btn btn-danger' data-toggle="modal" data-target="#confirmModel" onclick='objec.deleteConfirmClick("${ui.rowData.ClientId}")'>Delete</button> `

                        }, width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        },
                        exportRender: false


                    }
                ]

        }

        else if (ReportType == "clientSummary") {
            //debugger;
            self.urlValue = "/ClientDetails/GetAllClients";
            self.gridDivId = "#koCS";
            pqOptions.colModel =
                [
                    {
                        title: "Client Id", dataIndx: "ClientId", width: "10%", align: "center",
                        filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Client Name", dataIndx: "ClientName", width: "40%", align: "left",
                        filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Cloud Expiry Date(AD)", dataIndx: "CloudExpiryDate", width: "15%", align: "center", render: (ui) => {
                            if (ui.cellData) {

                                var dateVal = new Date(ui.cellData);
                                //debugger;
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        },
                        filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    { title: "Cloud Expiry Date(BS)", dataIndx: "CloudExpiryNepDate", width: "15%", align: "center" ,
                        filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                     },
                    {
                        title: "Grace Days", dataIndx: "GraceDays", width: "10%", align: "center",
                        filter: { crules: [{ condition: 'begin' }] },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    //{ title: "Before expiry notification", dataIndx: "beforeExpiryNotification", width: "7%", align: "right" },
                    {
                        title: "Action", title: "Action", render: function (ui) {
                            return `<a href = "/ClientMast/Edit/${ui.rowData.ClientId}"><button type='button' class='btn btn-primary'>Edit</button></a> `

                        }, width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        },
                        exportRender:false      



                    }
                ],
                pqOptions.rowInit = function (ui) {
               // debugger;
                    var value = new Date(ui.rowData.CloudExpiryDate);
                    var today = new Date();
                    if (value < today)
                        //debugger;
                        return {

                            style: {
                                'background-color': '#f0948d', 'font-style': 'bold'
                            }
                        }

                    //else {
                    //    return {
                    //        style: {
                    //            'color': 'black', 'font-style': 'normal'
                    //        }
                    //    }
                    //}
                }
                ,
                pqOptions.sortModel = {
                    single: false,
                    sorter: [{ dataIndx: 'CloudExpiryDate', dir: 'up' }],
                    space: true,
                    multiKey: null
                }

        }

        else if (ReportType == "dataGrowth") {
            self.urlValue = "/ClientData/GetDataGrowthReportNew";
            self.gridDivId = "#koCG";
            pqOptions.colModel =
                [
                    {
                        title: "Date(AD)", dataIndx: "EnglishDate", width: "25%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                        //filter: { crules: [{ condition: 'begin' }] }
                    },
                    {
                        title: "Date(BS)", dataIndx: "Date", width: "25%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                        //filter: { crules: [{ condition: 'begin' }] }
                    },
                    {
                        title: "DataSpace(MB)", dataIndx: "TableRowsCount", width: "25%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                        //filter: { crules: [{ condition: 'begin' }] }
                    },
                    {
                        title: "DataSpace(GB)", width: "25%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        },
                        //filter: { crules: [{ condition: 'begin' }] },
                        render: (ui) => {
                            return (parseFloat(ui.rowData.TableRowsCount / 10) || 0).toFixed(2);
                        }
                    }
                ]

        }

        else if (ReportType == "mb") {
            self.urlValue = "/MobileBanking/GetMobileankingReport";
            self.gridDivId = "#koMB";
            pqOptions.colModel =
                [
                    {
                        title: "TranId", dataIndx: "TranId", width: "4%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Br Code", dataIndx: "BrCode", width: "4%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Cust. Code", dataIndx: "CustomerCode", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Ac No", dataIndx: "AcNo", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Req Text", dataIndx: "ReqText", width: "6%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Req Mobile No", dataIndx: "ReqMobileNo", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    
                    {
                        title: "Pmt Date", dataIndx: "PaymentDate", width: "7%", align: "left",
                        render: (ui) => {
                            if (ui.cellData) {
                                var dateVal = new Date(ui.cellData);
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Pmt Amt", dataIndx: "PaymentAmt", width: "6%", align: "right",
                        render: (ui) => {
                            return
                            (parseFloat(ui.row.cellData) || 0).toFixed(2);
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Action", dataIndx: "Action", width: "5%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Return Code", dataIndx: "ReturnCode", width: "8%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Vch No", dataIndx: "VchNo", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Sms Time Stamp", dataIndx: "SmsTimeStamp", width: "7%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Cust. Comm Amt", dataIndx: "CustomerCommAmt", width: "7%", align: "right",
                        render: (ui) => {
                            return
                            (parseFloat(ui.row.CustomerCommAmt / 10) || 0).toFixed(2);
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }


                    },
                    {
                        title: "Inst. Comm Amt", dataIndx: "InstitutionCommAmt", width: "7%", align: "right",
                        render: (ui) => {
                            return
                            (parseFloat(ui.row.InstitutionCommAmt / 10) || 0).toFixed(2);
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }
                    },
                    {
                        title: "Rev Vch No", dataIndx: "RevVchNo", width: "5%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Rev Vch Date", dataIndx: "RevVchDate", width: "5%", align: "left",
                        render: (ui) => {
                            if (ui.cellData) {

                                var dateVal = new Date(ui.cellData);
                                return (dateVal.getFullYear() + '-' + (dateVal.getMonth() + 1).toString().padStart(2, '0') + '-' + dateVal.getDate().toString().padStart(2, '0'));
                            }
                        },
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    }

                ]

        }

        else if (ReportType == "logReport") {
            self.urlValue = "/LogReport/GetLogReport";
            self.gridDivId = "#koLog";
            pqOptions.colModel =
                [
                    {
                        title: "Tran Id", dataIndx: "TranId", width: "5%", align: "right",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Process Name", dataIndx: "ProcessName", width: "15%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Tran User Id", dataIndx: "TranUserId", width: "20%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Tran Date", dataIndx: "TranDate", width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Sys Start Date", dataIndx: "SysStartDateTime", width: "10%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Sys End Date", dataIndx: "SysEndDateTime", width: "20%", align: "center",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    },
                    {
                        title: "Desc", dataIndx: "Description", width: "20%", align: "left",
                        //column styles
                        style: {
                            'font-size': gridFontSize
                        },
                        styleHead: {
                            'font-size': headerFontSize, 'font-weight': headerFontWeight
                        }

                    }

                ];

        };

        self.ActionTypeList = ko.observableArray([{ id: 0, value: "All Processes" },
        { id: 1, value: "MISSING INDEX" },
        { id: 2, value: "DEFRAG DB" },
        { id: 3, value: "MANUAL BACKUP" },
        { id: 4, value: "UPDATE STATS" }]);


        self.ActionType = ko.observable(self.ActionTypeList()[0].value);

        self.CommonGrid();

        //subscribe added, so everytime fthe values are changed, it performs desired task
        //self.ClientID.subscribe(function () {
        //    self.DateFrom('');
        //    self.DateTo('');
        //self.ClientName('');
        //self.CommonGrid();
        //    self.searchClick();

        //});

        //self.ClientName.subscribe(function () {
        //    self.DateFrom('');
        //    self.DateTo('');
        //self.ClientID('');
        // self.CommonGrid();
        //    self.searchClick();

        //});

        //self.DateFrom.subscribe(function () {
        //    //self.searchClick();
        //});

        //self.DateTo.subscribe(function () {
        //    //self.searchClick();
        //});



    }
    init();
}


