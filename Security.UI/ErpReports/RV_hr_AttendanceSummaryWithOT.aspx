﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_hr_AttendanceSummaryWithOT.aspx.cs" Inherits="Security.UI.ErpReports.RV_hr_AttendanceSummaryWithOT" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
<form id="form1" runat="server">
    <div>
    
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="632px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="1131px">
            <LocalReport ReportPath="ErpReports\rpt_hr_AttendanceSummaryWithOT.rdlc"  ReportEmbeddedResource="Security.UI.ErpReports.rpt_hr_AttendanceSummaryWithOT.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="dataSourceAttendanceSummaryWithOT" Name="ds_AttendanceSummaryWithOT" />
                </DataSources>
            </LocalReport>
        </rsweb:ReportViewer>
        <asp:ObjectDataSource ID="dataSourceAttendanceSummaryWithOT" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.DataSet.ds_hr_AttendanceSummaryTableAdapters.xRpt_hr_AttendanceSummaryTableAdapter" OnSelecting="ObjectDataSource1_Selecting1">
            <SelectParameters>
                <asp:Parameter Name="fdt" Type="DateTime" />
                <asp:Parameter Name="tdt" Type="DateTime" />
                <asp:Parameter Name="BranchId" Type="Int32" />
                <asp:Parameter Name="EmployeeId" Type="Int32" />
            </SelectParameters>
        </asp:ObjectDataSource>
    
    </div>
</form>

</body>
</html>
