using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
//using Security.UI.ErpReports.DataSet;

namespace Security.UI.ErpReports
{
    public partial class MasterViewer : System.Web.UI.Page
    {
        ReportDataSource rds = new ReportDataSource();
        public Int32 reportId = 1;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                //Common Codes
                ReportViewerMaster.Reset();
                ReportViewerMaster.Height = Unit.Pixel(620);
                ReportViewerMaster.Width = Unit.Pixel(1160);
                ReportViewerMaster.ProcessingMode = ProcessingMode.Local;
                //end
                
                //CASE HERE
                switch (reportId)
                {
                    case 1: //
                        //ds_exp_ExpNoReqApplicationTableAdapters.xRpt_exp_ExpNoRequestApplicationTableAdapter req = new ds_exp_ExpNoReqApplicationTableAdapters.xRpt_exp_ExpNoRequestApplicationTableAdapter();
                        //Security.UI.ErpReports.xRpr_
                        //xRpt_exp_ExpNoRequestApplicationTableAdapters.
                        //exp_PaymentProcessTableAdapters
                        //Security.UI.ErpReports.DataSet.ds_hr_SalarySheetTableAdapters.xRpt_hr_SalarySheetTableAdapter taSalSheet = new Security.UI.ErpReports.DataSet.ds_hr_SalarySheetTableAdapters.xRpt_hr_SalarySheetTableAdapter();
                        rds = SetRDS("ds_hr_SalarySheet", "rpt_hr_SalarySheet");
                        //rds.Value = taSalSheet.GetData(9, 2019, 1, "", "", "", "", "", "");
                        break;
                    default:
                        break;
                }
            }
        }

        private ReportDataSource SetRDS(String dsName, String rptName)
        {
            System.Data.DataSet ds = new System.Data.DataSet(dsName);
            rds.Name = dsName;
            ReportViewerMaster.LocalReport.ReportPath = Server.MapPath("~/ErpReports/" + rptName + ".rdlc");
            return rds;
        }
    }
}