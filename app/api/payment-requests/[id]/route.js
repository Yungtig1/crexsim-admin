import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import PaymentRequest from "@/models/PaymentRequest"
import User from "@/models/User"

export async function PATCH(request, { params }) {
  await dbConnect()

  try {
    const id = (await params).id
    const { status } = await request.json()

    const paymentRequest = await PaymentRequest.findById(id)
    if (!paymentRequest) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 })
    }

    // If approving the payment, update the user's balance
    if (status === "approved") {
      const user = await User.findById(paymentRequest.userId)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      user.balance = (user.balance || 0) + paymentRequest.amount
      await user.save()
    }

    paymentRequest.status = status
    await paymentRequest.save()

    return NextResponse.json({ message: "Payment request updated successfully" })
  } catch (error) {
    console.error("Error updating payment request:", error)
    return NextResponse.json({ error: "An error occurred while updating the payment request" }, { status: 500 })
  }
}

