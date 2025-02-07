import {useContext, useState} from "react";
import UserContext from "../../context/UserContext";
import deleteDataApi from "../../api/deleteDataApi";
import {toast} from "react-toastify";
import './AdminCourses.css';

const DeleteData = () => {
    const { language } = useContext(UserContext);
    const [confirmDeletion, setConfirmDeletion] = useState(false);

    const handleDeleteTablesData = async () => {
        await deleteDataApi.deleteDataTables()
            .then(res => {
                if (res.data.success) {
                    toast.success(language === 'En' ? 'Tables data deleted successfully' : 'تم حذف بيانات الجداول بنجاح');
                    setConfirmDeletion(false);
                } else {
                    toast.error(language === 'En' ? 'Tables data deletion failed' : 'فشل في حذف بيانات الجداول');
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(language === 'En' ? 'Failed' : 'فشل');
            });
    }

  return (
      <div className={'DeleteData_courses_Container'}>
          {confirmDeletion ? (
              <>
                  <h3 id={'DeleteData_courses_confirmDeleteHeader'}>{language === 'En' ? 'Confirm Delete Tables Data' : 'تأكيد حذف بيانات الجداول'}</h3>
                  <div id={'DeleteData_courses_confirmDeleteContainer'}>
                      <button id={'DeleteData_courses_deleteButton'} className={'AdminCourses_view-button'} type={'button'}
                              onClick={handleDeleteTablesData}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                      <button id={'DeleteData_courses_cancelButton'} className={'AdminCourses_view-button'} type={'button'}
                              onClick={() => setConfirmDeletion(false)}>{language === 'En' ? 'Cancel' : 'إلغاء'}</button>
                  </div>
              </>
          ) : (
              <button id={'DeleteData_courses_confirmDeleteButton'} className={'AdminCourses_view-button'} type={"button"}
                      onClick={() => setConfirmDeletion(true)}>{language === 'En' ? 'Delete Tables Data' : 'حذف بيانات الجداول'}</button>
          )}
      </div>
  );
}

export default DeleteData;