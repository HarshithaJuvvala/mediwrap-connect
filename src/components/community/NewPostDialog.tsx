
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NewPostFormData } from "@/types/community";

interface NewPostDialogProps {
  isOpen: boolean;
  topics: string[];
  onClose: () => void;
  onSubmit: (data: NewPostFormData) => void;
}

const NewPostDialog = ({ isOpen, topics, onClose, onSubmit }: NewPostDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      title,
      content,
      topic: selectedTopic
    });

    // Reset form
    setTitle("");
    setContent("");
    setSelectedTopic("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Start New Discussion</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              &times;
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic
              </label>
              <select 
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">Select a topic...</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <Input
                placeholder="Enter discussion title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <Textarea
                placeholder="Share your thoughts, questions, or experiences..."
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
            onClick={handleSubmit}
          >
            Post Discussion
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewPostDialog;
