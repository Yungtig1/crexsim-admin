import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import PaymentRequest from "@/models/PaymentRequest"

export async function GET() {
  await dbConnect()

  try {
    const requests = await PaymentRequest.find().populate("userId", "name email").sort({ createdAt: -1 })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching payment requests:", error)
    return NextResponse.json({ error: "An error occurred while fetching payment requests" }, { status: 500 })
  }
}

