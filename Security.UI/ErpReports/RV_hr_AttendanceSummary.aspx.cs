using System;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_hr_AttendanceSummary : System.Web.UI.Page
    {
        public DateTime FromDate, ToDate;
        public int BranchId, GradeId, EmployeeId,  SectionId;
        public string DepartmentId;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                FromDate = Convert.ToDateTime(Request.QueryString["fdt"]);
                ToDate = Convert.ToDateTime(Request.QueryString["tdt"]);
                BranchId = Convert.ToInt32(Request.QueryString["BranchId"]);
                //EmployeeId = Convert.ToInt32(Request.QueryString["EmployeeId"]);
                EmployeeId = 0;
                GradeId = Request.QueryString["GradeId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["GradeId"]);
                DepartmentId = Request.QueryString["DepartmentId"] == "null" ? "0" : (Request.QueryString["DepartmentId"]);
                SectionId = Request.QueryString["SectionId"] == "null" ? 0 : Convert.ToInt32(Request.QueryString["SectionId"]);
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