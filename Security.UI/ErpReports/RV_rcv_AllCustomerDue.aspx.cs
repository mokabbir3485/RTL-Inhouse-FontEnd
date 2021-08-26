using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_rcv_AllCustomerDue : System.Web.UI.Page
    {
        public Nullable<int> CompanyTypeId { get; set; }
        public Nullable<int> EmployeeId { get; set; }
        public Nullable<int> CompanyId { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
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

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["CompanyTypeId"] = CompanyTypeId;
            e.InputParameters["EmployeeId"] = EmployeeId;
            e.InputParameters["CompanyId"] = CompanyId;
        }
    }
}