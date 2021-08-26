<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_inv_PurchaseBySupplier.aspx.cs" Inherits="Security.UI.ErpReports.RV_inv_PurchaseBySupplier" %>

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
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="629px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="799px">
                <LocalReport ReportPath="ErpReports\rpt_inv_PurchaseBySupplierR.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_inv_PurchaseBySupplierR.rdlc">
                    <DataSources>
                        <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="DataSet1" />
                    </DataSources>
                </LocalReport>
            </rsweb:ReportViewer>
            <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" OnSelecting="ObjectDataSource1_Selecting" SelectMethod="GetData" TypeName="Security.UI.App_Code.Dataset.ds_inv_PurchaseBySupplierTableAdapters.xRpt_inv_PurchaseBySupplierTableAdapter">
                <SelectParameters>
                    <asp:Parameter Name="SupplierId" Type="Int32" />
                    <asp:Parameter Name="FromDate" Type="DateTime" />
                    <asp:Parameter Name="ToDate" Type="DateTime" />
                </SelectParameters>
            </asp:ObjectDataSource>
            <br />
        </div>

    </form>
</body>
</html>
