// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { Lightbulb } from "lucide-react";
// import { Skill } from "../Interface";
// import { useState } from "react";

// export function SkillList({
//   editedData,
//   isEditing,
//   SkillInputChange,
//   handleInputChange,
//   DeleteSkill,
//   handleDeleteItem,
//   mutate,
// }: {
//   editedData: Skill[];
//   isEditing: boolean;
//   SkillInputChange: (
//     id: string,
//     field: string,
//     value: any,
//     handleInputChange: (field: string, value: any) => void
//   ) => void;
//   handleInputChange: (field: string, value: any) => void;
//   DeleteSkill: (
//     id: string,
//     handleDeleteItem: (id: string) => Promise<void>,
//     mutate: () => Promise<any>
//   ) => Promise<void>;
//   handleDeleteItem: (id: string) => Promise<void>;
//   mutate: () => Promise<any>;
// }) {
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);

//   const onDeleteClick = async (skillId: string) => {
//     try {
//       console.log("Initiating delete for skill:", skillId);
//       setIsDeleting(skillId);
//       await DeleteSkill(skillId, handleDeleteItem, mutate);
//       await mutate();
//     } catch (error) {
//       console.error("Error in onDeleteClick:", error);
//       alert("Failed to delete skill. Please try again.");
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {editedData.map((skill: Skill) => (
//         <div key={skill.id} className="relative border-b pb-4 last:border-0">
//           {/* Skill content - editable or readonly */}
//           {isEditing ? (
//             <div className="flex gap-2">
//               <div className="w-full">
//                 <Input
//                   type="text"
//                   value={skill.name}
//                   onChange={(e) =>
//                     SkillInputChange(
//                       skill.id,
//                       "name",
//                       e.target.value,
//                       handleInputChange
//                     )
//                   }
//                   className={`font-medium mb-2 ${
//                     !skill.name ? "border-red-500" : ""
//                   }`}
//                   placeholder="Skill Name *"
//                   required
//                 />
//                 <Input
//                   type="text"
//                   value={skill.category}
//                   onChange={(e) =>
//                     SkillInputChange(
//                       skill.id,
//                       "category",
//                       e.target.value,
//                       handleInputChange
//                     )
//                   }
//                   className={`text-sm mb-2 ${
//                     !skill.category ? "border-red-500" : ""
//                   }`}
//                   placeholder="Category *"
//                   required
//                 />
//                 <Input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={skill.proficiencyLevel}
//                   onChange={(e) =>
//                     SkillInputChange(
//                       skill.id,
//                       "proficiencyLevel",
//                       parseInt(e.target.value),
//                       handleInputChange
//                     )
//                   }
//                   className={`text-sm ${
//                     !skill.proficiencyLevel ||
//                     skill.proficiencyLevel < 1 ||
//                     skill.proficiencyLevel > 10
//                       ? "border-red-500"
//                       : ""
//                   }`}
//                   placeholder="Proficiency Level (1-10) *"
//                   required
//                 />
//               </div>
//               <div className="flex items-start">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => onDeleteClick(skill.id)}
//                   className="h-8 w-8 text-red-500"
//                   disabled={isDeleting === skill.id}
//                 >
//                   {isDeleting === skill.id ? (
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
//                   ) : (
//                     <X className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-medium">{skill.name}</h4>
//                 <p className="text-sm text-muted-foreground">
//                   {skill.category}
//                 </p>
//                 <div className="flex mt-1">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Lightbulb
//                       key={i}
//                       className={`h-4 w-4 mr-1 ${
//                         i < skill.proficiencyLevel
//                           ? "text-yellow-500 fill-yellow-500"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Skill } from "../Interface";
import { useState } from "react";

interface SkillListProps {
  editedData: Skill[];
}

export function SkillList({ editedData }: SkillListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<Skill[]>(editedData);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Internal implementation of required functions
  const handleInputChange = (field: string, value: any) => {
    console.log(`Change ${field} to ${value}`);
  };

  const SkillInputChange = (
    id: string,
    field: string,
    value: any,
    handleInputChange: (field: string, value: any) => void
  ) => {
    handleInputChange(field, value);

    // Update local data
    setLocalData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = async (id: string) => {
    try {
      // Update local state
      setLocalData((prev) => prev.filter((skill) => skill.id !== id));
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting item:", error);
      return Promise.reject(error);
    }
  };

  const DeleteSkill = async (
    id: string,
    handleDeleteItem: (id: string) => Promise<void>,
    mutate: () => Promise<any>
  ) => {
    try {
      await handleDeleteItem(id);
      // We don't actually call mutate here since this is local
      return Promise.resolve();
    } catch (error) {
      console.error("Error in DeleteSkill:", error);
      return Promise.reject(error);
    }
  };

  const mutate = async () => {
    // Mock implementation of mutate
    return Promise.resolve();
  };

  const onDeleteClick = async (skillId: string) => {
    try {
      setIsDeleting(skillId);
      await DeleteSkill(skillId, handleDeleteItem, mutate);
    } catch (error) {
      console.error("Error in onDeleteClick:", error);
      alert("Failed to delete skill. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {localData.map((skill: Skill) => (
        <div key={skill.id} className="relative border-b pb-4 last:border-0">
          {/* Skill content - editable or readonly */}
          {isEditing ? (
            <div className="flex gap-2">
              <div className="w-full">
                <Input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    SkillInputChange(
                      skill.id,
                      "name",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className={`font-medium mb-2 ${
                    !skill.name ? "border-red-500" : ""
                  }`}
                  placeholder="Skill Name *"
                  required
                />
                <Input
                  type="text"
                  value={skill.category}
                  onChange={(e) =>
                    SkillInputChange(
                      skill.id,
                      "category",
                      e.target.value,
                      handleInputChange
                    )
                  }
                  className={`text-sm mb-2 ${
                    !skill.category ? "border-red-500" : ""
                  }`}
                  placeholder="Category *"
                  required
                />
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={skill.proficiencyLevel}
                  onChange={(e) =>
                    SkillInputChange(
                      skill.id,
                      "proficiencyLevel",
                      parseInt(e.target.value),
                      handleInputChange
                    )
                  }
                  className={`text-sm ${
                    !skill.proficiencyLevel ||
                    skill.proficiencyLevel < 1 ||
                    skill.proficiencyLevel > 10
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Proficiency Level (1-10) *"
                  required
                />
              </div>
              <div className="flex items-start">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClick(skill.id)}
                  className="h-8 w-8 text-red-500"
                  disabled={isDeleting === skill.id}
                >
                  {isDeleting === skill.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{skill.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {skill.category}
                </p>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Lightbulb
                      key={i}
                      className={`h-4 w-4 mr-1 ${
                        i < skill.proficiencyLevel
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
