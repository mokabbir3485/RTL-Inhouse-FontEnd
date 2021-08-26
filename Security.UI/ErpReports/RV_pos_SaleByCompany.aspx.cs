using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_pos_SaleByCompany : System.Web.UI.Page
    {
        public Int32? CompanyId;
        public DateTime FromDate;
        public DateTime ToDate;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    CompanyId = Convert.ToInt32(Request.QueryString["CompanyId"]);

                }
                catch (Exception)
                {
                    CompanyId = null;
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
            e.InputParameters["CompanyId"] = CompanyId;
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
        }

    }
}