using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_exp_ExpNoReqApplication : System.Web.UI.Page
    {
        public Int64 PaymentProcessId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    PaymentProcessId = Convert.ToInt32(Request.QueryString["PaymentProcessId"]);
                }
                catch (Exception)
                {
                    PaymentProcessId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["PaymentProcessId"] = PaymentProcessId;
        }
    }
}