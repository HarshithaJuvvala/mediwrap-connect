
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Share2, ThumbsUp, Heart, CheckCircle } from "lucide-react";
import { Discussion } from "@/types/community";
import { useToast } from "@/components/ui/use-toast";

interface DiscussionCardProps {
  discussion: Discussion;
  onLike: (id: number | string) => void;
  onComment: (id: number | string) => void;
  onShare: (id: number | string) => void;
}

const DiscussionCard = ({ discussion, onLike, onComment, onShare }: DiscussionCardProps) => {
  const { toast } = useToast();
  
  return (
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
            onClick={() => onLike(discussion.id)}
          >
            {discussion.liked ? <ThumbsUp className="mr-1 h-4 w-4 fill-current" /> : <Heart className="mr-1 h-4 w-4" />}
            <span>{discussion.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600 dark:text-gray-400"
            onClick={() => onComment(discussion.id)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            <span>{discussion.comments}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 dark:text-gray-400"
          onClick={() => onShare(discussion.id)}
        >
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DiscussionCard;
