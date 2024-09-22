import React from "react";

const Input = ({ id, type = "text", value, label, handelChange, ...rest}) => {
    return (
        <div className="form-group">
            <label htmlFor="deleteUserID">{language === 'En' ? 'User ID:' : ' الرقم التعريفي الخاص بالمستخدم:'}</label>
            <input type="number" id="deleteUserID" name="deleteUserID" value={formData.userID}
                   onChange={event => setFormData({...formData, userID: parseInt(event.target.value)})}/>
        </div>
    )
}