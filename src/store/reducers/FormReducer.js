// redux/reducers.js
const initialState = {
    idForm: '',
    prefixTable: '',
    menuName:'',
    formCode:'',
  };
  
  const formDataReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_FORM_DATA':
        return {
          ...state,
          idForm: action.payload.idForm,
          prefixTable: action.payload.prefixTable,
          menuName: action.payload.menuName,
          formCode: action.payload.formCode,
        };
      default:
        return state;
    }
  };
  
  export default formDataReducer;
  