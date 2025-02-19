import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import PaymentRequest from "@/models/PaymentRequest"


export async function DELETE(request, { params }) {
  await dbConnect()

  try {
    const { id } = params
    const paymentRequest = await PaymentRequest.findById(id)

    if (!paymentRequest) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 })
    }

    await PaymentRequest.findByIdAndDelete(id)

    return NextResponse.json({ message: "Payment request deleted successfully" })
  } catch (error) {
    console.error("Error deleting payment request:", error)
    return NextResponse.json({ error: "An error occurred while deleting the payment request" }, { status: 500 })
  }
}



