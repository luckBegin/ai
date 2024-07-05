import axios from 'axios';

import { UserCreate, UserRead, UserReadAdmin, UserSettingSchema, UserUpdate, UserUpdateAdmin } from '@/types/schema';

import ApiUrl from './url';

export type LoginData = {
  username: string;
  password: string;
};

export function getCode(data: any) {
  return axios.post('http://47.92.249.48:8099/api/auth/code', data )
}

export function userLogin(data: any) {
  return axios.post('http://47.92.249.48:8099/api/auth/smslogin', data )
}
export function getModel(data: any) {
  return axios.get('http://47.92.249.48:8099/api/auth/model')
}

export function sendMsga (data:any) {
  return axios.post('http://47.92.249.48:8099/api/Chat/SendMessage', data )
}

export function getHistory( data: any ) {
  return axios.get('http://47.92.249.48:8099/api/Conversation/Historys', data)
}

export function getMsgDetail( data: any ) {
  return axios.get('http://47.92.249.48:8099/api/Conversation/Get?id=' +  data)
}
export function loginApi(data: LoginData) {
  const formData = new FormData();
  formData.set('username', data.username);
  formData.set('password', data.password);
  return axios.post<any>(ApiUrl.Login, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function registerApi(userInfo: UserCreate) {
  return axios.post<UserRead>(ApiUrl.Register, userInfo);
}

export function logoutApi() {
  return axios.post<any>(ApiUrl.Logout);
}

export function getAllUserApi() {
  return axios.get<UserRead[]>(ApiUrl.UserList);
}

export function getUserMeApi() {
  return axios.get<UserRead>(ApiUrl.UserMe);
}

export function updateUserMeApi(userUpdate: Partial<UserUpdate>) {
  return axios.patch<UserRead>(ApiUrl.UserMe, userUpdate);
}

export function getUserByIdApi(userId: number) {
  return axios.get<UserReadAdmin>(ApiUrl.UserList + `/${userId}`);
}

export function updateUserByIdApi(userId: number, userUpdateAdmin: Partial<UserUpdateAdmin>) {
  return axios.patch<UserReadAdmin>(ApiUrl.UserList + `/${userId}`, userUpdateAdmin);
}

export function deleteUserApi(user_id: number) {
  return axios.delete(ApiUrl.UserList + `/${user_id}`);
}

export function updateUserSettingApi(userId: number, userSetting: Partial<UserSettingSchema>) {
  return axios.patch<UserReadAdmin>(ApiUrl.UserList + `/${userId}/setting`, userSetting);
}
