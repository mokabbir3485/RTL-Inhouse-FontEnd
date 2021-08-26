using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RVSalesInvoice : System.Web.UI.Page
    {
        public DateTime FromDate = DateTime.Now;
        public DateTime ToDate = DateTime.Now;
        public Int32? BranchId=0;
        public Int32? DepartmentId = 0;
        public Int32? IsVoid = null;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                }
                catch (Exception)
                {
                    FromDate = DateTime.Now;
                }

                try
                {
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                }
                catch (Exception)
                {
                    ToDate = DateTime.Now;
                }
                try
                {
                    BranchId = Convert.ToInt32(Request.QueryString["BranchId"]);
                }
                catch (Exception)
                {
                    BranchId = null;
                }
                try
                {
                    DepartmentId = Convert.ToInt32(Request.QueryString["DepartmentId"]);
                }
                catch (Exception)
                {
                    DepartmentId = null;
                }
                try
                {
                    IsVoid = Convert.ToInt32(Request.QueryString["IsVoid"]);
                }
                catch (Exception)
                {
                    IsVoid = null;
                }
            }
        }
        protected void ObjectDataSource1_Selecting1(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["From"] = FromDate;
            e.InputParameters["To"] = ToDate;
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["DepartmentId"] = DepartmentId;
            e.InputParameters["IsVoid"] = IsVoid;
        }
    }
}