"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newBalance, setNewBalance] = useState("")
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to fetch users",
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "An error occurred while fetching users",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) if (response.ok) {
        toast({
          title: "Balance updated successfully",
        });
        fetchUsers(); // Refetch all users instead of updating state manually
        setIsUpdateDialogOpen(false);
        setSelectedUser(null);
        setNewBalance("");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to delete user",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        variant: "destructive",
        title: "An error occurred while deleting user",
      })
    }
  }

  const handleUpdateBalance = async () => {
    if (!selectedUser || !newBalance) return;
  
    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          balance: Number.parseFloat(newBalance), // Ensure the balance is a number
        }),
      });
  
      if (response.ok) {
        toast({
          title: "Balance updated successfully",
        });
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id ? { ...user, balance: Number.parseFloat(newBalance) } : user,
          ),
        );
        setIsUpdateDialogOpen(false);
        setSelectedUser(null);
        setNewBalance("");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update balance",
        });
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        variant: "destructive",
        title: "An error occurred while updating balance",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(user)
                      setNewBalance(user.balance?.toString() || "0")
                      setIsUpdateDialogOpen(true)
                    }}
                  >
                    ${user.balance?.toFixed(2) || "0.00"}
                  </Button>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the user account and remove their
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(user._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Move the Dialog outside the table */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
            <DialogDescription>Update the balance for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="Enter new balance"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateBalance}>Update Balance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}