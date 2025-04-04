
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Discussion, NewPostFormData } from "@/types/community";
import { initialDiscussions } from "@/data/initialDiscussions";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useCommunity = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discussions");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLike = (postId: number | string) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === postId) {
        const wasLiked = discussion.liked;
        return {
          ...discussion,
          likes: wasLiked ? discussion.likes - 1 : discussion.likes + 1,
          liked: !wasLiked
        };
      }
      return discussion;
    }));
    
    toast({
      title: "Post Liked",
      description: "You've liked this discussion post.",
    });
  };

  const handleComment = (postId: number | string) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === postId) {
        return {
          ...discussion,
          showComments: true
        };
      }
      return discussion;
    }));
    
    toast({
      title: "Add Comment",
      description: "Comment functionality would be implemented here.",
    });
  };

  const handleShare = (postId: number | string) => {
    navigator.clipboard.writeText(`https://example.com/community/post/${postId}`).then(() => {
      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard. Ready to share!",
      });
    });
  };

  const handleSubmitPost = (formData: NewPostFormData) => {
    if (!formData.title || !formData.content || !formData.topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before posting.",
        variant: "destructive",
      });
      return;
    }
    
    const newDiscussion: Discussion = {
      id: uuidv4(),
      author: user?.name || "Anonymous User",
      authorType: user?.role === "doctor" ? "Verified Doctor" : "Patient",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      topic: formData.topic,
      title: formData.title,
      content: formData.content,
      date: "Just now",
      likes: 0,
      comments: 0,
      verified: user?.role === "doctor",
    };
    
    setDiscussions([newDiscussion, ...discussions]);
    
    toast({
      title: "Post Submitted",
      description: "Your discussion post has been submitted successfully.",
    });
    
    setShowNewPost(false);
  };

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    discussions: filteredDiscussions,
    showNewPost,
    searchTerm,
    activeTab,
    handleLike,
    handleComment,
    handleShare,
    handleSubmitPost,
    setShowNewPost,
    setSearchTerm,
    setActiveTab,
    getFilteredByType: (type: string) => {
      if (type === "doctor-posts") {
        return filteredDiscussions.filter((d) => d.authorType.includes("Doctor"));
      } else if (type === "patient-experiences") {
        return filteredDiscussions.filter((d) => d.authorType.includes("Patient"));
      }
      return filteredDiscussions;
    },
  };
};
