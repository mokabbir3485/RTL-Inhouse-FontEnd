using System;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_hr_SalarySheetEPZ : System.Web.UI.Page
    {
        public Int32 MonthId = 0;
        public Int32 YearId = 0;
        public Int32 GradeId = 0;
        public string BranchName = "";
        public string UnitName = "";
        public string DepartmentName = "";
        public string Header1 = "";
        public string Header2 = "";
        public string Header3 = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                MonthId = Convert.ToInt32(Request.QueryString["MonthId"]);
                YearId = Convert.ToInt32(Request.QueryString["YearId"]);
                GradeId = Convert.ToInt32(Request.QueryString["GradeId"]);
                BranchName = Request.QueryString["BranchName"];
                UnitName = Request.QueryString["UnitName"];
                DepartmentName = Request.QueryString["DepartmentName"];
                Header1 = Request.QueryString["Header1"];
                Header2 = Request.QueryString["Header2"];
                Header3 = Request.QueryString["Header3"];
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["MonthId"] = MonthId;
            e.InputParameters["YearId"] = YearId;
            e.InputParameters["GradeId"] = GradeId;
            e.InputParameters["BranchName"] = BranchName == "null" ? "0" : BranchName;
            e.InputParameters["UnitName"] = UnitName == "null" ? "0" : UnitName; ;
            e.InputParameters["DepartmentName"] = DepartmentName == "null" ? "0" : DepartmentName;
            e.InputParameters["Header1"] = Header1; //"FSSFB # 7, (Ground Floor East Wing) Dhaka Extension area-Bangladesh";
            e.InputParameters["Header2"] = Header2; //"Salary & Wages Sheet Worker";
            e.InputParameters["Header3"] = Header3; // "For the Month of August,2019";

        }
    }
}