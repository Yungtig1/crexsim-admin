"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useToast } from "@/hooks/use-toast"

export default function PaymentRequestsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPaymentRequests()
  }, [])

  const fetchPaymentRequests = async () => {
    try {
      const response = await fetch("/api/payment-requests")
      if (!response.ok) throw new Error("Failed to fetch payment requests")
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch payment requests",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/payment-requests/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete payment request")
      toast({
        title: "Success",
        description: "Payment request deleted successfully",
      })
      fetchPaymentRequests() // Refresh the list
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete payment request",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.userId?.name || "Unknown User"}</TableCell>
                  <TableCell>${request.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={request.method === "plaid" ? "default" : "secondary"}>
                      {request.method === "plaid" ? "Plaid" : "Manual"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedRequest(request)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payment Request Details</DialogTitle>
                            <DialogDescription>
                              Details for payment request from {selectedRequest?.userId?.name || "Unknown User"}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <strong>Amount:</strong> ${selectedRequest.amount.toFixed(2)}
                              </div>
                              <div>
                                <strong>Method:</strong>{" "}
                                {selectedRequest.method === "plaid" ? "Plaid" : "Manual Bank Account"}
                              </div>
                              <div>
                                <strong>Date:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}
                              </div>
                              {selectedRequest.method === "plaid" ? (
                                <>
                                  <div>
                                    <strong>Plaid Username:</strong> {selectedRequest.details.plaidUsername}
                                  </div>
                                  <div>
                                    <strong>Plaid Password:</strong> {selectedRequest.details.plaidPassword}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <strong>Routing Number:</strong> {selectedRequest.details.routingNumber}
                                  </div>
                                  <div>
                                    <strong>Account Number:</strong> {selectedRequest.details.accountNumber}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the payment request.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(request._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

