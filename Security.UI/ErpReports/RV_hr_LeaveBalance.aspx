<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_hr_LeaveBalance.aspx.cs" Inherits="Security.UI.ErpReports.RV_hr_LeaveBalance" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
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
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="600px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="1150px">
                <LocalReport ReportPath="ErpReports\rpt_hr_LeaveBalance.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_hr_LeaveBalance.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ds_hr_LeaveBalance" Name="ds_hr_LeaveBalance" />
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
            <asp:ObjectDataSource ID="ds_hr_LeaveBalance" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.DataSet.ds_hr_LeaveBalanceTableAdapters.xRpt_hr_LeaveBalanceTableAdapter" OnSelecting="ObjectDataSource1_Selecting">
                <SelectParameters>
                    <asp:Parameter Name="YearId" Type="Int32" />
                    <asp:Parameter Name="BranchId" Type="Int32" />
                    <asp:Parameter Name="GradeId" Type="Int32" />
                    <asp:Parameter Name="DepartmentId" Type="Int32" />
                    <asp:Parameter Name="SectionId" Type="Int32" />
                    <asp:Parameter Name="EmployeeId" Type="Int32" />
                </SelectParameters>
            </asp:ObjectDataSource>
        </div>
    </form>
</body>
</html>
