"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Lightbulb, CheckCircle, X } from "lucide-react";
import useSWR from 'swr';

interface Skill {
  id: string;
  name: string;
  category?: string;
}

interface SkillsProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Skills({ userId }: SkillsProps) {
    const [editable, setEditable] = useState(false);
    const [skillsData, setSkillsData] = useState<Skill[]>([]);

    const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/skills`,
    fetcher
    );

    // Update local state when data is fetched
    useEffect(() => {
    if (data) {
        setSkillsData(data);
    }
    }, [data]);

    if (isLoading) return <div>Loading skills...</div>;
    if (error) return <div>Error loading skills information</div>;

    return (
    <Card>
        <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Skills</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditable(!editable)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
            </Button>
        </div>
        
        {skillsData && skillsData.length > 0 ? (
            <div className="flex flex-wrap gap-2">
            {skillsData.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                {skill.name}
                </Badge>
            ))}
            </div>
        ) : (
            <div className="text-muted-foreground text-sm">No skills added yet</div>
        )}

        {/* AI Suggestion */}
        <div className="mt-4 p-3 bg-muted rounded-md border border-border">
            <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
                <p className="text-sm font-medium">AI Suggestion:</p>
                <p className="text-sm">
                Consider adding "Next.js" to your skills based on your experience. It's a popular framework that
                would complement your React expertise.
                </p>
                <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Add Skill
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Dismiss
                </Button>
                </div>
            </div>
            </div>
        </div>
        </CardContent>
    </Card>
    );
}
