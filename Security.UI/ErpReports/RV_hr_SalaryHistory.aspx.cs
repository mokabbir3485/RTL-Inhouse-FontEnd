using System;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_hr_SalaryHistory : System.Web.UI.Page
    {
        public int FromMonthYearId, ToMonthYearId, BranchId, GradeId, EmployeeId, DepartmentId, SectionId;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                FromMonthYearId = Convert.ToInt32(Request.QueryString["FromMonthYear"]);
                ToMonthYearId = Convert.ToInt32(Request.QueryString["ToMonthYear"]);
                BranchId = Request.QueryString["BranchId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["BranchId"]);
                GradeId = Request.QueryString["GradeId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["GradeId"]);
                DepartmentId = Request.QueryString["DepartmentId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["DepartmentId"]);
                SectionId = Request.QueryString["SectionId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["SectionId"]);
                EmployeeId = Request.QueryString["EmployeeId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["EmployeeId"]);
            }

        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["FromMonthYearId"] = FromMonthYearId;
            e.InputParameters["ToMonthYearId"] = ToMonthYearId;
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["GradeId"] = GradeId;
            e.InputParameters["DepartmentId"] = DepartmentId;
            e.InputParameters["SectionId"] = SectionId;
            e.InputParameters["EmployeeId"] = EmployeeId;
        }
    }
}