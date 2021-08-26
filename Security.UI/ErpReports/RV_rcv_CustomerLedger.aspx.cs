using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_rcv_CustomerLedger : System.Web.UI.Page
    {
        public DateTime FromDate, ToDate;
        public Nullable<int> CompanyId { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                }
                catch (Exception)
                {
                    //ignored
                }
                try
                {
                    CompanyId = Convert.ToInt32(Request.QueryString["CompanyId"]);
                }
                catch (Exception)
                {
                    CompanyId = null;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["fdt"] = FromDate;
            e.InputParameters["tdt"] = ToDate;
            e.InputParameters["CompanyId"] = CompanyId;
        }
    }
}