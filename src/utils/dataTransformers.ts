import { BusinessCard, CardData, ChurchCard, GroupCard, SchoolCard } from "./customTypes";

export const transformBusinessData = (data: BusinessCard[]): CardData[] => {
  return data.map(business => ({
    id: business.business_id.toString(),
    name: business.business_name,
    img: business.business_img,
    bio: business.business_bio,
  }));
};

export const transformChurchData = (data: ChurchCard[]): CardData[] => {
  return data.map(church => ({
    id: church.church_id.toString(),
    name: church.church_name,
    img: church.church_img,
    bio: church.church_bio,
  }));
};

export const transformSchoolData = (data: SchoolCard[]): CardData[] => {
  return data.map(school => ({
    id: school.school_id.toString(),
    name: school.school_name,
    img: school.school_img,
    bio: school.school_bio,
  }));
};

export const transformGroupData = (data: GroupCard[]): CardData[] => {
  return data.map(group => ({
    id: group.group_id.toString(),
    name: group.group_name,
    img: group.group_img,
    bio: group.group_bio,
  }));
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} '${String(year).slice(-2)}`;
}