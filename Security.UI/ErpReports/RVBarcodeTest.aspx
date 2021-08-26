<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RVBarcodeTest.aspx.cs" Inherits="Security.UI.ErpReports.RVBarcodeTest" %>

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
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Height="600px" Width="1100px">
            <LocalReport ReportPath="ErpReports\BarcodeTest.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.BarcodeTest.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="dsBarcodeTest" />
                </DataSources>
            </LocalReport>
        </rsweb:ReportViewer>
        <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.Dataset.dsBarcodePrintTableAdapters.ad_BarcodePrint_GetTableAdapter" OnSelecting="ObjectDataSource1_Selecting">
        </asp:ObjectDataSource>
    </div>
    </form>
</body>
</html>
