using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RVReceiveByDate : System.Web.UI.Page
    {
        public DateTime FromDate = DateTime.Now;
        public DateTime ToDate = DateTime.Now;
        public Int32? BranchId = 0;
        public Int32? DepartmentId = 0;
        public Int32? CategoryId = 0;
        public Int32? SubcategoryId = 0;
        public Int32? ItemId = 0;
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
                    CategoryId = Convert.ToInt32(Request.QueryString["CategoryId"]);
                }
                catch (Exception)
                {
                    CategoryId = null;
                }
                try
                {
                    SubcategoryId = Convert.ToInt32(Request.QueryString["SubcategoryId"]);
                }
                catch (Exception)
                {
                    SubcategoryId = null;
                }

                try
                {
                    ItemId = Convert.ToInt32(Request.QueryString["ItemId"]);
                }
                catch (Exception)
                {
                    ItemId = null;
                }
            }
        }

        protected void ObjectDataSource1_Selecting1(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["DepartmentId"] = DepartmentId;
            e.InputParameters["CategoryId"] = CategoryId;
            e.InputParameters["SubcategoryId"] = SubcategoryId;
            e.InputParameters["ItemId"] = ItemId;
        }
    }
}