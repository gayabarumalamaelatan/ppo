export const updateMenuData = (menuId,menuName,formCode) => ({
    type: 'UPDATE_MENU_DATA',
    payload: { menuId,menuName,formCode },
  });