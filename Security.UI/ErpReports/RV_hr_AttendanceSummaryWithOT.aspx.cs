using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_hr_AttendanceSummaryWithOT : System.Web.UI.Page
    {
        public DateTime FromDate, ToDate;
        public int BranchId, EmployeeId,GradeId,  SectionId;
        public string DepartmentId;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                    BranchId = Convert.ToInt32(Request.QueryString["BranchId"]);
                    EmployeeId = Convert.ToInt32(Request.QueryString["EmployeeId"]);
                    GradeId = 0;
                    SectionId = 0;
                    DepartmentId = "0";
                }
                catch (Exception)
                {
                    BranchId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting1(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["fdt"] = FromDate;
            e.InputParameters["tdt"] = ToDate;
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["EmployeeId"] = EmployeeId;
            e.InputParameters["GradeId"] = GradeId;
            e.InputParameters["DepartmentId"] = DepartmentId;
            e.InputParameters["SectionId"] = SectionId;
        }
    }
}