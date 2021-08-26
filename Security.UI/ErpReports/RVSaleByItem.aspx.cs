using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RVSaleByItem : System.Web.UI.Page
    {
        public DateTime FromDate = DateTime.Now;
        public DateTime ToDate = DateTime.Now;
        public string BranchId = string.Empty;
        public string UnitName = string.Empty;
        public Int32? SaleType = 0;
        public Int32? CategoryId = 0;
        public Int32? SubcategoryId = 0;
        public Int32? ItemId = 0;
        public Int32? CustomerTypeId = 0;
        public string CustomerCode = string.Empty;

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
                    BranchId = Convert.ToString(Request.QueryString["BranchId"]);
                }
                catch (Exception)
                {
                    BranchId = null;
                }
                try
                {
                    UnitName = Convert.ToString(Request.QueryString["UnitName"]);
                }
                catch (Exception)
                {
                    UnitName = null;
                }
                try
                {
                    SaleType = Convert.ToInt32(Request.QueryString["SaleType"]);
                }
                catch (Exception)
                {
                    SaleType = null;
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
                try
                {
                    CustomerTypeId = Convert.ToInt32(Request.QueryString["CustomerTypeId"]);
                }
                catch (Exception)
                {
                    CustomerTypeId = null;
                }
                try
                {
                    CustomerCode = Convert.ToString(Request.QueryString["CustomerCode"]);
                    CustomerCode = CustomerCode == "null" ? null : CustomerCode;
                }
                catch (Exception)
                {
                    CustomerCode = null;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["UnitName"] = UnitName;
            e.InputParameters["SaleType"] = SaleType;
            e.InputParameters["CategoryId"] = CategoryId;
            e.InputParameters["SubcategoryId"] = SubcategoryId;
            e.InputParameters["ItemId"] = ItemId;
            e.InputParameters["CustomerTypeId"] = CustomerTypeId;
            e.InputParameters["CustomerCode"] = CustomerCode;
        }
    }
}