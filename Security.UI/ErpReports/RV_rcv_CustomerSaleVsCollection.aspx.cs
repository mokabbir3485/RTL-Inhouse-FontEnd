using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_rcv_CustomerSaleVsCollection : System.Web.UI.Page
    {
        public DateTime FromDate, ToDate;
        public Int32? ItemId;
        public Nullable<int> CompanyTypeId { get; set; }
        public Nullable<int> EmployeeId { get; set; }
        public Nullable<int> CompanyId { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                }
                catch (Exception)
                {
                    //ignored
                }
                try
                {
                    CompanyTypeId = Convert.ToInt32(Request.QueryString["CompanyTypeId"]);
                }
                catch (Exception)
                {
                    CompanyTypeId = null;
                }

                try
                {
                    EmployeeId = Convert.ToInt32(Request.QueryString["EmployeeId"]);
                }
                catch (Exception)
                {
                    EmployeeId = null;
                }

                try
                {
                    CompanyId = Convert.ToInt32(Request.QueryString["CompanyId"]);
                }
                catch (Exception)
                {
                    CompanyId = null;
                }
            }
        }

        protected void ObjectDataSource1_Selecting1(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["fdt"] = FromDate;
            e.InputParameters["tdt"] = ToDate;
            e.InputParameters["CompanyTypeId"] = CompanyTypeId;
            e.InputParameters["EmployeeId"] = EmployeeId;
            e.InputParameters["CompanyId"] = CompanyId;
        }
    }
}