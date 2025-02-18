import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export async function GET() {
  await dbConnect()

  try {
    const users = await User.find().select("-password")
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "An error occurred while fetching users" }, { status: 500 })
  }
}