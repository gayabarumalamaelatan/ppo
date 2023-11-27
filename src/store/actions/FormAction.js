export const updateFormData = (idForm, prefixTable,menuName,formCode) => ({
    type: 'UPDATE_FORM_DATA',
    payload: { idForm, prefixTable,menuName,formCode },
  });