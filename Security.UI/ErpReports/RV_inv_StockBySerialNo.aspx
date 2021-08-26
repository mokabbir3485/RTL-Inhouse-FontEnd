<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_inv_StockBySerialNo.aspx.cs" Inherits="Security.UI.ErpReports.RV_inv_StockBySerialNo" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="1083px" Height="620px">
                <LocalReport ReportPath="ErpReports\rpt_inv_StockBySerialNo.rdlc"  ReportEmbeddedResource="Security.UI.ErpReports.rpt_inv_StockBySerialNo.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="inv_StockBySerialNo" />
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
            <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" SelectMethod="GetData" TypeName="Security.UI.App_Code.DataSet.ds_inv_StockBySerialNoTableAdapters.xRpt_inv_StockBySerialNoTableAdapter" OldValuesParameterFormatString="original_{0}" OnSelecting="ObjectDataSource1_Selecting">
                <SelectParameters>
                    <asp:Parameter Name="BranchId" Type="Int32" />
                    <asp:Parameter Name="DepartmentId" Type="Int32" />
                    <asp:Parameter Name="ItemId" Type="Int32" />
                    <asp:Parameter Name="Value" Type="String" />
                </SelectParameters>
            </asp:ObjectDataSource>
        </div>
    </form>
</body>
</html>
