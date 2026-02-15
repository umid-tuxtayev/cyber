import { useMutation } from "@tanstack/react-query";
import { authLogin } from "../services/authApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: authLogin,
  });
};
