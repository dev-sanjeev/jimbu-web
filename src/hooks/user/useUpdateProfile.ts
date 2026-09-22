import {
  UpdateProfilePayload,
  UpdatedProfile,
  userService,
} from "@/services/user.service";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<UpdatedProfile, Error, UpdateProfilePayload>({
    mutationFn: userService.updateMe,
    onSuccess: (updated) => {
      setUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
      });
    },
  });
};
