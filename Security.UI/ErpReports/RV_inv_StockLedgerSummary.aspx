<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_inv_StockLedgerSummary.aspx.cs" Inherits="Security.UI.ErpReports.RV_inv_StockLedgerSummary" %>

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
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="600px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="1150px">
                <LocalReport ReportPath="ErpReports\rpt_inv_StockLedgerSummary.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_inv_StockLedgerSummary.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="StockLedgerSummary"/>
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
        </div>
        <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.DataSet.StockLedgerSummaryTableAdapters.xRpt_inv_StockLedgerSummaryTableAdapter" OnSelecting="ObjectDataSource1_Selecting">
            <SelectParameters>
                <asp:Parameter Name="FromDate" Type="DateTime" />
                <asp:Parameter Name="ToDate" Type="DateTime" />
                <asp:Parameter Name="ItemId" Type="Int32" />
            </SelectParameters>
        </asp:ObjectDataSource>
    </form>
</body>
</html>
