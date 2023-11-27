
//Status User
const pendingApproval = "PENDING_APPROVAL";
const active = "ACTIVE";
const pendingDelete = "PENDING_DELETE";
const inactive = "INACTIVE";
const disabled = "DISABLED";
const expired = "EXPIRED";
const lock = "LOCKED";
const expiredPass = "EXPIRED_PASSWORD";
const userLoggin = sessionStorage.getItem('userId');
const token = sessionStorage.getItem('accessToken');
const idUser = sessionStorage.getItem('id');

module.exports = { pendingApproval, active,pendingDelete,inactive,disabled,expired,lock,userLoggin,token,expiredPass,idUser };