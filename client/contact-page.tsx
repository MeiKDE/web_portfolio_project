"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Globe, Mail, Phone, Calendar, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [contactType, setContactType] = useState("")
  const [message, setMessage] = useState("")

  const handleContactTypeChange = (value: string) => {
    setContactType(value)
    // AI-suggested message templates
    switch (value) {
      case "recruiter":
        setMessage("I'm interested in discussing a potential job opportunity with you...")
        break
      case "client":
        setMessage("I have a project I'd like to discuss with you...")
        break
      case "collaborator":
        setMessage("I'm working on a project that I think would benefit from your expertise...")
        break
      default:
        setMessage("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardContent className="p-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactType">I am a...</Label>
                <Select onValueChange={handleContactTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="collaborator">Collaborator</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Availability Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Open for Freelance</Badge>
                <Badge variant="secondary">Open for Full-time</Badge>
                <Badge variant="secondary">Open for Collaborations</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Connect with Me</h2>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center text-primary hover:underline">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <Twitter className="h-5 w-5 mr-2" />
                  Twitter
                </a>
                <a href="#" className="flex items-center text-primary hover:underline">
                  <Globe className="h-5 w-5 mr-2" />
                  Website
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Email & Phone */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contact[at]example[dot]com</span>
                </p>
                <p className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </p>
                <p className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <a href="#" className="text-primary hover:underline">
                    Schedule a call (Calendly)
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Contact Button */}
      <motion.div
        className="fixed bottom-4 right-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button size="lg" className="rounded-full h-16 w-16">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  )
}

