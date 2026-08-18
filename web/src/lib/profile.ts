export type Profile = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export const EMPTY_PROFILE: Profile = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export const PROFILE_STORAGE_KEY = "styleroute_profile";
