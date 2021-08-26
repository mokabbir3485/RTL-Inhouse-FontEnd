using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_inv_InternalWorkOrderByInternalWorkOrderId : System.Web.UI.Page
    {
        public Int32 internalWorkOrderId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    internalWorkOrderId = Convert.ToInt32(Request.QueryString["internalWorkOrderId"]);
                }
                catch (Exception)
                {
                    internalWorkOrderId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["internalWorkOrderId"] = internalWorkOrderId;

        }
    }
}