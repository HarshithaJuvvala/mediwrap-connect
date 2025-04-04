
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionCard from "@/components/community/DiscussionCard";
import TopicsCard from "@/components/community/TopicsCard";
import CommunityGuidelines from "@/components/community/CommunityGuidelines";
import SearchBar from "@/components/community/SearchBar";
import NewPostDialog from "@/components/community/NewPostDialog";
import { useCommunity } from "@/hooks/useCommunity";
import { healthTopics } from "@/data/healthTopics";

const Community = () => {
  const { 
    discussions, 
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
    getFilteredByType
  } = useCommunity();

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
            <TopicsCard 
              topics={healthTopics} 
              onTopicSelect={setSearchTerm} 
            />
            <CommunityGuidelines />
          </div>
          
          <div className="md:w-3/4">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNewPost={() => setShowNewPost(true)}
            />
            
            <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="discussions">All Discussions</TabsTrigger>
                <TabsTrigger value="doctor-posts">Doctor Posts</TabsTrigger>
                <TabsTrigger value="patient-experiences">Patient Experiences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions" className="space-y-6">
                {discussions.length > 0 ? (
                  discussions.map(discussion => (
                    <DiscussionCard 
                      key={discussion.id}
                      discussion={discussion}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No discussions found matching your search.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="doctor-posts" className="space-y-6">
                {getFilteredByType("doctor-posts").map(discussion => (
                  <DiscussionCard 
                    key={discussion.id}
                    discussion={discussion}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="patient-experiences" className="space-y-6">
                {getFilteredByType("patient-experiences").map(discussion => (
                  <DiscussionCard 
                    key={discussion.id}
                    discussion={discussion}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <NewPostDialog 
        isOpen={showNewPost}
        topics={healthTopics}
        onClose={() => setShowNewPost(false)}
        onSubmit={handleSubmitPost}
      />
    </Layout>
  );
};

export default Community;
