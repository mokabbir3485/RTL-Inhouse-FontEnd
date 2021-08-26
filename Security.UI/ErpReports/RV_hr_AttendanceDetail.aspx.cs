using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_hr_AttendanceDetail : System.Web.UI.Page
    {
        public DateTime FromDate, ToDate;
        public int EmployeeId { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                    EmployeeId = Convert.ToInt32(Request.QueryString["EmployeeId"]);
                }
                catch (Exception)
                {
                    EmployeeId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["fdt"] = FromDate;
            e.InputParameters["tdt"] = ToDate;
            e.InputParameters["EmployeeId"] = EmployeeId;
        }
    }
}