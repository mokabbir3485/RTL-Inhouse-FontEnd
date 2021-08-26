<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RV_pro_DateWiseProductionStatus.aspx.cs" Inherits="Security.UI.ErpReports.RV_pro_DateWiseProductionStatus" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

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
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Font-Names="Verdana" Font-Size="8pt" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt"  Height="620px" Width="1100px">
            <LocalReport ReportPath="ErpReports\rpt_pro_DateWiseProductionStatus.rdlc" ReportEmbeddedResource="Security.UI.ErpReports.rpt_pro_DateWiseProductionStatus.rdlc">
                <DataSources>
                    <rsweb:ReportDataSource DataSourceId="ObjectDataSource1" Name="DataSet1" />
                </DataSources>
            </LocalReport>
        </rsweb:ReportViewer>
        <asp:ObjectDataSource ID="ObjectDataSource1" runat="server" OldValuesParameterFormatString="original_{0}" SelectMethod="GetData" TypeName="Security.UI.App_Code.DataSet.ds_pro_DateWiseProductionStatusTableAdapters.xRpt_pro_DateWiseProductionStatusTableAdapter" OnSelecting="ObjectDataSource1_Selecting">
            <SelectParameters>
                <asp:Parameter Name="fromDate" Type="DateTime"/>
                <asp:Parameter Name="toDate" Type="DateTime"/>
            </SelectParameters>
        </asp:ObjectDataSource>
        <br />    
    </div>
    </form>
</body>
</html>
