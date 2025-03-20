"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIBioGenerator } from "./ai-bio-generator";
import { AIPreferences } from "./ai-preferences";
//import { getUserData } from "@/lib/user-data"

interface AIAssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistantDialog({ isOpen, onClose }: AIAssistantDialogProps) {
  const [activeTab, setActiveTab] = useState("preferences");
  const [userData, setUserData] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    careerGoals: "",
    personalityTraits: "",
    workStyle: "",
  });
  const [generatedBio, setGeneratedBio] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getUserData()
  //     setUserData(data)
  //   }

  //   if (isOpen) {
  //     fetchData()
  //   }
  // }, [isOpen])

  const handleGenerate = async () => {
    if (!userData) return;

    setIsGenerating(true);

    // This would be replaced with your actual AI generation logic
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const yearsOfExperience = calculateYearsOfExperience(userData.experience);
      const skills = userData.skills.join(", ");
      const industries = [
        ...new Set(userData.experience.map((exp: any) => exp.industry)),
      ].join(", ");

      // Example generated bio
      const bio = `As a data storyteller and insights-driven professional, I bring ${yearsOfExperience} years of experience in uncovering patterns that drive business success. My expertise in ${skills} has led to a 40% improvement in operational efficiency for my clients. I excel in bridging the gap between data and strategy—translating complex findings into actionable insights for executives and teams. ${preferences.personalityTraits} ${preferences.careerGoals} ${preferences.workStyle} Let's connect and turn data into impact!`;

      setGeneratedBio(bio);
      setActiveTab("result");
    } catch (error) {
      console.error("Error generating bio:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    // This would be replaced with your actual save logic
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Close the dialog after saving
      onClose();

      // You would typically refresh the page or update the state here
    } catch (error) {
      console.error("Error saving bio:", error);
    }
  };

  const calculateYearsOfExperience = (experience: any[]) => {
    if (!experience || experience.length === 0) return 0;

    let totalYears = 0;
    experience.forEach((exp) => {
      const years = exp.years.split("-");
      const startYear = Number.parseInt(years[0]);
      const endYear =
        years[1] === "Present"
          ? new Date().getFullYear()
          : Number.parseInt(years[1]);
      totalYears += endYear - startYear;
    });

    return totalYears;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Bio Assistant</DialogTitle>
          <DialogDescription>
            Let AI help you create a compelling professional bio that highlights
            your strengths and experience.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences">
            <AIPreferences
              preferences={preferences}
              setPreferences={setPreferences}
              onNext={() => setActiveTab("result")}
            />
          </TabsContent>

          <TabsContent value="result">
            <AIBioGenerator
              generatedBio={generatedBio}
              onRegenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === "result" && generatedBio && (
            <Button onClick={handleSave}>Save Bio</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
