import { DynamicForm } from "@/app/components/common/DynamicForm";
import { profileFormConfig } from "@/app/config/form-configs";
import { Profile } from "@/app/components/Profile/profile.types";

interface ProfileFormProps {
  profile: Profile;
  onDeleteClick?: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
}

export const ProfileForm = ({
  profile,
  onDeleteClick,
  onFormChange,
}: ProfileFormProps) => {
  const config = {
    ...profileFormConfig,
    onDelete: onDeleteClick,
    onFormChange,
  };

  return <DynamicForm data={profile} config={config} />;
};
