<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RVSaleByCustomerWithRef.aspx.cs" Inherits="Security.UI.ErpReports.RVSaleByCustomerWithRef" %>
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
     <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="615px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="1340px">
            <LocalReport ReportPath="ErpReports\rpt_pos_SaleByCustomerWithRef.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_pos_SaleByCustomerWithRef.rdlc">
              
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="dsSaleByOutlet" />
                </DataSources>
              
            </LocalReport>
        </rsweb:ReportViewer>
        <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" OnSelecting="ObjectDataSource1_Selecting" SelectMethod="GetData" TypeName="Security.UI.App_Code.Dataset.ds_pos_SaleByCustomerWithRefTableAdapters.xRpt_pos_SaleByCustomerWithRefTableAdapter">
            <SelectParameters>
                <asp:Parameter Name="FromDate" Type="DateTime" />
                <asp:Parameter Name="ToDate" Type="DateTime" />
                <asp:Parameter Name="BranchId" Type="Int32" />
                <asp:Parameter Name="DepartmentId" Type="Int32" />
                <asp:Parameter Name="UnitName" Type="String" />
                <asp:Parameter Name="SaleType" Type="Int32" />
                <asp:Parameter Name="CategoryId" Type="Int32" />
                <asp:Parameter Name="SubcategoryId" Type="Int32" />
                <asp:Parameter Name="ItemId" Type="Int32" />
                <asp:Parameter Name="CustomerTypeId" Type="Int32" />
                <asp:Parameter Name="CustomerCode" Type="String" />
                <asp:Parameter Name="BuyerType" Type="String" />
            </SelectParameters>
        </asp:ObjectDataSource>
    </div>
    </form>
</body>
</html>
