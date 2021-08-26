using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_inv_StockBySerialNo : System.Web.UI.Page
    {
        public Int32? BranchId = 0;
        public Int32? DepartmentId = 0;
        public Int32? ItemId = 0;
        public string Value ="";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
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
                    ItemId = Convert.ToInt32(Request.QueryString["ItemId"]);
                }
                catch (Exception)
                {
                    ItemId = null;
                }
                try
                {
                    Value = Request.QueryString["Value"];
                    if (String.IsNullOrEmpty(Value) || Value == "null")
                    {
                        Value = null;
                    }
                }
                catch (Exception)
                {
                    Value = null;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {          
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["DepartmentId"] = DepartmentId;
            e.InputParameters["ItemId"] = ItemId;
            e.InputParameters["Value"] = Value;
        }
    }
}