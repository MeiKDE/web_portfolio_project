//directive is used in Next.js to indicate that the component should be rendered on the client side.  This is important for components that rely on client-side features like hooks (useState, useEffect) or any browser-specific APIs. It ensures that the component is not pre-rendered on the server, which is crucial for components that need to interact with the browser environment or manage state dynamically.
"use client"  

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Briefcase,
    Edit,
    Lightbulb,
    CheckCircle,
    RefreshCw,
    X,
} from "lucide-react";
import useSWR from 'swr';

interface Experience {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    description: string;
}

//Defines the props for the Experience component, which includes a userId.
interface ExperienceProps {
    userId: string;
}

//A utility function fetcher is defined to fetch data from a given URL and parse it as JSON.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

//The Experience component is defined as a functional component that takes userId as a prop.
export default function Experience({ userId }: ExperienceProps) {
    // A state variable error is initialized to null.
    const [localError, setLocalError] = useState<string | null>(null);
    const [experienceData, setExperienceData] = useState<Experience[]>([]);

    //The useSWR hook is used to fetch the experiences data from the API.
    const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/experiences`,
    fetcher
    );

    // Update local state when data is fetched
    useEffect(() => {
        if (data) {
            setExperienceData(data);
        }
    }, [data]);

    if (isLoading) return <div>Loading experiences...</div>;
    if (error) return <div>Error loading experiences: {error.message}</div>;
    if (localError) return <div>Error: {localError}</div>;

    return (
    <Card>
        <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Experience
            </h3>
            <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
            </Button>
        </div>

        {experienceData && experienceData.length > 0 ? (
            experienceData.map((experience: Experience, index: number) => (
            <div 
                key={experience.id} 
                className={`mb-6 ${index < experienceData.length - 1 ? 'border-b pb-6' : ''}`}
            >
                <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                    <AvatarFallback>{experience.company.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-grow">
                    <h4 className="font-semibold">{experience.title}</h4>
                    <p className="text-muted-foreground">{experience.company}</p>
                    <p className="text-sm text-muted-foreground">
                    {experience.startDate} - {experience.endDate || 'Present'}
                    </p>
                    <p className="mt-2">{experience.description}</p>

                    {/* AI Suggestion for the first item as an example */}
                    {index === 0 && (
                    <div className="mt-3 p-3 bg-muted rounded-md border border-border">
                        <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-grow">
                            <p className="text-sm font-medium">AI Suggestion:</p>
                            <p className="text-sm">
                            Replace "Led development" with a stronger action verb like "Spearheaded" or "Architected" to
                            showcase leadership.
                            </p>
                            <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Regenerate
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                <X className="h-3 w-3 mr-1" />
                                Dismiss
                            </Button>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            ))
        ) : (
            <div className="text-center py-4 text-muted-foreground">
            No experience entries found. Add your work history to complete your profile.
            </div>
        )}
        </CardContent>
    </Card>
    );
} 