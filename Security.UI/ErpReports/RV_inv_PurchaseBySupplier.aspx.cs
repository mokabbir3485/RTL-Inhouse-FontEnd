using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_inv_PurchaseBySupplier : System.Web.UI.Page
    {
        public Int32? SupplierId;
        public DateTime FromDate;
        public DateTime ToDate;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    SupplierId = Convert.ToInt32(Request.QueryString["SupplierId"]);

                }
                catch (Exception)
                {
                    SupplierId = null;
                }
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);

                }
                catch (Exception)
                {
                    //
                }
                try
                {
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);

                }
                catch (Exception)
                {
                    //
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["SupplierId"] = SupplierId;
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
        }

       
    }
}