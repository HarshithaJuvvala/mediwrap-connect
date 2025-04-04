
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  newUser: User;
  onSelectedUserChange: (user: User | null) => void;
  onNewUserChange: (user: User) => void;
  onAddUser: () => void;
  onUpdateUser: () => void;
}

const UserDialog = ({
  isOpen,
  onOpenChange,
  selectedUser,
  newUser,
  onSelectedUserChange,
  onNewUserChange,
  onAddUser,
  onUpdateUser
}: UserDialogProps) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      onUpdateUser();
    } else {
      onAddUser();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? "Update the user details below." 
                : "Fill in the information to create a new user."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={selectedUser ? selectedUser.name : newUser.name}
                onChange={(e) => 
                  selectedUser 
                    ? onSelectedUserChange({...selectedUser, name: e.target.value})
                    : onNewUserChange({...newUser, name: e.target.value})
                }
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={selectedUser ? selectedUser.email : newUser.email}
                onChange={(e) => 
                  selectedUser 
                    ? onSelectedUserChange({...selectedUser, email: e.target.value})
                    : onNewUserChange({...newUser, email: e.target.value})
                }
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <Select
                value={selectedUser ? selectedUser.role : newUser.role}
                onValueChange={(value) => 
                  selectedUser 
                    ? onSelectedUserChange({...selectedUser, role: value})
                    : onNewUserChange({...newUser, role: value})
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Status
                </label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value: "Active" | "Inactive") => 
                    onSelectedUserChange({...selectedUser, status: value})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedUser ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
