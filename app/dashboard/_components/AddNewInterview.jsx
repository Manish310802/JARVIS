"use client";
import { useState, useEffect } from "react";
import { initializeChatSession } from "@/utils/GeminiAIModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { MockInterview } from "@/utils/schema";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatSession, setChatSession] = useState(null);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        const session = initializeChatSession();
        if (!session) {
            console.error("❌ Chat session failed to initialize.");
        } else {
            console.log("✅ Chat session initialized:", session);
            setChatSession(session);
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!chatSession) {
            console.error("❌ chatSession is not initialized.");
            return;
        }

        if (!jobPosition.trim() || !jobDesc.trim() || !jobExperience.trim()) {
            alert("❌ Please fill in all required fields.");
            return;
        }

        setLoading(true);
        console.log("🔹 Submitting:", { jobPosition, jobDesc, jobExperience });

        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. 
        Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format.`;

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const responseText = await result.response.text();

            console.log("🔍 Raw AI Response:", responseText);

            // Extract JSON content safely
            const jsonStart = responseText.indexOf("[");
            const jsonEnd = responseText.lastIndexOf("]");

            if (jsonStart === -1 || jsonEnd === -1) {
                console.error("❌ No JSON array found in response:", responseText);
                alert("Invalid AI response. No JSON array detected.");
                setLoading(false);
                return;
            }

            let jsonStr = responseText.slice(jsonStart, jsonEnd + 1);
            jsonStr = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, ""); // Remove control characters

            console.log("🔍 Extracted JSON String:", jsonStr);

            let parsedJson;
            try {
                parsedJson = JSON.parse(jsonStr);
                if (!Array.isArray(parsedJson)) {
                    throw new Error("Expected an array but received an object.");
                }
            } catch (parseError) {
                console.error("❌ JSON Parse Error:", parseError);
                alert("Failed to parse AI response. Please try again.");
                setLoading(false);
                return;
            }

            console.log("🎯 Parsed AI Response (Array):", parsedJson);

            // 🔥 Generate UUID before insertion
            const interviewId = uuidv4();
            console.log("🆔 Generated Interview ID:", interviewId);

            // Insert data into database
            const [resp] = await db.insert(MockInterview)
                .values({
                    mockId: interviewId,
                    jsonMockResp: JSON.stringify({ interview_questions: parsedJson }), // Wrap AI response in expected key
                    jobPosition,
                    jobDesc,
                    jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown",
                    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                .returning({ mockId: MockInterview.mockId });

            console.log("🚀 Insert Query Response:", resp);

            if (!resp || !resp.mockId) {
                console.error("❌ Interview creation failed. Response:", resp);
                alert("Interview creation failed. Please try again.");
                setLoading(false);
                return;
            }

            console.log("✅ Interview Created Successfully! ID:", resp.mockId);

            setOpenDialog(false);
            console.log("🔗 Redirecting to:", `/dashboard/interview/${resp.mockId}`);
            router.push(`/dashboard/interview/${resp.mockId}`);

        } catch (error) {
            console.error("❌ Error in AI Response Handling:", error);
            alert("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <button className="w-full" onClick={() => setOpenDialog(true)}>
                        <h2 className="text-lg text-center">+ Add New</h2>
                    </button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
                    </DialogHeader>

                    <div>
                        <form onSubmit={onSubmit}>
                            <div className="mt-7 my-2">
                                <label>Job Role/Position</label>
                                <Input
                                    placeholder="Ex. Full Stack Developer"
                                    required
                                    value={jobPosition}
                                    onChange={(event) => setJobPosition(event.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <label>Job Description/Tech Stack (In Short)</label>
                                <Textarea
                                    placeholder="Ex. React, Angular, NodeJs, MySQL etc"
                                    required
                                    value={jobDesc}
                                    onChange={(event) => setJobDesc(event.target.value)}
                                />
                            </div>
                            <div className="my-3">
                                <label>Years of Experience</label>
                                <Input
                                    placeholder="Ex. 5"
                                    type="number"
                                    min="0"
                                    max="100"
                                    required
                                    value={jobExperience}
                                    onChange={(event) => setJobExperience(event.target.value)}
                                />
                            </div>

                            <div className="flex gap-5 justify-end mt-4">
                                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <><LoaderCircle className="animate-spin" /> Initializing Interview...</> : "Start Interview"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
