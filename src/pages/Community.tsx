import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Heart, Share2, MessageCircle, CheckCircle, Search, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';

interface Discussion {
  id: number | string;
  author: string;
  authorType: string;
  avatar: string;
  topic: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  verified: boolean;
  liked?: boolean;
}

const initialDiscussions = [
  {
    id: 1,
    author: "Dr. Sarah Johnson",
    authorType: "Verified Doctor",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Heart Health",
    title: "Understanding Heart Palpitations: When to Worry",
    content: "Many people experience heart palpitations, which can feel like the heart is pounding, fluttering, or skipping a beat. Most of the time, heart palpitations are harmless and are caused by stress, anxiety, caffeine, or exercise. However, in some cases, they can be a sign of a more serious heart condition...",
    date: "2 days ago",
    likes: 45,
    comments: 12,
    verified: true
  },
  {
    id: 2,
    author: "Emily Rodriguez",
    authorType: "Patient",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Mental Health",
    title: "Coping Strategies for Anxiety During Pandemic",
    content: "I've been struggling with anxiety since the pandemic began, and I wanted to share some strategies that have helped me. Firstly, establishing a routine has been crucial. I wake up at the same time every day, have set work hours, and make time for exercise and relaxation...",
    date: "5 days ago",
    likes: 78,
    comments: 23,
    verified: false
  },
  {
    id: 3,
    author: "Dr. Michael Chen",
    authorType: "Verified Doctor",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Sleep Health",
    title: "Improving Your Sleep Quality: Evidence-Based Tips",
    content: "As a neurologist specializing in sleep disorders, I often encounter patients struggling with poor sleep quality. Here are some evidence-based strategies to improve your sleep: Maintain a consistent sleep schedule, create a restful environment, avoid screens before bedtime...",
    date: "1 week ago",
    likes: 112,
    comments: 34,
    verified: true
  },
  {
    id: 4,
    author: "Robert Miller",
    authorType: "Patient",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Chronic Pain",
    title: "Living with Chronic Back Pain: My Journey",
    content: "I've been dealing with chronic back pain for over 10 years now, and I wanted to share my journey and what has helped me. After trying numerous treatments, from physical therapy to medication, I've found that a combination approach works best for me...",
    date: "2 weeks ago",
    likes: 67,
    comments: 29,
    verified: false
  }
];

const healthTopics = [
  "Mental Health",
  "Heart Health",
  "Diabetes",
  "Nutrition",
  "Fitness",
  "Sleep",
  "Women's Health",
  "Men's Health",
  "Pediatrics",
  "Chronic Pain",
  "Cancer",
  "Allergies",
  "Weight Management",
  "Pregnancy",
  "Senior Health"
];

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
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

  const handleSubmitPost = () => {
    if (!postTitle || !postContent || !selectedTopic) {
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
      topic: selectedTopic,
      title: postTitle,
      content: postContent,
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
    setPostTitle("");
    setPostContent("");
    setSelectedTopic("");
  };

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDiscussionCard = (discussion: Discussion) => (
    <Card key={discussion.id}>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Avatar className="mr-2">
              <AvatarImage src={discussion.avatar} />
              <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{discussion.author}</span>
                {discussion.verified && (
                  <CheckCircle className="ml-1 h-4 w-4 text-mediwrap-blue" />
                )}
              </div>
              <div className="text-sm text-gray-500">{discussion.authorType}</div>
            </div>
          </div>
          <span className="text-sm text-gray-500">{discussion.date}</span>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium rounded px-2 py-1">
            {discussion.topic}
          </span>
          <CardTitle className="mt-2">{discussion.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          {discussion.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${discussion.liked ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => handleLike(discussion.id)}
          >
            {discussion.liked ? <ThumbsUp className="mr-1 h-4 w-4 fill-current" /> : <Heart className="mr-1 h-4 w-4" />}
            <span>{discussion.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600 dark:text-gray-400"
            onClick={() => handleComment(discussion.id)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            <span>{discussion.comments}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 dark:text-gray-400"
          onClick={() => handleShare(discussion.id)}
        >
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <div className="bg-gradient-to-br from-mediwrap-orange/10 to-mediwrap-blue/10 dark:from-mediwrap-orange/5 dark:to-mediwrap-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Health Community
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Connect with others, share experiences, and learn from health discussions
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {healthTopics.map((topic, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setSearchTerm(topic)}
                      >
                        {topic}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-mediwrap-green shrink-0" />
                    <span>Be respectful and supportive to others</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-mediwrap-green shrink-0" />
                    <span>Only share medically accurate information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-mediwrap-green shrink-0" />
                    <span>Respect privacy and confidentiality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-mediwrap-green shrink-0" />
                    <span>No promotion of products or services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-mediwrap-green shrink-0" />
                    <span>Medical advice is for discussion only, not a substitute for professional care</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="w-full md:w-auto flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="w-full md:w-auto bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
                onClick={() => setShowNewPost(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start New Discussion
              </Button>
            </div>
            
            <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="discussions">All Discussions</TabsTrigger>
                <TabsTrigger value="doctor-posts">Doctor Posts</TabsTrigger>
                <TabsTrigger value="patient-experiences">Patient Experiences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions" className="space-y-6">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => renderDiscussionCard(discussion))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No discussions found matching your search.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="doctor-posts" className="space-y-6">
                {filteredDiscussions
                  .filter((discussion) => discussion.authorType.includes("Doctor"))
                  .map(discussion => renderDiscussionCard(discussion))}
              </TabsContent>
              
              <TabsContent value="patient-experiences" className="space-y-6">
                {filteredDiscussions
                  .filter((discussion) => discussion.authorType.includes("Patient"))
                  .map(discussion => renderDiscussionCard(discussion))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Start New Discussion</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)}>
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
                    {healthTopics.map((topic, index) => (
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
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <Textarea
                    placeholder="Share your thoughts, questions, or experiences..."
                    className="min-h-[200px]"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
                onClick={handleSubmitPost}
              >
                Post Discussion
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Community;
