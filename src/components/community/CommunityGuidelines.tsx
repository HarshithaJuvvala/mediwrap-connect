
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const CommunityGuidelines = () => {
  return (
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
  );
};

export default CommunityGuidelines;
