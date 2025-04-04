
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TopicsCardProps {
  topics: string[];
  onTopicSelect: (topic: string) => void;
}

const TopicsCard = ({ topics, onTopicSelect }: TopicsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {topics.map((topic, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => onTopicSelect(topic)}
              >
                {topic}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopicsCard;
