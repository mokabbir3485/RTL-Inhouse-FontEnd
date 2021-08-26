<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RVBarcodePrintForCustomer.aspx.cs" Inherits="Security.UI.ErpReports.RVBarcodePrintForCustomer" %>

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
            <LocalReport ReportPath="ErpReports\rptBarcodePrintForCustomer.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rptBarcodePrintForCustomer.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="dsBarcodePrintForCustomer" />
                </DataSources>
            </LocalReport>
        </rsweb:ReportViewer>
        <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.Dataset.dsBarcodePrintForCustomerTableAdapters.ad_BarcodePrint_GetForCustomerTableAdapter"></asp:ObjectDataSource>
    </div>
    </form>
</body>
</html>
