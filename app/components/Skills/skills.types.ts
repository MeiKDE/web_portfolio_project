export interface Skill {
  id: string;
  name: string;
  proficiencyLevel: number;
  category: string;
  userId: string;
  changed?: boolean;
}
