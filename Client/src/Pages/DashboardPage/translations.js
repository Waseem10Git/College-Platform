// translations.js
const translations = {
    en: {
        changeColor: 'Change Color',
        deleteChart: 'Delete Chart',
        selectColor: 'Select Color',
        applyColor: 'Apply Color',
        cancel: 'Cancel',
        print: 'Print Charts'
    },
    ar: {
        changeColor: 'تغيير اللون',
        deleteChart: 'حذف الرسم البياني',
        selectColor: 'اختر اللون',
        applyColor: 'تطبيق اللون',
        cancel: 'إلغاء',
        print: 'طباعة الرسوم البيانية'
    }
};

export const getText = (language, key) => {
    return translations[language][key] || key;
};
