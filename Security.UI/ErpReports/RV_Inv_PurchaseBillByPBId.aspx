﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_Inv_PurchaseBillByPBId.aspx.cs" Inherits="Security.UI.ErpReports.RV_Inv_PurchaseBillByPBId" %>

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
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" Height="600px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="750px">
            <LocalReport ReportPath="ErpReports\rpt_inv_PurchaseBillByPBId.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_inv_PurchaseBillByPBId.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="ds_inv_PurchaseBillByPBId" />
                </DataSources>
            </LocalReport>
        </rsweb:ReportViewer>
        <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" OnSelecting="ObjectDataSource1_Selecting" SelectMethod="GetData" TypeName="Security.UI.App_Code.Dataset.ds_inv_PurchaseBillByPBIdTableAdapters.xRpt_inv_PurchaseBillByPBIdTableAdapter">
            <SelectParameters>
                <asp:Parameter Name="PBId" Type="Int64" />
            </SelectParameters>
        </asp:ObjectDataSource>
    </div>
    </form>
</body>
</html>
