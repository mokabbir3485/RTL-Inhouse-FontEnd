using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RVRole : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ObjectDataSource1_Selecting1(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["RoleId"] = null;
        }
    }
}