import { userService, } from "@/services/user.service";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
export const useUpdateProfile = () => {
    const setUser = useAuthStore((s) => s.setUser);
    return useMutation({
        mutationFn: userService.updateMe,
        onSuccess: (updated) => {
            setUser({
                firstName: updated.firstName,
                lastName: updated.lastName,
            });
        },
    });
};
