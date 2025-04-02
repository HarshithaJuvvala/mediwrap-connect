
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="font-medium">Region</label>
            <Select defaultValue="india">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="font-medium">Currency</label>
            <Select defaultValue="inr">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                <SelectItem value="usd">US Dollar ($)</SelectItem>
                <SelectItem value="gbp">British Pound (£)</SelectItem>
                <SelectItem value="eur">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="font-medium">Default Language</label>
            <Select defaultValue="en-IN">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-IN">English (India)</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="bn">Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="mt-4">Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
