import accents from 'remove-accents';

export const getAllDoctors = store => store.doctors.all;

export const getDoctorsByName = (doctors, name) =>
  doctors.filter(doctor => accents.remove(doctor.search_name).toLowerCase().includes(accents.remove(name).toLowerCase()));

export const getDoctorsByAddress = (doctors, name) =>
  doctors.filter(doctor => accents.remove(doctor.search_name).toLowerCase().includes(accents.remove(name).toLowerCase()));
