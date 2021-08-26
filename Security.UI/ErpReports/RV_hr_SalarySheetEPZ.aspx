<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_hr_SalarySheetEPZ.aspx.cs" Inherits="Security.UI.ErpReports.RV_hr_SalarySheetEPZ" %>

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
                <LocalReport ReportPath="ErpReports\rpt_hr_SalarySheet_EPZ.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_hr_SalarySheet_EPZ.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ds_hr_SalarySheetEPZ" Name="ds_hr_SalarySheet_EPZ" />
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
            <asp:ObjectDataSource ID="ds_hr_SalarySheetEPZ" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.DataSet.ds_hr_SalarySheetTableAdapters.xRpt_hr_SalarySheetTableAdapter" OnSelecting="ObjectDataSource1_Selecting">
                <SelectParameters>
                    <asp:Parameter Name="MonthId" Type="Int32" />
                    <asp:Parameter Name="YearId" Type="Int32" />
                    <asp:Parameter Name="GradeId" Type="Int32" />
                    <asp:Parameter Name="BranchName" Type="String" />
                    <asp:Parameter Name="UnitName" Type="String" />
                    <asp:Parameter Name="DepartmentName" Type="String" />
                    <asp:Parameter Name="Header1" Type="String" />
                    <asp:Parameter Name="Header2" Type="String" />
                    <asp:Parameter Name="Header3" Type="String" />
                </SelectParameters>
            </asp:ObjectDataSource>
        </div>
    </form>
</body>
</html>
