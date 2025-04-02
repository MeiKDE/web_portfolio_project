// import { Skill } from "@/app/components/Skills/skills.types";
// import { useState, useEffect } from "react";
// import { SkillItem } from "@/app/components/Skills/List/SkillItem";
// import React, { JSX } from "react";
// import { SkillForm } from "@/app/components/Skills/List/SkillForm";

// interface SkillListProps {
//   skillsData: Skill[];
//   isEditingMode: boolean;
//   mutate: () => Promise<any>;
//   userId: string;
//   onDeleteSkillList: (id: string) => void;
//   formData: Skill[];
//   onFormChange: (id: string, field: string, value: string) => void;
// }

// export function SkillList({
//   skillsData,
//   isEditingMode,
//   mutate,
//   userId,
//   onDeleteSkillList,
//   formData,
//   onFormChange,
// }: SkillListProps) {
//   const onDeleteClick = (id: string) => {
//     console.log(id);
//     setIsDeleting(id);
//     mutate(); // Refetch the data
//   };

//   const [isDeleting, setIsDeleting] = useState<string | null>(null);

//   return (
//     <div className="space-y-4">
//       {/* Display the list of skills */}
//       {skillsData.map((skill: Skill) => (
//         <div key={skill.id} className="relative border-b pb-4 last:border-0">
//           <SkillItem skill={skill} />
//         </div>
//       ))}
//       {formData.map((skill: Skill) => {
//         return (
//           <div key={skill.id}>
//             <SkillForm
//               onFormChange={onFormChange}
//               skill={skill}
//               onDeleteClick={onDeleteSkillList}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }
