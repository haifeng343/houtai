
export default
    {
        haveRight: function (rightCode) {
            let isAdministrator = localStorage.getItem("isAdministrator");
            if (isAdministrator == 'true') {
                return true;
            }
            let rightList = localStorage.getItem("accountright");
            if (rightList == null && rightList.length <= 0) {
                return false;
            }
            if (rightList.indexOf(rightCode) != -1) {
                return true;
            }
            return false;
        }
    }