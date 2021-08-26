<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_pos_SaleComparison.aspx.cs" Inherits="Security.UI.ErpReports.RV_pos_SaleComparison" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
        <div>
            <%--<rsweb:ReportViewer ID="ReportViewer1" runat="server">--%>
        <rsweb:ReportViewer ID="ReportViewer2" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="620px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="775px">
            <LocalReport ReportPath="ErpReports\rpt_pos_SaleComparison.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_pos_SaleComparison.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="ds_pos_SaleComparison" />
                </DataSources>
            </LocalReport>
            </rsweb:ReportViewer>
            <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.Dataset.ds_pos_SaleComparisonTableAdapters.xRpt_pos_SaleComparisonTableAdapter"></asp:ObjectDataSource>
        </div>
    </form>
</body>
</html>
