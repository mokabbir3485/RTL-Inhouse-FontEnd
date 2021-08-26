using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RVPurchaseBillByDate : System.Web.UI.Page
    {
        public DateTime FromDate = DateTime.Now;
        public DateTime ToDate = DateTime.Now;
        public Int32? CategoryId = 0;
        public Int32? SubcategoryId = 0;
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
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
            e.InputParameters["CategoryId"] = CategoryId;
            e.InputParameters["SubcategoryId"] = SubcategoryId;
        }
    }
}